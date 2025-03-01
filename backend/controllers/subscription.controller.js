import stripe from '../utils/stripe.js';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

export const createSubscription = async (req, res) => {
    try {
      const { userId, plan } = req.body; // Get user & plan from request
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // If user doesn't have a Stripe customer ID, create one
      if (!user.subscription.stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
        });
  
        user.subscription.stripeCustomerId = customer.id;
        await user.save();
      }
  
      // Create a new Stripe subscription
      const subscription = await stripe.subscriptions.create({
        customer: user.subscription.stripeCustomerId,
        items: [{ price: process.env[`STRIPE_PRICE_ID_${plan.toUpperCase()}`] }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });
  
      // Update user model with Stripe subscription
      user.subscription.stripeSubscriptionId = subscription.id;
      user.subscription.status = subscription.status;
      user.subscription.plan = plan;
      user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000); // Convert Unix timestamp to Date object for better readability 
      await user.save();
  
      res.json({ subscriptionId: subscription.id, clientSecret: subscription.latest_invoice.payment_intent.client_secret });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  };