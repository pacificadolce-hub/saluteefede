import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { packageId, customerEmail, customerName, customerPhone } = req.body;

    // Get package from Supabase
    const { data: pkg, error: pkgError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (pkgError || !pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
      // Demo mode - save order and return success
      await supabase.from('orders').insert({
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        package_id: pkg.id,
        amount: pkg.price,
        stripe_payment_id: 'demo_' + Date.now(),
        status: 'completed',
      });

      return res.json({
        sessionId: 'demo_session',
        url: `${process.env.CLIENT_URL || 'https://saluteefede.com'}/checkout/success?demo=true`
      });
    }

    // Create Stripe session
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: pkg.name,
              description: pkg.short_description || pkg.description || '',
              images: pkg.image_url ? [pkg.image_url] : [],
            },
            unit_amount: Math.round(pkg.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'https://saluteefede.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'https://saluteefede.com'}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        packageId: pkg.id,
        customerName,
        customerPhone,
      },
    });

    return res.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Checkout error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
