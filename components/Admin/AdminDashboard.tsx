
import React, { useState, useRef, useEffect } from 'react';
import { AppData, AchievementType, QuizQuestion, GameScore } from '../../types';
import { ImagePicker } from './ImagePicker';

interface AdminDashboardProps {
  data: AppData;
  onSave: (d: AppData) => void;
  onExit: () => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ data, onSave, onExit }) => {
  const [formData, setFormData] = useState<AppData>(data);
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<string>('');

  const syncChanges = (updatedData: AppData) => {
    setFormData(updatedData);
    setSaveStatus('saving');
    
    // محاكاة تأخير بسيط لإظهار حالة الحفظ للمستخدم
    setTimeout(() => {
      onSave(updatedData); 
      const now = new Date();
      setLastSaved(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
      setSaveStatus('saved');
      
      // العودة لحالة الانتظار بعد 3 ثوانٍ
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 600);
  };

  const updateField = (field: keyof AppData, value: any) => {
    const newData = { ...formData, [field]: value };
    syncChanges(newData);
  };

  const removeItem = (field: keyof AppData, id: string) => {
    const list = formData[field] as any[];
    const newData = { ...formData, [field]: list.filter((item: any) => item.id !== id) };
    syncChanges(newData);
  };

  const handleAddItem = (field: keyof AppData, template: any) => {
    const list = (formData[field] as any[]) || [];
    const newData = { ...formData, [field]: [...list, { ...template, id: Date.now().toString() }] };
    syncChanges(newData);
  };

  const handleUpdateItem = (field: keyof AppData, id: string, updates: any) => {
    const list = formData[field] as any[];
    const newData = {
      ...formData,
      [field]: list.map((item: any) => item.id === id ? { ...item, ...updates } : item)
    };
    syncChanges(newData);
  };

  const updateQuizQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    const questions = (formData.quizQuestions || []).map(q => q.id === id ? { ...q, ...updates } : q);
    updateField('quizQuestions', questions);
  };

  const handleGalleryAdd = (url: string) => {
    const gallery = formData.aboutGallery || [];
    updateField('aboutGallery', [...gallery, url]);
  };

  const handleGalleryRemove = (index: number) => {
    const gallery = [...(formData.aboutGallery || [])];
    gallery.splice(index, 1);
    updateField('aboutGallery', gallery);
  };

  const handleMemoryImageAdd = (url: string) => {
    const images = formData.memoryGameImages || [];
    updateField('memoryGameImages', [...images, url]);
  };

  const handleMemoryImageRemove = (index: number) => {
    const images = [...(formData.memoryGameImages || [])];
    images.splice(index, 1);
    updateField('memoryGameImages', images);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // دالة لتحديد شكل ولون زر الحالة
  const getStatusButton = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 animate-pulse">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs font-black">جاري التحديث...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm animate-in fade-in zoom-in-95">
            <span className="text-xs font-black">تم التحديث بنجاح ✅</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 opacity-60">
            <span className="text-xs font-bold">البيانات محفوظة</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-4 md:p-10 pt-28 font-sans text-right transition-colors duration-500" dir="rtl">
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-emerald-900/20 gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-lg">تح</div>
            <div>
              <h1 className="text-xl md:text-2xl font-black">لوحة تحكم أواصر</h1>
              <p className="text-emerald-600 dark:text-emerald-500/60 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                {lastSaved ? `آخر تحديث الساعة ${lastSaved}` : 'أهلاً بك في نظام الإدارة'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {getStatusButton()}
            <button onClick={onExit} className="flex-grow md:flex-none bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all border border-slate-700 shadow-lg active:scale-95">
              خروج
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar Tabs */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 lg:overflow-visible custom-scrollbar">
            {[
              { id: 'general', label: 'الإعدادات العامة', icon: '⚙️' },
              { id: 'about_family', label: 'عن العائلة وقصة العدد', icon: '📖' },
              { id: 'glory', label: 'لوحة المجد', icon: '🎓' },
              { id: 'quiz', label: 'إدارة الألعاب', icon: '🎮' },
              { id: 'leaderboard', label: 'سجل الأبطال', icon: '🏆' },
              { id: 'newlyweds', label: 'العرسان الجدد', icon: '💍' },
              { id: 'newborns', label: 'المواليد الجدد', icon: '👶' },
              { id: 'initiatives', label: 'المبادرات', icon: '🤝' },
              { id: 'talents', label: 'المواهب', icon: '🎨' },
              { id: 'projects', label: 'المشاريع', icon: '💼' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 lg:w-full text-right px-5 py-4 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl translate-x-0 lg:translate-x-2' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
              >
                <span className="text-lg md:text-xl">{tab.icon}</span> 
                <span className="text-sm md:text-base">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-emerald-900/20 shadow-2xl min-h-[500px]">
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in">
                <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-500 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">إعدادات المجلة الرئيسية</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-emerald-600 dark:text-emerald-400">عنوان المجلة</label>
                      <input type="text" value={formData.magazineTitle} onChange={e => updateField('magazineTitle', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-emerald-600 dark:text-emerald-400">رقم الإصدار</label>
                      <input type="text" value={formData.magazineIssue} onChange={e => updateField('magazineIssue', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-emerald-600 dark:text-emerald-400">تاريخ الإصدار</label>
                      <input type="text" value={formData.magazineDate} onChange={e => updateField('magazineDate', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-emerald-600 dark:text-emerald-400">رابط موسيقى لوحة المجد</label>
                      <input type="text" value={formData.gloryMusicUrl} onChange={e => updateField('gloryMusicUrl', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-colors" placeholder="رابط MP3" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-emerald-600 dark:text-emerald-400">اسم الجد المؤسس</label>
                      <input type="text" value={formData.founderName} onChange={e => updateField('founderName', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-emerald-600 dark:text-emerald-400">سيرة الجد</label>
                      <textarea rows={4} value={formData.founderBio} onChange={e => updateField('founderBio', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-colors"></textarea>
                    </div>
                    <ImagePicker label="صورة الجد المؤسس" value={formData.founderImage} onChange={val => updateField('founderImage', val)} />
                  </div>
                </div>
              </div>
            )}

            {/* About & Story Tab */}
            {activeTab === 'about_family' && (
              <div className="space-y-8 animate-in fade-in">
                <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-500 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">إدارة صفحة العائلة وقصة العدد</h2>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6">
                  <h3 className="text-lg font-black text-emerald-600">قصة العدد (المقالة الرئيسية)</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold">عنوان قصة العدد</label>
                        <input type="text" value={formData.featuredStoryTitle} onChange={e => updateField('featuredStoryTitle', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:border-emerald-500 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold">نص القصة الكامل</label>
                        <textarea rows={10} value={formData.featuredStoryText} onChange={e => updateField('featuredStoryText', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:border-emerald-500 transition-all" placeholder="أدخل القصة هنا. النص سيحيط بالصورة تلقائياً مثل تنسيق المجلات."></textarea>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <ImagePicker label="صورة قصة العدد" value={formData.featuredStoryImage} onChange={val => updateField('featuredStoryImage', val)} />
                      <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20">
                         <p className="text-[11px] text-amber-700 font-bold mb-2">💡 ملاحظة التنسيق:</p>
                         <p className="text-[10px] text-slate-500 leading-relaxed italic">ستظهر هذه الصورة في جهة اليمين وسيلتف النص حولها بشكل انسيابي (نمط وورد)، وإذا كان النص أطول سيمتد ليأخذ كامل العرض أسفل الصورة.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-lg font-black text-emerald-600">التوثيق المرئي (يوتيوب)</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold">رابط يوتيوب للعدد</label>
                      <input type="text" value={formData.featuredYouTubeUrl} onChange={e => updateField('featuredYouTubeUrl', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:border-emerald-500" placeholder="https://www.youtube.com/watch?v=..." />
                      <p className="text-[10px] text-slate-400 italic">سيظهر هذا المقطع في قسم مستقل تماماً فوق معرض الصور.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6">
                  <h3 className="text-lg font-black text-emerald-600">معرض صور العائلة</h3>
                  <div className="space-y-4">
                    <ImagePicker label="إضافة صورة جديدة للمعرض" value="" onChange={handleGalleryAdd} />
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                      {(formData.aboutGallery || []).map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                          <img src={url} className="w-full h-full object-cover" />
                          <button onClick={() => handleGalleryRemove(idx)} className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-all">حذف</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Games Management Tab */}
            {activeTab === 'quiz' && (
              <div className="space-y-12 animate-in fade-in">
                {/* إدارة المسابقة */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
                    <h2 className="text-xl font-bold text-emerald-600">🧠 أسئلة تحدي العائلة</h2>
                    <button onClick={() => handleAddItem('quizQuestions', { question: '', options: ['', '', '', ''], correctAnswerIndex: 0 })} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg">+ إضافة سؤال</button>
                  </div>
                  <div className="grid gap-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.quizQuestions?.map(q => (
                      <div key={q.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 relative">
                          <button onClick={() => removeItem('quizQuestions', q.id)} className="absolute top-4 left-4 text-red-500 text-xs font-bold">✕ حذف</button>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-emerald-600">السؤال</label>
                            <input type="text" value={q.question} onChange={e => updateQuizQuestion(q.id, { question: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold text-sm" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {q.options.map((opt, idx) => (
                              <div key={idx} className="space-y-1">
                                  <label className="text-[10px] text-slate-400">خيار {idx + 1}</label>
                                  <div className="flex gap-2">
                                    <input type="text" value={opt} onChange={e => {
                                        const newOpts = [...q.options];
                                        newOpts[idx] = e.target.value;
                                        updateQuizQuestion(q.id, { options: newOpts });
                                    }} className={`flex-grow bg-slate-50 dark:bg-slate-950 border ${q.correctAnswerIndex === idx ? 'border-emerald-500' : 'border-slate-200 dark:border-slate-700'} p-2 rounded-lg text-xs`} />
                                    <input type="radio" checked={q.correctAnswerIndex === idx} onChange={() => updateQuizQuestion(q.id, { correctAnswerIndex: idx })} />
                                  </div>
                              </div>
                            ))}
                          </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* إدارة تحدي الوجيه (الذاكرة) */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
                    <h2 className="text-xl font-bold text-amber-600">🧩 صور تحدي الوجيه</h2>
                    <p className="text-[10px] text-slate-500 italic">يُنصح بإضافة 6 إلى 8 صور على الأقل.</p>
                  </div>
                  <div className="space-y-6">
                    <ImagePicker label="إضافة صورة جديدة للعبة الوجيه" value="" onChange={handleMemoryImageAdd} />
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                      {(formData.memoryGameImages || []).map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md">
                          <img src={url} className="w-full h-full object-cover" />
                          <button onClick={() => handleMemoryImageRemove(idx)} className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-all">حذف</button>
                        </div>
                      ))}
                    </div>
                    {(!formData.memoryGameImages || formData.memoryGameImages.length === 0) && (
                      <div className="text-center py-6 text-slate-400 italic text-sm">لم يتم رفع صور للعبة بعد. سيتم استخدام الصور الافتراضية.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-8 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-bold text-emerald-600">سجل الأبطال (نتائج الألعاب)</h2>
                  <button onClick={() => updateField('gameScores', [])} className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black">مسح كل النتائج</button>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 text-emerald-600 text-xs font-black uppercase tracking-widest border-b border-slate-200 dark:border-slate-700">
                          <th className="p-4">اللاعب</th>
                          <th className="p-4">اللعبة</th>
                          <th className="p-4">النتيجة</th>
                          <th className="p-4">التوقيت</th>
                          <th className="p-4">التاريخ</th>
                          <th className="p-4">إدارة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(formData.gameScores || []).sort((a,b) => b.timeInSeconds - a.timeInSeconds).reverse().map((score) => (
                          <tr key={score.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-emerald-50/30 transition-colors">
                            <td className="p-4 font-bold text-sm">{score.playerName}</td>
                            <td className="p-4 text-xs">{score.gameType === 'quiz' ? '🧠 مسابقة' : '🧩 ذاكرة'}</td>
                            <td className="p-4 font-black text-emerald-600">{score.gameType === 'quiz' ? `${score.score} صح` : `${score.score} حركة`}</td>
                            <td className="p-4 text-sm font-mono">{formatTime(score.timeInSeconds)}</td>
                            <td className="p-4 text-xs opacity-50">{score.date}</td>
                            <td className="p-4">
                              <button onClick={() => removeItem('gameScores', score.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">✕</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                   {(!formData.gameScores || formData.gameScores.length === 0) && (
                     <div className="text-center py-20 text-slate-400 italic">لا يوجد سجل نتائج حالياً.</div>
                   )}
                </div>
              </div>
            )}

            {/* Hall of Glory Tab */}
            {activeTab === 'glory' && (
              <div className="space-y-8 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                   <h2 className="text-2xl font-bold text-amber-600">لوحة المجد (الإنجازات)</h2>
                   <button onClick={() => handleAddItem('achievements', { name: '', type: AchievementType.PHD, description: '', year: '', image: '' })} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg">+ إضافة إنجاز جديد</button>
                </div>
                <div className="grid gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.achievements.map(a => (
                    <div key={a.id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 relative">
                      <button onClick={() => removeItem('achievements', a.id)} className="absolute top-4 left-4 text-red-500 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors">✕ حذف</button>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-emerald-600">الاسم</label>
                           <input type="text" value={a.name} onChange={e => handleUpdateItem('achievements', a.id, { name: e.target.value })} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold text-sm" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-emerald-600">نوع الإنجاز</label>
                           <select value={a.type} onChange={e => handleUpdateItem('achievements', a.id, { type: e.target.value })} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm outline-none">
                              {Object.values(AchievementType).map(t => <option key={t} value={t}>{t}</option>)}
                           </select>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-emerald-600">السنة</label>
                           <input type="text" value={a.year} onChange={e => handleUpdateItem('achievements', a.id, { year: e.target.value })} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm" placeholder="مثلاً: 2024" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-emerald-600">وصف الإنجاز</label>
                           <textarea value={a.description} onChange={e => handleUpdateItem('achievements', a.id, { description: e.target.value })} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-xs outline-none" rows={2}></textarea>
                        </div>
                      </div>
                      <ImagePicker label="صورة الإنجاز" value={a.image || ''} onChange={val => handleUpdateItem('achievements', a.id, { image: val })} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newlyweds Tab */}
            {activeTab === 'newlyweds' && (
              <div className="space-y-8 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-bold text-amber-600">إدارة العرسان</h2>
                  <button onClick={() => handleAddItem('newlyweds', { names: '', date: '', image: '' })} className="bg-amber-600 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg">+ إضافة زواج</button>
                </div>
                <div className="grid gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.newlyweds.map(couple => (
                    <div key={couple.id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 relative">
                      <button onClick={() => removeItem('newlyweds', couple.id)} className="absolute top-4 left-4 text-red-500 text-xs font-bold p-2">✕ حذف</button>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-amber-600">أسماء الزوجين</label>
                        <input type="text" value={couple.names} onChange={e => handleUpdateItem('newlyweds', couple.id, { names: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold text-sm w-full" placeholder="فهد & سارة" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 items-end">
                        <div className="space-y-2 w-full">
                          <label className="text-[10px] font-bold text-amber-600">تاريخ الزواج</label>
                          <input type="text" value={couple.date} onChange={e => handleUpdateItem('newlyweds', couple.id, { date: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-xs w-full" />
                        </div>
                        <ImagePicker label="صورة الزفاف" value={couple.image || ''} onChange={val => handleUpdateItem('newlyweds', couple.id, { image: val })} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newborns Tab */}
            {activeTab === 'newborns' && (
              <div className="space-y-8 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-bold text-emerald-600">إدارة المواليد</h2>
                  <button onClick={() => handleAddItem('newborns', { name: '', parents: '', date: '', image: '' })} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg">+ إضافة مولود</button>
                </div>
                <div className="grid gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.newborns.map(baby => (
                    <div key={baby.id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 relative">
                      <button onClick={() => removeItem('newborns', baby.id)} className="absolute top-4 left-4 text-red-500 text-xs font-bold p-2">✕ حذف</button>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-emerald-600">اسم المولود</label>
                           <input type="text" value={baby.name} onChange={e => handleUpdateItem('newborns', baby.id, { name: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold text-sm w-full" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-emerald-600">اسم الوالدين</label>
                           <input type="text" value={baby.parents} onChange={e => handleUpdateItem('newborns', baby.id, { parents: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm w-full" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 items-end">
                        <div className="space-y-2 w-full">
                           <label className="text-[10px] font-bold text-emerald-600">تاريخ القدوم</label>
                           <input type="text" value={baby.date} onChange={e => handleUpdateItem('newborns', baby.id, { date: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-xs w-full" />
                        </div>
                        <ImagePicker label="صورة المولود" value={baby.image || ''} onChange={val => handleUpdateItem('newborns', baby.id, { image: val })} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Initiatives Tab */}
            {activeTab === 'initiatives' && (
               <div className="space-y-8 animate-in fade-in">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-2xl font-bold text-emerald-600">إدارة المبادرات</h2>
                    <button onClick={() => handleAddItem('initiatives', { title: '', description: '', date: '', image: '' })} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg">+ إضافة مبادرة</button>
                  </div>
                  <div className="grid gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.initiatives.map(item => (
                      <div key={item.id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 relative">
                        <button onClick={() => removeItem('initiatives', item.id)} className="absolute top-4 left-4 text-red-500 text-xs font-bold p-2">✕ حذف</button>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-emerald-600">عنوان المبادرة</label>
                          <input type="text" value={item.title} onChange={e => handleUpdateItem('initiatives', item.id, { title: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold text-sm w-full" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-emerald-600">التاريخ</label>
                          <input type="text" value={item.date} onChange={e => handleUpdateItem('initiatives', item.id, { date: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-xs w-full" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-emerald-600">الوصف</label>
                          <textarea value={item.description} onChange={e => handleUpdateItem('initiatives', item.id, { description: e.target.value })} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-xs outline-none" rows={3}></textarea>
                        </div>
                        <ImagePicker label="صورة المبادرة" value={item.image || ''} onChange={val => handleUpdateItem('initiatives', item.id, { image: val })} />
                      </div>
                    ))}
                  </div>
               </div>
            )}

            {/* Talents Tab */}
            {activeTab === 'talents' && (
              <div className="space-y-8 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-2xl font-bold text-amber-600">إدارة المواهب</h2>
                  <button onClick={() => handleAddItem('talents', { title: '', owner: '', talentType: 'رسم', content: '', description: '' })} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg">+ إضافة موهبة</button>
                </div>
                <div className="grid gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.talents.map(item => (
                    <div key={item.id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 relative">
                      <button onClick={() => removeItem('talents', item.id)} className="absolute top-4 left-4 text-red-500 text-xs font-bold p-2">✕ حذف</button>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-amber-600">عنوان العمل</label>
                          <input type="text" value={item.title} onChange={e => handleUpdateItem('talents', item.id, { title: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold text-sm w-full" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-amber-600">الموهوب/ة</label>
                          <input type="text" value={item.owner} onChange={e => handleUpdateItem('talents', item.id, { owner: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm w-full" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-amber-600">نوع الموهبة</label>
                          <select value={item.talentType} onChange={e => handleUpdateItem('talents', item.id, { talentType: e.target.value })} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm outline-none">
                            <option value="رسم">رسم</option>
                            <option value="كتابة">كتابة</option>
                            <option value="تصميم">تصميم</option>
                            <option value="أخرى">أخرى</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-amber-600">رابط الصورة أو النص</label>
                          <textarea value={item.content} onChange={e => handleUpdateItem('talents', item.id, { content: e.target.value })} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-xs outline-none" rows={2} placeholder="رابط صورة للأعمال الفنية أو نص للمقالات"></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
               <div className="space-y-8 animate-in fade-in">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-2xl font-bold text-emerald-600">إدارة المشاريع</h2>
                    <button onClick={() => handleAddItem('projects', { name: '', owner: '', description: '', link: '', logo: '' })} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg">+ إضافة مشروع</button>
                  </div>
                  <div className="grid gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.projects.map(proj => (
                      <div key={proj.id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 relative">
                        <button onClick={() => removeItem('projects', proj.id)} className="absolute top-4 left-4 text-red-500 text-xs font-bold p-2">✕ حذف</button>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-emerald-600">اسم المشروع</label>
                            <input type="text" value={proj.name} onChange={e => handleUpdateItem('projects', proj.id, { name: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold text-sm w-full" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-emerald-600">رابط المشروع</label>
                            <input type="text" value={proj.link} onChange={e => handleUpdateItem('projects', proj.id, { link: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-xs w-full" placeholder="https://..." />
                          </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-emerald-600">المؤسس</label>
                           <input type="text" value={proj.owner} onChange={e => handleUpdateItem('projects', proj.id, { owner: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm w-full" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-emerald-600">وصف قصير</label>
                           <textarea value={proj.description} onChange={e => handleUpdateItem('projects', proj.id, { description: e.target.value })} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-xs outline-none" rows={2}></textarea>
                        </div>
                        <ImagePicker label="شعار المشروع" value={proj.logo} onChange={val => handleUpdateItem('projects', proj.id, { logo: val })} />
                      </div>
                    ))}
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
