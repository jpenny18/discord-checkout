import { Order } from '@/types';

function getFormattedDate(timestamp: { toDate: () => Date } | Date | undefined): string {
  if (!timestamp) {
    return new Date().toLocaleString();
  }
  if ('toDate' in timestamp) {
    return timestamp.toDate().toLocaleString();
  }
  return timestamp.toLocaleString();
}

export function generateOrderConfirmationEmail(order: Order) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Confirmation - Ascendant Academy</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: #151515;
            color: #ffc62d;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background: #fff;
          }
          .order-details {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
          </div>
          <div class="content">
            <p>Thank you for your order with Ascendant Academy!</p>
            
            <div class="order-details">
              <h2>Order Details</h2>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Date:</strong> ${getFormattedDate(order.timestamp)}</p>
              <p><strong>Plan:</strong> ${order.plan}</p>
              <p><strong>Duration:</strong> ${order.duration}</p>
              <p><strong>Amount:</strong> $${order.amount}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            </div>

            <p>Your access will be activated shortly. You'll receive further instructions via Discord.</p>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Ascendant Academy. All rights reserved.</p>
            <p>support@ascendantcapital.ca</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generateAdminOrderNotificationEmail(order: Order) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>New Order Notification</title>
      </head>
      <body>
        <h1>New Order Received</h1>
        
        <h2>Order Details</h2>
        <ul>
          <li>Order ID: ${order.id}</li>
          <li>Date: ${getFormattedDate(order.timestamp)}</li>
          <li>Plan: ${order.plan}</li>
          <li>Duration: ${order.duration}</li>
          <li>Amount: $${order.amount}</li>
          <li>Payment Method: ${order.paymentMethod}</li>
        </ul>

        <h2>Customer Details</h2>
        <ul>
          <li>Name: ${order.firstName} ${order.lastName}</li>
          <li>Email: ${order.email}</li>
          <li>Discord Username: ${order.discordUsername}</li>
        </ul>

        <p>Please process this order as soon as possible.</p>
      </body>
    </html>
  `;
} 