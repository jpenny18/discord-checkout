import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email';
import { generateOrderConfirmationEmail, generateAdminOrderNotificationEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
  try {
    const { userData, amount, paymentMethod, customerId, selectedPlan } = await request.json();

    // Create order in Firestore
    const orderRef = await adminDb.collection('orders').add({
      ...userData,
      amount,
      paymentMethod,
      stripeCustomerId: customerId,
      status: 'completed',
      timestamp: new Date(),
      plan: selectedPlan.name || 'Unknown Plan',
      duration: selectedPlan.duration || 'N/A',
    });

    const orderData = {
      id: orderRef.id,
      ...userData,
      amount,
      paymentMethod,
      stripeCustomerId: customerId,
      status: 'completed',
      timestamp: new Date(),
      plan: selectedPlan.name || 'Unknown Plan',
      duration: selectedPlan.duration || 'N/A',
    };

    // Send customer confirmation email
    try {
      await sendEmail({
        to: userData.email,
        subject: 'Order Confirmation - Ascendant Academy',
        text: `Thank you for your order! Order ID: ${orderRef.id}`,
        html: generateOrderConfirmationEmail(orderData),
      });
    } catch (emailError) {
      console.error('Failed to send customer confirmation email:', emailError);
    }

    // Send admin notification email
    try {
      await sendEmail({
        to: 'support@ascendantcapital.ca',
        subject: `New Order Received - ${orderRef.id}`,
        text: `New order received from ${userData.email}`,
        html: generateAdminOrderNotificationEmail(orderData),
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
    }

    return NextResponse.json({
      success: true,
      orderId: orderRef.id,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create order',
      },
      { status: 500 }
    );
  }
} 