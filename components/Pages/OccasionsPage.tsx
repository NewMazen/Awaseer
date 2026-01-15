
import React from 'react';
import { AppData } from '../../types';
import SectionHeader from '../SectionHeader';
import { PageTransition } from '../CommonLayout';

export const OccasionsPage: React.FC<{ data: AppData }> = ({ data }) => {
  // تأمين المصفوفات لضمان عدم حدوث خطأ عند القراءة من بيانات قديمة
  const newlyweds = data.newlyweds || [];
  const newborns = data.newborns || [];

  return (
    <PageTransition>
      <div className="pt-40 container mx-auto px-6 mb-40 text-right" dir="rtl">
        <SectionHeader title="أخبار المجتمع" subtitle="نشارككم أفراح العائلة، من احتفالات الزواج السعيدة إلى قدوم المواليد الجدد." />
        
        {/* قسم العرسان */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-[2px] bg-amber-500 flex-grow"></div>
            <h2 className="text-4xl font-black text-amber-600">عرسان السنة</h2>
            <div className="h-[2px] bg-amber-500 flex-grow"></div>
          </div>

          {newlyweds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {newlyweds.map((couple) => (
                <div key={couple.id} className="relative group overflow-hidden rounded-[4rem] aspect-[16/9] shadow-2xl border-4 border-white dark:border-slate-800">
                  <img src={couple.image || 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={couple.names} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-12 text-right">
                    <span className="text-amber-400 text-xs font-black uppercase tracking-[0.3em] mb-3">بارك الله لهما وبارك عليهما</span>
                    <h3 className="text-4xl font-black text-white mb-2">{couple.names}</h3>
                    <p className="text-slate-300 font-bold">{couple.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 italic">لا توجد بيانات عرسان مسجلة لهذا العام حالياً.</div>
          )}
        </section>

        {/* قسم المواليد */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="h-[2px] bg-emerald-600 flex-grow"></div>
            <h2 className="text-4xl font-black text-emerald-700 dark:text-emerald-400">مواليد السنة</h2>
            <div className="h-[2px] bg-emerald-600 flex-grow"></div>
          </div>
          
          {newborns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {newborns.map((baby) => (
                <div key={baby.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-white/5 text-center group transition-all hover:-translate-y-2">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-emerald-100 dark:border-emerald-900/30 mb-6 shadow-xl relative">
                    <img src={baby.image || 'https://images.unsplash.com/photo-1555252333-9f8e92e65ee9'} className="w-full h-full object-cover" alt={baby.name} />
                    <div className="absolute inset-0 bg-emerald-600/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="text-xs font-black text-emerald-600 mb-2 tracking-widest uppercase">قدوم المولود/ة</div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{baby.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">ابن/ابنة: {baby.parents}</p>
                  <div className="inline-block px-4 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-black">{baby.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 italic">لا توجد بيانات مواليد مسجلة لهذا العام حالياً.</div>
          )}
        </section>
      </div>
    </PageTransition>
  );
};
