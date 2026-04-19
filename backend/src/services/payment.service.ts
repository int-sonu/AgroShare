import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

export const createPaymentIntent = async (amount: number, currency: string = 'inr') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  } catch (error: any) {
    throw new Error(`Stripe error: ${error.message}`, { cause: error });
  }
};

export const getPaymentIntent = async (paymentIntentId: string) => {
  return stripe.paymentIntents.retrieve(paymentIntentId);
};
