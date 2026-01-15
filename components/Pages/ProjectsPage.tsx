import React from 'react';
import { AppData } from '../../types';
import SectionHeader from '../SectionHeader';
import { PageTransition } from '../CommonLayout';

export const ProjectsPage: React.FC<{ data: AppData }> = ({ data }) => (
  <PageTransition>
    <div className="pt-40 container mx-auto px-6 text-right" dir="rtl">
      <SectionHeader title="مشروعي الصغير" subtitle="ندعم ونفتخر بمشاريع أبناء وبنات العائلة الريادية." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {data.projects.map(proj => (
          <div key={proj.id} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-center border-b-8 border-emerald-600 group relative overflow-hidden hover:-translate-y-2 transition-all border border-slate-100 dark:border-transparent">
            <div className="relative w-32 h-32 mx-auto mb-8 shadow-2xl rounded-3xl overflow-hidden ring-4 ring-slate-100 dark:ring-slate-800">
              <img src={proj.logo} className="w-full h-full object-cover" alt={proj.name} />
            </div>
            <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white transition-colors">{proj.name}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 h-20 overflow-hidden transition-colors">{proj.description}</p>
            <div className="text-amber-600 dark:text-amber-500 font-black mb-8">المؤسس: {proj.owner}</div>
            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 text-white px-10 py-3.5 rounded-2xl font-black hover:bg-emerald-500 shadow-lg inline-block transition-all active:scale-95">زيارة المتجر</a>
          </div>
        ))}
      </div>
    </div>
  </PageTransition>
);