
import React, { useState, useEffect } from 'react';
import { FAMILY_NAME } from '../constants';

export type ViewType = 'home' | 'about' | 'glory' | 'initiatives' | 'talents' | 'projects' | 'occasions' | 'games' | 'admin';

interface NavbarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isAdminMode?: boolean;
  onAdminClick?: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isAdminMode, onAdminClick, theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { name: string; view: ViewType }[] = [
    { name: 'الرئيسية', view: 'home' },
    { name: 'عن العائلة', view: 'about' },
    { name: 'لوحة المجد', view: 'glory' },
    { name: 'أخبار العائلة', view: 'occasions' },
    { name: 'ألعابنا', view: 'games' },
    { name: 'المبادرات', view: 'initiatives' },
    { name: 'مواهبنا', view: 'talents' },
    { name: 'مشروعي الصغير', view: 'projects' },
  ];

  if (currentView === 'admin') return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled || currentView !== 'home'
          ? 'py-4' 
          : 'py-8'
      }`}>
        <div className={`container mx-auto px-6 transition-all duration-500 ${
           isScrolled || currentView !== 'home' 
           ? 'max-w-6xl' 
           : 'max-w-full'
        }`}>
          <div className={`flex justify-between items-center p-4 rounded-[2rem] transition-all duration-500 ${
            isScrolled || currentView !== 'home'
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 dark:border-white/5'
            : 'bg-transparent'
          }`}>
            
            <button 
              onClick={() => { setView('home'); window.scrollTo(0, 0); }} 
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg transform group-hover:rotate-12 transition-transform">أ</div>
              <span className={`text-xl font-black tracking-tighter transition-colors ${
                isScrolled || currentView !== 'home' 
                ? 'text-emerald-700 dark:text-emerald-400' 
                : 'text-slate-900 dark:text-white'
              }`}>
                {FAMILY_NAME}
              </span>
            </button>
            
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => {
                    setView(link.view);
                    window.scrollTo(0, 0);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    currentView === link.view 
                      ? 'bg-emerald-600 text-white shadow-lg' 
                      : `hover:bg-emerald-50 dark:hover:bg-emerald-900/30 ${isScrolled || currentView !== 'home' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-800 dark:text-slate-100'}`
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl border transition-all hover:scale-110 active:scale-95 ${
                  isScrolled || currentView !== 'home'
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-amber-400'
                  : 'bg-white/10 border-white/20 text-white backdrop-blur-md'
                }`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-emerald-600 text-white shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-16 6h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[150] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className={`absolute left-0 top-0 bottom-0 w-[80%] max-w-[300px] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 p-8 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">أ</div>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{FAMILY_NAME}</span>
           </div>
           <div className="flex flex-col gap-2">
             {navLinks.map((link) => (
               <button
                 key={link.view}
                 onClick={() => { setView(link.view); setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}
                 className={`text-right p-4 rounded-2xl text-lg font-bold transition-all ${
                   currentView === link.view ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                 }`}
               >
                 {link.name}
               </button>
             ))}
           </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
