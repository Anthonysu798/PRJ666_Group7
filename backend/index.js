import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { connectDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";
import aiRoutes from './routes/ai.routes.js';
import userStatsRoutes from './routes/userStats.route.js';
import publicRouter from './routes/public.route.js';
import stripeRouter from './routes/stripe.route.js';
import Stripe from 'stripe';
import { User } from "./models/user.model.js";

dotenv.config(); // Load environment variables

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const apiUrl = process.env.FRONTEND_URL;

// Middleware for Stripe webhooks - must come before express.json()
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      payload, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    console.log("Webhook received:", event.type);
    
    // Handle the webhook event directly here
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const plan = session.metadata.plan;
      const isUpgrade = session.metadata.isUpgrade === 'true';
      
      console.log("Checkout session completed:", {
        userId,
        plan,
        isUpgrade,
        paymentStatus: session.payment_status
      });
      
      try {
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
          console.error('User not found:', userId);
          return res.status(400).send('User not found');
        }

        // Update user subscription details
        const updateData = {
          'subscription.plan': isUpgrade ? 'premium' : plan,
          'subscription.status': 'active',
          'subscription.stripeCustomerId': session.customer,
          'role': isUpgrade ? 'premium-user' : `${plan}-user`
        };
        
        if (isUpgrade) {
          updateData['subscription.upgradedFrom'] = session.metadata.previousPlan;
          updateData['subscription.upgradeDate'] = new Date();
        }

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: updateData },
          { new: true, runValidators: true }
        );
        
        console.log(`Updated user subscription:`, {
          userId,
          newPlan: updatedUser.subscription.plan,
          newStatus: updatedUser.subscription.status,
          newRole: updatedUser.role
        });
      } catch (error) {
        console.error('Error updating user subscription:', error);
        return res.status(500).send('Error updating user subscription');
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Regular middleware
app.use(express.json());
app.use(cors({
  origin: apiUrl,  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter); // Auth routes
app.use("/api/profile", profileRouter); // Profile routes
app.use('/api/ai', aiRoutes);   // AI routes
app.use('/api/user', userStatsRoutes); // User stats routes
app.use('/api/public', publicRouter);
app.use('/api/stripe', stripeRouter); // Stripe routes

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});


