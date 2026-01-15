
import React, { useRef } from 'react';

interface ImagePickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "أدخل رابط الصورة أو ارفعها من جهازك" 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 2 ميجابايت.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2 text-right" dir="rtl">
      <label className="text-sm font-bold text-emerald-400">{label}</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={value?.startsWith('data:') ? 'صورة مرفوعة محلياً' : value} 
          onChange={e => onChange(e.target.value)} 
          className="flex-grow bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none focus:border-emerald-500 transition-colors text-xs" 
          placeholder={placeholder}
          disabled={value?.startsWith('data:')}
        />
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()} 
          className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-600/30 transition-all"
        >
          رفع ملف
        </button>
        {value && (
          <button 
            type="button"
            onClick={() => onChange('')} 
            className="bg-red-900/20 text-red-400 px-3 py-2 rounded-xl text-xs font-bold border border-red-900/30 hover:bg-red-900/40 transition-all"
          >
            مسح
          </button>
        )}
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      {value && (
        <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-slate-700">
          <img src={value} className="w-full h-full object-cover" alt="Preview" />
        </div>
      )}
    </div>
  );
};
