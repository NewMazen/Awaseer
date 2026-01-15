
import React, { useState, useEffect } from 'react';
import Navbar, { ViewType } from './components/Navbar';
import { 
  FOUNDER_NAME,
  FOUNDER_BIO,
  MOCK_ACHIEVEMENTS,
  MOCK_INITIATIVES,
  MOCK_TALENTS,
  MOCK_PROJECTS,
  MOCK_NEWBORNS,
  MOCK_NEWLYWEDS
} from './constants';
import { AppData, QuizQuestion, GameScore } from './types';

import { LoginModal } from './components/Admin/LoginModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { LandingCover } from './components/Pages/LandingCover';
import { HallOfGloryPage } from './components/Pages/HallOfGloryPage';
import { AboutPage } from './components/Pages/AboutPage';
import { InitiativesPage } from './components/Pages/InitiativesPage';
import { TalentsPage } from './components/Pages/TalentsPage';
import { ProjectsPage } from './components/Pages/ProjectsPage';
import { OccasionsPage } from './components/Pages/OccasionsPage';
import { GamesPage } from './components/Pages/GamesPage';

const MOCK_QUIZ: QuizQuestion[] = [
  { id: '1', question: 'في أي حي من أحياء مكة كانت بداية العائلة؟', options: ['الكدوة', 'المسفلة', 'العتيبية', 'الزهراء'], correctAnswerIndex: 0 },
  { id: '2', question: 'من هو مؤسس العائلة الذي تفرعت منه هذه الذرية؟', options: ['محي الدين مليباري', 'أحمد مليباري', 'عبدالله مليباري', 'فهد مليباري'], correctAnswerIndex: 0 },
];

