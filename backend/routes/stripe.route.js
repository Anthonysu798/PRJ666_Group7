import express from "express";
import stripe from "../utils/stripe.js";
import { User } from "../models/user.model.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Export a function to handle webhooks
export const handleWebhook = async (event, res) => {
  console.log("Processing webhook event:", event.type);

  switch (event.type) {
    case "checkout.session.completed":
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
      break;

    case "invoice.payment_succeeded":
      const subscription = event.data.object.subscription;
      const user = await User.findOne({ "subscription.stripeSubscriptionId": subscription });

      if (user) {
        await User.findByIdAndUpdate(user._id, {
          $set: {
            'subscription.status': 'active',
            'subscription.currentPeriodEnd': new Date(event.data.object.period_end * 1000)
          }
        }, { runValidators: true });
      }
      break;

    case "customer.subscription.updated":
      const sub = event.data.object;
      const updatedUser = await User.findOne({ "subscription.stripeSubscriptionId": sub.id });

      if (updatedUser) {
        await User.findByIdAndUpdate(updatedUser._id, {
          $set: {
            'subscription.status': sub.status,
            'subscription.currentPeriodEnd': new Date(sub.current_period_end * 1000)
          }
        }, { runValidators: true });
      }
      break;

    case "customer.subscription.deleted":
      const canceledSub = event.data.object;
      const canceledUser = await User.findOne({ "subscription.stripeSubscriptionId": canceledSub.id });

      if (canceledUser) {
        canceledUser.subscription.status = "canceled";
        canceledUser.subscription.canceledAt = new Date();
        await canceledUser.save();
      }
      break;
  }

  return res.json({ received: true });
};

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Webhook event received:", event.type);

  switch (event.type) {
    case "checkout.session.completed":
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
      break;

    case "invoice.payment_succeeded":
      const subscription = event.data.object.subscription;
      const user = await User.findOne({ "subscription.stripeSubscriptionId": subscription });

      if (user) {
        await User.findByIdAndUpdate(user._id, {
          $set: {
            'subscription.status': 'active',
            'subscription.currentPeriodEnd': new Date(event.data.object.period_end * 1000)
          }
        }, { runValidators: true });
      }
      break;

    case "customer.subscription.updated":
      const sub = event.data.object;
      const updatedUser = await User.findOne({ "subscription.stripeSubscriptionId": sub.id });

      if (updatedUser) {
        await User.findByIdAndUpdate(updatedUser._id, {
          $set: {
            'subscription.status': sub.status,
            'subscription.currentPeriodEnd': new Date(sub.current_period_end * 1000)
          }
        }, { runValidators: true });
      }
      break;

    case "customer.subscription.deleted":
      const canceledSub = event.data.object;
      const canceledUser = await User.findOne({ "subscription.stripeSubscriptionId": canceledSub.id });

      if (canceledUser) {
        canceledUser.subscription.status = "canceled";
        canceledUser.subscription.canceledAt = new Date();
        await canceledUser.save();
      }
      break;
  }

  res.json({ received: true });
});

router.post("/create-subscription", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { plan } = req.body;

    console.log('Creating subscription for:', { userId, plan });

    if (!plan) {
      return res.status(400).json({ message: "Plan is required" });
    }

    const planUpperCase = plan.toUpperCase();
    const priceId = process.env[`STRIPE_PRICE_ID_${planUpperCase}`];
    
    if (!priceId) {
      return res.status(400).json({ message: `Invalid plan: ${plan}` });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: "User not found" });
    }

    let customerId = user.subscription?.stripeCustomerId;
    if (!customerId) {
      console.log('Creating new Stripe customer for:', user.email);
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      customerId = customer.id;
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/payment-canceled`,
      metadata: {
        userId: userId.toString(),
        plan: plan
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Detailed subscription error:', {
      message: error.message,
      stack: error.stack,
      type: error.type,
      code: error.code,
    });
    res.status(500).json({ message: error.message });
  }
});

// Add a new route to handle successful payments
router.get("/session-status", protect, async (req, res) => {
  const { sessionId } = req.query;
  
  try {
    console.log("Checking session status:", sessionId);
    
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Session retrieved:", {
      id: session.id,
      paymentStatus: session.payment_status,
      customer: session.customer,
      metadata: session.metadata
    });
    
    if (session.payment_status === 'paid') {
      const isUpgrade = session.metadata.isUpgrade === 'true';
      const plan = isUpgrade ? 'premium' : session.metadata.plan;
      
      console.log("Payment successful, updating user:", {
        userId: req.user._id,
        plan,
        isUpgrade
      });
      
      // Update user subscription details
      const updateData = {
        'subscription.plan': plan,
        'subscription.status': 'active',
        'subscription.stripeCustomerId': session.customer,
        'role': `${plan}-user`
      };
      
      if (isUpgrade) {
        updateData['subscription.upgradedFrom'] = session.metadata.previousPlan;
        updateData['subscription.upgradeDate'] = new Date();
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      console.log("User updated successfully:", {
        id: updatedUser._id,
        plan: updatedUser.subscription.plan,
        status: updatedUser.subscription.status,
        role: updatedUser.role
      });
    }

    res.json({ 
      status: session.payment_status,
      customer: session.customer,
      plan: session.metadata.plan
    });
  } catch (error) {
    console.error('Session status error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add this new route for handling subscription upgrades
router.post("/upgrade-subscription", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { newPlan } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the current subscription
    const currentSubscription = await stripe.subscriptions.list({
      customer: user.subscription.stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    if (!currentSubscription.data.length) {
      return res.status(400).json({ message: "No active subscription found" });
    }

    // First update the subscription to Premium
    await stripe.subscriptions.update(
      currentSubscription.data[0].id,
      {
        items: [{
          id: currentSubscription.data[0].items.data[0].id,
          price: process.env.STRIPE_PRICE_ID_PREMIUM,
        }],
        proration_behavior: 'always_invoice', // This will create a proration invoice
      }
    );

    // Create a checkout session for the proration payment
    const session = await stripe.checkout.sessions.create({
      customer: user.subscription.stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'payment', // One-time payment for the upgrade
      line_items: [
        {
          price_data: { // Use price_data for one-time payments
            currency: 'usd',
            product_data: {
              name: 'Upgrade to Premium Plan',
              description: 'One-time upgrade fee from Standard to Premium plan',
            },
            unit_amount: 999, // $9.99 in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}&upgrade=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/payment-canceled`,
      metadata: {
        userId: userId.toString(),
        plan: newPlan,
        isUpgrade: 'true',
        previousPlan: user.subscription.plan,
        previousSubscriptionId: currentSubscription.data[0].id
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Subscription upgrade error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;