'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#232323] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Brand Section */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Image
                src="/images/logo.png"
                alt="Ascendant Academy Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <p className="text-gray-400 text-sm italic">Ascend to new heights</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#ffc62d] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ffc62d] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.151 18.939c-.203.271-.428.393-.677.393-.141 0-.281-.03-.419-.089l-4.71-2.715c-.548-.315-.848-.903-.848-1.528v-5.5c0-.626.3-1.213.848-1.528l4.71-2.715c.138-.059.278-.089.419-.089.249 0 .474.121.677.393.203.271.305.545.305.823v10.732c0 .278-.102.552-.305.823z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ffc62d] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ffc62d] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.887 2.745.097.118.112.221.082.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Links Row */}
        <div className="flex flex-wrap justify-center items-center gap-1 md:gap-6 mb-12">
          <Link href="/terms" className="text-gray-400 hover:text-[#ffc62d] transition-colors text-[8px] md:text-sm">
            Terms & Conditions
          </Link>
          <span className="text-gray-600 text-[8px] md:text-sm">|</span>
          <Link href="/privacy" className="text-gray-400 hover:text-[#ffc62d] transition-colors text-[8px] md:text-sm">
            Privacy Policy
          </Link>
          <span className="text-gray-600 text-[8px] md:text-sm">|</span>
          <Link href="/cookies" className="text-gray-400 hover:text-[#ffc62d] transition-colors text-[8px] md:text-sm">
            Cookie Policy
          </Link>
          <span className="text-gray-600 text-[8px] md:text-sm">|</span>
          <a href="mailto:support@ascendantacademy.com" className="text-gray-400 hover:text-[#ffc62d] transition-colors text-[8px] md:text-sm">
            Contact
          </a>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-[#232323]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[10px] text-gray-500 leading-relaxed">
            {/* Left Column */}
            <div className="space-y-4">
              <p>
                If you do not agree with any term or provision of our Terms and Conditions you should not use our Site, Services, Content or Information. Please be advised that your continued use of the Site, Services, Content, or Information provided shall indicate your consent and agreement to our Terms and Conditions.
              </p>
              
              <p>
                Ascendant Academy may publish testimonials or descriptions of past performance but these results are NOT typical, are not indicative of future results or performance, and are not intended to be a representation, warranty or guarantee that similar results will be obtained by you.
              </p>
              
              <p>
                Penny Pips's experience with trading is not typical, nor is the experience of traders featured in testimonials. They are experienced traders. Becoming an experienced trader takes hard work, dedication and a significant amount of time.
              </p>
              
              <p>
                Your results may differ materially from those expressed or utilized by Ascendant Academy due to a number of factors. We do not track the typical results of our past or current customers. As a provider of educational courses, we do not have access to the personal trading accounts, exchange or brokerage statements of our customers. As a result, we have no reason to believe our customers perform better or worse than traders as a whole.
              </p>
              
              <p>
                Available research data suggests that most day traders are NOT profitable.
              </p>
              
              <p>
                In a research paper published in 2014 titled "Do Day Traders Rationally Learn About Their Ability?", professors from the University of California studied 3.7 billion trades from the Taiwan Stock Exchange between 1992-2006 and found that only 9.81% of day trading volume was generated by predictably profitable traders and that these predictably profitable traders constitute less than 3% of all day traders on an average day.
              </p>
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              <p>
                In a 2005 article published in the Journal of Applied Finance titled "The Profitability of Active Stock Traders" professors at the University of Oxford and the University College Dublin found that out of 1,146 brokerage accounts day trading the U.S. markets between March 8, 2000 and June 13, 2000, only 50% were profitable with an average net profit of $16,619.
              </p>
              
              <p>
                In a 2003 article published in the Financial Analysts Journal titled "The Profitability of Day Traders", professors at the University of Texas found that out of 334 brokerage accounts day trading the U.S. markets between February 1998 and October 1999, only 35% were profitable and only 14% generated profits in excess of $10,000.
              </p>
              
              <p>
                The range of results in these three studies exemplify the challenge of determining a definitive success rate for day traders. At a minimum, these studies indicate at least 50% of aspiring day traders will not be profitable. This reiterates that consistently making money trading stocks is not easy. Day Trading is a high risk activity and can result in the loss of your entire investment. Any trade or investment is at your own risk.
              </p>
              
              <p>
                Any and all information discussed is for educational and informational purposes only and should not be considered tax, legal or investment advice. A referral to a stock or commodity is not an indication to buy or sell that stock or commodity.
              </p>
              
              <p>
                This does not represent our full Disclaimer. Please read our complete disclaimer.
              </p>
              
              <p className="mt-6">
                <strong>Citations for Disclaimer:</strong>
              </p>
              
              <p>
                – Barber, Brad & Lee, Yong-Ill & Liu, Yu-Jane & Odean, Terrance. (2014). Do Day Traders Rationally Learn About Their Ability?. SSRN Electronic Journal. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2535636
              </p>
              
              <p>
                – Garvey, Ryan and Murphy, Anthony, The Profitability of Active Stock Traders. Journal of Applied Finance , Vol. 15, No. 2, Fall/Winter 2005. Available at SSRN: https://ssrn.com/abstract=908615
              </p>
              
              <p>
                – Douglas J. Jordan & J. David Diltz (2003) The Profitability of Day Traders, Financial Analysts Journal, 59:6, 85-94, DOI: https://www.tandfonline.com/doi/abs/10.2469/faj.v59.n6.2578
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-[#232323]">
          <div className="text-center text-gray-400 text-sm">
            © 2025 Ascendant Academy LTD. All Rights Reserved.
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: 'radial-gradient(circle at center, #ffc62d 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>
    </footer>
  );
}
