'use client';

import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="flex items-center mb-8">
          <Link 
            href="/"
            className="flex items-center text-[#ffc62d] hover:text-[#e5b228] transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Cookie Policy for AscendantAcademy.ca</h1>
        <p className="text-gray-400 mb-8">Last Updated: November 2025</p>
        
        <div className="space-y-6 text-gray-300">
          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <p className="mb-4">Ascendant Academy ("we", "us", or "our") uses cookies and similar tracking technologies on AscendantAcademy.ca and all associated pages, dashboards, and sub-domains (the "Site"). This Cookie Policy explains what cookies are, how we use them, and the choices you have regarding their use.</p>
            <p>By using our Site, you consent to the use of cookies in accordance with this policy.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">1. What Are Cookies?</h2>
            <p className="mb-4">Cookies are small text files placed on your device when you visit a website. They help the site remember your actions and preferences so you don't have to re-enter information each time.</p>
            <p className="mb-2">Cookies may be:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Session cookies – removed when you close your browser</li>
              <li>Persistent cookies – stored until they expire or are deleted</li>
              <li>First-party cookies – set by us</li>
              <li>Third-party cookies – set by external services (e.g., analytics tools)</li>
            </ul>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">2. How We Use Cookies</h2>
            <p className="mb-6">We use cookies for several purposes to ensure the smooth operation of the Site and to improve your user experience.</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">2.1. Essential Cookies</h3>
                <p className="mb-3">These cookies are required for basic site functionality, including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Logging into your account or dashboard</li>
                  <li>Providing secure access to subscription content</li>
                  <li>Processing payments through our payment partners</li>
                  <li>Remembering your cookie preferences</li>
                </ul>
                <p className="mt-3">Without these cookies, certain features may not function properly.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">2.2. Performance & Analytics Cookies</h3>
                <p className="mb-3">These cookies help us understand how visitors use the site so we can improve performance. We may use tools such as:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Google Analytics</li>
                  <li>TikTok Pixel</li>
                  <li>Meta/Facebook Pixel</li>
                  <li>YouTube analytics</li>
                  <li>Other analytics or heat-mapping tools</li>
                </ul>
                <p className="mt-3 mb-3">These cookies collect anonymous traffic data such as:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pages visited</li>
                  <li>Time spent on pages</li>
                  <li>Links clicked</li>
                  <li>Device types</li>
                  <li>General location (city-level)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">2.3. Advertising & Retargeting Cookies</h3>
                <p className="mb-3">These cookies help us deliver relevant ads and measure their effectiveness. They may be set by:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Google Ads</li>
                  <li>Facebook/Instagram</li>
                  <li>TikTok</li>
                  <li>YouTube</li>
                  <li>Third-party platforms used for marketing campaigns</li>
                </ul>
                <p className="mt-3 mb-3">These cookies may track:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your browsing activity on our Site</li>
                  <li>Whether you visited after viewing one of our ads</li>
                  <li>User interests for ad personalization</li>
                </ul>
                <p className="mt-3">You may see ads for Ascendant Academy on other websites as a result of these cookies.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">2.4. Functional Cookies</h3>
                <p className="mb-3">These cookies enhance your experience by remembering preferences such as:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Login session</li>
                  <li>Language or region</li>
                  <li>Saved settings on your dashboard</li>
                  <li>Custom features/tools you use in our trading tools</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">3. Third-Party Cookies</h2>
            <p className="mb-4">We may allow third-party services to place cookies on your device for analytics, advertising, or integration features. These parties may collect data independently and have their own privacy policies.</p>
            <p className="mb-3">Common third parties include:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Google</li>
              <li>TikTok</li>
              <li>Meta (Facebook/Instagram)</li>
              <li>YouTube</li>
              <li>Stripe or other payment partners</li>
              <li>Heatmap/analytics tools</li>
              <li>Chat/AI widget providers</li>
            </ul>
            <p className="mt-4">We do not control these third-party cookies.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">4. Your Cookie Choices</h2>
            <p className="mb-6">You have several options to manage cookies:</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">4.1. Browser Controls</h3>
                <p className="mb-3">Most browsers allow you to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Delete cookies</li>
                  <li>Block cookies</li>
                  <li>Clear browsing data</li>
                  <li>Set cookie preferences</li>
                </ul>
                <p className="mt-3">Check your browser's support pages for instructions.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">4.2. Opt-Out Tools for Advertising Cookies</h3>
                <p className="mb-3">You may opt out of personalized advertising via:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Google Ads: <a href="https://adssettings.google.com" className="text-[#ffc62d] hover:underline" target="_blank" rel="noopener noreferrer">https://adssettings.google.com</a></li>
                  <li>Facebook Ads: <a href="https://www.facebook.com/ads/preferences" className="text-[#ffc62d] hover:underline" target="_blank" rel="noopener noreferrer">https://www.facebook.com/ads/preferences</a></li>
                  <li>TikTok Ads: <a href="https://www.tiktok.com/safety/en/privacy-security" className="text-[#ffc62d] hover:underline" target="_blank" rel="noopener noreferrer">https://www.tiktok.com/safety/en/privacy-security</a></li>
                  <li>AdChoices (industry-wide): <a href="https://youradchoices.ca/" className="text-[#ffc62d] hover:underline" target="_blank" rel="noopener noreferrer">https://youradchoices.ca/</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">4.3. Cookie Banner</h3>
                <p className="mb-3">When you first visit our Site, you may see a cookie banner allowing you to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Accept all cookies</li>
                  <li>Reject non-essential cookies</li>
                  <li>Customize cookie preferences</li>
                </ul>
                <p className="mt-3">Your selections will be stored in your browser until cleared.</p>
              </div>
            </div>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">5. Do Not Track (DNT) Signals</h2>
            <p>Our Site does not currently respond to "Do Not Track" signals due to the lack of a universal technical standard.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">6. Changes to This Cookie Policy</h2>
            <p>We may update this Cookie Policy periodically. Any changes will be posted on this page with an updated "Last Updated" date.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">7. Contact Us</h2>
            <p className="mb-2">If you have any questions about this Cookie Policy or how we use cookies, you can contact us at:</p>
            <p className="mt-4">Ascendant Academy</p>
            <p>Support Email: <a href="mailto:support@ascendantacademy.ca" className="text-[#ffc62d] hover:underline">support@ascendantacademy.ca</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}

