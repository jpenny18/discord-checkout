import { useState } from 'react';
import { motion } from 'framer-motion';

interface PlatinumToggleProps {
  onToggle?: (isOn: boolean) => void;
}

export default function PlatinumToggle({ onToggle }: PlatinumToggleProps) {
  const [isOn, setIsOn] = useState(true);

  const handleToggle = () => {
    setIsOn(!isOn);
    onToggle?.(!isOn);
  };

  return (
    <div className="flex flex-col items-center p-8 border border-[#232323] rounded-2xl bg-black max-w-[500px] mx-auto relative overflow-hidden">
      {/* Noise Background */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="absolute inset-0 bg-repeat bg-noise opacity-20" />
      </div>

      <div className="w-full relative">
        {/* Toggle Section */}
        <div className="bg-black p-6 rounded-lg border border-[#232323] mb-4">
          <div className="flex items-center justify-center gap-4">
            {/* Toggle Container */}
            <motion.div
              className="w-[70px] h-[35px] bg-[#111] rounded-full cursor-pointer flex items-center relative overflow-hidden"
              onClick={handleToggle}
              style={{
                boxShadow: '0 0 15px rgba(255, 198, 45, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Background Highlight */}
              <div 
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isOn ? 'opacity-20' : 'opacity-0'
                }`}
                style={{
                  background: 'linear-gradient(90deg, transparent, #ffc62d, transparent)'
                }}
              />
              
              {/* Text Label */}
              <div className="absolute inset-0 flex items-center">
                <motion.span 
                  className="text-xs font-medium text-white"
                  initial={false}
                  animate={{
                    x: isOn ? 10 : 40,
                    opacity: 1
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 35,
                    duration: 0.7
                  }}
                >
                  {isOn ? 'On' : 'Off'}
                </motion.span>
              </div>

              {/* Sliding Circle */}
              <motion.div
                className="w-[25px] h-[25px] bg-[#ffc62d] rounded-full absolute left-1"
                animate={{
                  x: isOn ? 38 : 0,
                  backgroundColor: isOn ? '#ffc62d' : '#888'
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 35,
                  duration: 0.7
                }}
                style={{
                  boxShadow: '0 0 10px rgba(255, 198, 45, 0.5)'
                }}
              />
            </motion.div>
            
            <span className="text-sm font-normal text-gray-400">
              Ascendant
            </span>
          </div>
        </div>

        {/* Interactive Buttons */}
        <div className="bg-black p-4 rounded-lg border border-[#232323] mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {['Support', 'Community', 'Resources'].map((text) => (
              <motion.button
                key={text}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border border-[#232323]
                  ${isOn ? 'bg-[#111] text-white hover:bg-[#191919]' : 'bg-black text-gray-600'}`}
                style={{
                  boxShadow: isOn ? '0 0 15px rgba(255, 198, 45, 0.15)' : 'none'
                }}
                whileHover={isOn ? { scale: 1.02, boxShadow: '0 0 20px rgba(255, 198, 45, 0.2)' } : {}}
                whileTap={isOn ? { scale: 0.98 } : {}}
              >
                {text}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Header and Description */}
        <div className="text-center p-6 border border-[#232323] rounded-lg bg-black">
          <h2 className="text-3xl font-bold mb-4 tracking-tight uppercase">
            Educational Resources
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Access our comprehensive library of courses, tutorials, webinars, and articles covering various trading topics.
          </p>
        </div>
      </div>
    </div>
  );
} 