const testEmails = async () => {
  const emails = [
    'joshpenny6@gmail.com',
    'josh.penny@ascendantcapital.ca'
  ];

  for (const email of emails) {
    try {
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
      console.log(`Result for ${email}:`, data);
    } catch (error) {
      console.error(`Error sending to ${email}:`, error);
    }
  }
};

testEmails(); 