import React from 'react';
import { AppData } from '../../types';
import { ViewType } from '../Navbar';

interface LandingProps {
  data: AppData;
  onEnter: (v: ViewType) => void;
  onAdminEnter: () => void;
}

export const LandingCover: React.FC<LandingProps> = ({ data, onEnter, onAdminEnter }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden transition-colors duration-700" dir="rtl">
      
      {/* عناصر زخرفية متحركة في الخلفية */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-100 dark:bg-amber-900/10 rounded-full blur-[120px] animate-blob animation-delay-2000 pointer-events-none"></div>

      {/* الترويسة العلوية - نمط صحفي بلمسة خطوط الجريدة */}
      <header className="container mx-auto px-6 pt-32 pb-12 relative z-10">
        
        {/* خط الجريدة العلوي الرفيع */}
        <div className="w-full h-[1px] bg-slate-900/10 dark:bg-white/10 mb-6"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 text-[10px] md:text-xs font-black text-emerald-600 dark:text-emerald-500 tracking-[0.3em] uppercase">
          <span className="order-2 md:order-1">{data.magazineIssue}</span>
          <span className="order-1 md:order-2 mb-4 md:mb-0 text-amber-600 dark:text-amber-500 text-sm italic font-serif">المجلة الرسمية لذرية محي الدين مليباري</span>
          <span className="order-3">{data.magazineDate}</span>
        </div>

        {/* خط الجريدة السفلي لبيانات الإصدار */}
        <div className="w-full h-[1px] bg-slate-900/10 dark:bg-white/10 mb-12"></div>
        
        <h1 className="text-[15vw] md:text-[12vw] font-[900] text-slate-900 dark:text-white leading-none tracking-tighter text-center mb-8 select-none">
          {data.magazineTitle}
        </h1>

        <div className="flex items-center justify-center gap-6">
          <div className="h-[1px] bg-emerald-600/30 flex-grow max-w-[100px] md:max-w-xs"></div>
          <span className="text-xl md:text-4xl font-black text-emerald-700 dark:text-emerald-400 tracking-widest whitespace-nowrap px-4">آل محي الدين</span>
          <div className="h-[1px] bg-emerald-600/30 flex-grow max-w-[100px] md:max-w-xs"></div>
        </div>

        {/* خط ختامي للترويسة يمتد لأسفل العنوان */}
        <div className="w-full h-[2px] bg-slate-900/5 dark:bg-white/5 mt-12"></div>
      </header>

      {/* المحتوى التفاعلي للغلاف */}
      <main className="flex-grow container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* الصورة الرئيسية بتنسيق فني */}
        <div className="relative order-2 lg:order-1 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-600/20 dark:bg-emerald-600/10 rounded-[2.5rem] blur-2xl group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative w-full max-w-sm aspect-[3/4] p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-700 rounded-[2rem] overflow-hidden">
              <div className="w-full h-full rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img src={data.founderImage} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" alt="الجد" />
              </div>
              <div className="absolute bottom-8 right-0 left-0 px-8">
                 <div className="bg-emerald-800/90 backdrop-blur-md p-6 border-r-4 border-amber-500 shadow-2xl">
                    <p className="text-[9px] font-black text-amber-400 uppercase tracking-[0.3em] mb-1">العميد والمؤسس</p>
                    <h3 className="text-2xl font-black text-white">{data.founderName}</h3>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* نصوص الافتتاحية */}
        <div className="text-right order-1 lg:order-2">
          <div className="inline-block px-4 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-black mb-6">مرحباً بكم في منصتكم</div>
          <h2 className="text-6xl md:text-8xl font-[900] text-slate-900 dark:text-white leading-[0.9] mb-8 tracking-tighter">
            {data.heroWelcome}
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed mb-12 max-w-xl border-r-4 border-emerald-600 pr-6">
            {data.heroIntro}
          </p>
          
          <div className="flex flex-wrap gap-4 md:gap-6">
            <button 
              onClick={() => onEnter('glory')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/40 transform hover:-translate-y-1 transition-all"
            >
              تصفح لوحة المجد
            </button>
            <button 
              onClick={() => onEnter('about')}
              className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              عن العائلة
            </button>
          </div>
        </div>
      </main>

      {/* شريط الإحصائيات أو التذييل الفني للغلاف */}
      <footer className="container mx-auto px-6 py-12 relative z-10 border-t border-slate-900/5 dark:border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <div className="text-center">
                <span className="block text-3xl font-black text-emerald-600">{data.achievements.length}+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">إنجاز عائلي</span>
             </div>
             <div className="w-[1px] h-8 bg-slate-200 dark:bg-white/10"></div>
             <div className="text-center">
                <span className="block text-3xl font-black text-amber-600">{data.projects.length}+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">مشروع ناشئ</span>
             </div>
          </div>
          
          <button onClick={onAdminEnter} className="group flex items-center gap-4 text-right">
             <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                <span className="text-xl">⚙️</span>
             </div>
             <div>
                <span className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest">إدارة المجلة</span>
                <span className="block text-sm font-bold text-slate-800 dark:text-white">بوابة المشرفين</span>
             </div>
          </button>
        </div>
      </footer>
    </div>
  );
};