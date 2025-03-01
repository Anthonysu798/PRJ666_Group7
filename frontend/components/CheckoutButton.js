"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import dotenv from "dotenv";
dotenv.config();

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutButton({ plan, buttonColor, disabled, children, isUpgrade }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscription = async () => {
    try {
      setLoading(true);
      
      const endpoint = isUpgrade ? 'upgrade-subscription' : 'create-subscription';
      const planParam = isUpgrade ? 'newPlan' : 'plan';
      
      // Make sure plan is defined and is a string
      if (!plan) {
        throw new Error('Plan is required');
      }
      
      const requestBody = {};
      requestBody[planParam] = plan.toLowerCase();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/${endpoint}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process subscription');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(error.message || 'Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscription}
      disabled={disabled || loading}
      className={`w-full ${buttonColor} text-white rounded-lg py-3 px-6 font-medium 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 transform transition-all duration-200 hover:scale-105'}
        ${loading ? 'animate-pulse' : ''}`}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
}
