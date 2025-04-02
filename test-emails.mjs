import fetch from 'node-fetch';

const testEmails = async () => {
  const emails = [
    'joshpenny6@gmail.com',
    'josh.penny@ascendantcapital.ca'
  ];

  for (const email of emails) {
    try {
      console.log(`\nSending test email to ${email}...`);
      const response = await fetch('http://localhost:3000/api/send-welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: 'TestPassword123!',
          firstName: 'Josh'
        }),
      });

      const data = await response.json();
      console.log(`Response status:`, response.status);
      console.log(`Response data:`, JSON.stringify(data, null, 2));
      
      if (!data.success) {
        console.error(`Failed to send email to ${email}:`, data.error, data.details);
      } else {
        console.log(`Successfully sent email to ${email}`);
      }
    } catch (error) {
      console.error(`Error sending to ${email}:`, error);
    }
  }
};

console.log('Starting email tests...');
console.log('Make sure you have:');
console.log('1. Set up your Resend API key in .env.local');
console.log('2. Started your Next.js development server');
console.log('3. Verified the server is running at http://localhost:3000\n');

testEmails(); 