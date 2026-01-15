import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, light }) => {
  return (
    <div className="text-center mb-16">
      <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
        light 
          ? 'text-white' 
          : 'text-emerald-900 dark:text-emerald-400'
      }`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`max-w-2xl mx-auto text-lg transition-colors ${
          light 
            ? 'text-emerald-50' 
            : 'text-slate-600 dark:text-slate-400'
        }`}>
          {subtitle}
        </p>
      )}
      <div className={`w-24 h-1.5 mx-auto mt-6 rounded-full transition-colors ${
        light 
          ? 'bg-amber-400' 
          : 'bg-emerald-700 dark:bg-emerald-600'
      }`}></div>
    </div>
  );
};

export default SectionHeader;