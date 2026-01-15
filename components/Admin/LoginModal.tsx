
import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/60 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden text-right" dir="rtl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-lg">ق</div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white transition-colors">منطقة المسؤول</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 transition-colors">يرجى إدخال كلمة المرور للوصول إلى نظام إدارة المحتوى</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <input 
              type="password" 
              autoFocus
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="كلمة المرور"
              className={`w-full bg-slate-50 dark:bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} p-4 rounded-2xl outline-none focus:border-emerald-500 text-center text-xl tracking-widest transition-all dark:text-white`}
            />
            {error && <p className="text-red-500 text-xs text-center font-bold animate-shake">كلمة المرور غير صحيحة!</p>}
          </div>

          <div className="flex gap-4">
            <button type="submit" className="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95">دخول</button>
            <button type="button" onClick={onClose} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold px-6 rounded-2xl transition-all">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
};
