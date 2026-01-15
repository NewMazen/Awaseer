
import React from 'react';

/**
 * مكون الانتقال السلس بين الصفحات
 */
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both ease-out">
    {children}
  </div>
);

/**
 * تأثير الاحتفال (Confetti) لصفحة لوحة المجد
 */
export const ConfettiEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(40)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-2 h-2 animate-confetti" 
          style={{ 
            backgroundColor: i % 2 === 0 ? '#10b981' : '#f59e0b',
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 3}s`
          }}
        ></div>
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation-name: confetti;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};