const INITIAL_DATA: AppData = {
  magazineTitle: 'أواصر',
  magazineIssue: 'الإصدار الأول',
  magazineDate: 'رمضان ١٤٤٥ هـ',
  heroWelcome: 'مرحباً بكم في  ',
  heroIntro: 'مجلة عائلية تجمع شتات الأخبار وتنشر عبق الإنجازات لذرية الجد محي الدين مليباري.',
  founderName: FOUNDER_NAME,
  founderBio: FOUNDER_BIO,
  founderImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
  gloryMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  featuredStoryTitle: 'قصة العدد: جذورنا ممتدة',
  featuredStoryText: 'هنا نسطر أعظم القصص التي مرت بها العائلة عبر الأجيال، من مكة العتيقة إلى آفاق المستقبل الواعد.',
  featuredStoryImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
  featuredYouTubeUrl: '',
  aboutGallery: [],
  achievements: MOCK_ACHIEVEMENTS,
  initiatives: MOCK_INITIATIVES,
  talents: MOCK_TALENTS,
  projects: MOCK_PROJECTS,
  newborns: MOCK_NEWBORNS,
  newlyweds: MOCK_NEWLYWEDS,
  quizQuestions: MOCK_QUIZ,
  gameScores: [],
  memoryGameImages: [
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=200',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65ee9?w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  ],
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [appData, setAppData] = useState<AppData>(INITIAL_DATA);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return sessionStorage.getItem('family_authorized') === 'true';
  });
  const [entryPassword, setEntryPassword] = useState('');
  const [entryError, setEntryError] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
  });

  useEffect(() => {
    const savedData = localStorage.getItem('awaseer_cms_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAppData({
          ...INITIAL_DATA,
          ...parsed,
          quizQuestions: parsed.quizQuestions || INITIAL_DATA.quizQuestions,
          gameScores: parsed.gameScores || [],
          memoryGameImages: parsed.memoryGameImages || INITIAL_DATA.memoryGameImages,
        });
      } catch (e) {
        console.error("خطأ في تحميل البيانات", e);
      }
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleSaveData = (newData: AppData) => {
    setAppData(newData);
    localStorage.setItem('awaseer_cms_data', JSON.stringify(newData));
  };

  const handleSaveScore = (score: GameScore) => {
    const newData = {
      ...appData,
      gameScores: [...(appData.gameScores || []), score]
    };
    handleSaveData(newData);
  };

  const handleLoginSuccess = () => {
    setIsAdminMode(true);
    setCurrentView('admin');
    setIsLoginModalOpen(false);
  };

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entryPassword === 'Malibari9955#@') {
      setIsAuthorized(true);
      sessionStorage.setItem('family_authorized', 'true');
    } else {
      setEntryError(true);
    }
  };

  if (!isAuthorized) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans p-6`} dir="rtl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full animate-blob"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/20 p-10 md:p-16 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] text-center animate-in fade-in zoom-in-95 duration-700">
           <div className="w-24 h-24 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black mx-auto mb-8 shadow-xl rotate-3">أ</div>
           <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">بوابة عائلة مليباري</h1>
           <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg leading-relaxed font-medium">هذا الموقع خاص بأفراد العائلة فقط. يرجى إدخال رمز الدخول للمتابعة.</p>
           
           <form onSubmit={handleEntrySubmit} className="space-y-6">
              <div className="relative group">
                <input 
                  type="password"
                  value={entryPassword}
                  onChange={(e) => { setEntryPassword(e.target.value); setEntryError(false); }}
                  placeholder="رمز الدخول"
                  className={`w-full bg-slate-50 dark:bg-slate-800/50 border-2 ${entryError ? 'border-red-500' : 'border-slate-100 dark:border-slate-700'} group-focus-within:border-emerald-500 p-5 rounded-3xl outline-none text-center text-2xl tracking-widest transition-all dark:text-white font-black`}
                  autoFocus
                />
                <div className="absolute inset-0 rounded-3xl ring-4 ring-emerald-500/0 group-focus-within:ring-emerald-500/10 transition-all pointer-events-none"></div>
              </div>
              
              {entryError && <p className="text-red-500 font-bold text-sm animate-shake">الرمز السري غير صحيح، يرجى المحاولة مرة أخرى.</p>}
              
              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-3xl text-xl shadow-[0_15px_40px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] transform hover:-translate-y-1"
              >
                دخول للمجلة
              </button>
           </form>
           
           <div className="mt-12 text-slate-400 dark:text-slate-600 text-xs font-bold tracking-widest uppercase italic">
             أواصر — ذرية محي الدين مليباري
           </div>
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    if (currentView === 'admin') {
      return (
        <AdminDashboard 
          data={appData} 
          onSave={handleSaveData} 
          onExit={() => setCurrentView('home')} 
        />
      );
    }

    switch (currentView) {
      case 'home':
        return <LandingCover data={appData} onEnter={setCurrentView} onAdminEnter={() => setIsLoginModalOpen(true)} />;
      case 'glory':
        return <HallOfGloryPage data={appData} />;
      case 'about':
        return <AboutPage data={appData} />;
      case 'initiatives':
        return <InitiativesPage data={appData} />;
      case 'talents':
        return <TalentsPage data={appData} />;
      case 'projects':
        return <ProjectsPage data={appData} />;
      case 'occasions':
        return <OccasionsPage data={appData} />;
      case 'games':
        return <GamesPage data={appData} onSaveScore={handleSaveScore} />;
      default:
        return <LandingCover data={appData} onEnter={setCurrentView} onAdminEnter={() => setIsLoginModalOpen(true)} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden`}>
      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        isAdminMode={isAdminMode} 
        onAdminClick={() => setIsLoginModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      <main>{renderCurrentPage()}</main>

      {currentView !== 'home' && currentView !== 'admin' && (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-emerald-900/20 py-20 mt-20 text-right" dir="rtl">
          <div className="container mx-auto px-6 text-center">
             <div className="flex items-center justify-center gap-4 mb-8">
               <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl">أ</div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white">مجلة {appData.magazineTitle}</h2>
             </div>
             <p className="text-emerald-600 dark:text-emerald-500/40 font-black uppercase tracking-[0.5em] text-xs leading-loose">
               {appData.magazineIssue} — {appData.magazineDate} <br/> 
               جميع الحقوق محفوظة لذرية {appData.founderName}
             </p>
          </div>
        </footer>
      )}

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-50 overflow-hidden opacity-20 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-300 dark:bg-emerald-900/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-200 dark:bg-amber-900/10 blur-[150px] rounded-full"></div>
      </div>
    </div>
  );
};

export default App;
