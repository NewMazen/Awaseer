
import React, { useState, useEffect, useRef } from 'react';
import { AppData, QuizQuestion, GameScore } from '../../types';
import SectionHeader from '../SectionHeader';
import { PageTransition, ConfettiEffect } from '../CommonLayout';

interface GamesPageProps {
  data: AppData;
  onSaveScore: (score: GameScore) => void;
}

export const GamesPage: React.FC<GamesPageProps> = ({ data, onSaveScore }) => {
  const [activeGame, setActiveGame] = useState<'menu' | 'quiz' | 'memory'>('menu');
  
  // حالات عامة للألعاب
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const timerRef = useRef<number | null>(null);

  // حالات المسابقة
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // حالات لعبة الذاكرة
  const [cards, setCards] = useState<{ id: number; img: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  // إدارة التوقيت
  useEffect(() => {
    if (timerActive) {
      timerRef.current = window.setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = () => {
    setActiveGame('quiz');
    setTimer(0);
    setTimerActive(true);
    resetQuiz();
  };

  const startMemory = () => {
    setActiveGame('memory');
    setTimer(0);
    setTimerActive(true);
    initMemoryGame();
  };

  const initMemoryGame = () => {
    // استخدام الصور المرفوعة من الإدارة، أو صور افتراضية إذا لم توجد
    const imagesToUse = (data.memoryGameImages && data.memoryGameImages.length > 0) 
      ? data.memoryGameImages 
      : [
          'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200',
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200',
          'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200',
          'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=200',
          'https://images.unsplash.com/photo-1555252333-9f8e92e65ee9?w=200',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        ];

    const doubled = [...imagesToUse, ...imagesToUse]
      .sort(() => Math.random() - 0.5)
      .map((img, idx) => ({ id: idx, img, flipped: false, matched: false }));
    setCards(doubled);
    setFlippedCards([]);
    setMoves(0);
    setShowRegistration(false);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      if (cards[first].img === cards[second].img) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedCards([]);
        
        // التحقق من انتهاء اللعبة
        if (newCards.every(c => c.matched)) {
          setTimerActive(false);
          setTimeout(() => setShowRegistration(true), 500);
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowRegistration(false);
  };

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === data.quizQuestions[currentQuestionIndex].correctAnswerIndex) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      const next = currentQuestionIndex + 1;
      if (next < data.quizQuestions.length) {
        setCurrentQuestionIndex(next);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setTimerActive(false);
        setShowScore(true);
        setTimeout(() => setShowRegistration(true), 1000);
      }
    }, 1500);
  };

  const handleSaveResult = () => {
    if (playerName.trim().split(' ').length < 2) {
      alert("فضلاً أدخل اسمك الثلاثي لتوثيق فوزك");
      return;
    }

    const finalScore: GameScore = {
      id: Date.now().toString(),
      playerName,
      gameType: activeGame === 'quiz' ? 'quiz' : 'memory',
      score: activeGame === 'quiz' ? score : moves,
      timeInSeconds: timer,
      date: new Date().toLocaleDateString('ar-SA')
    };

    onSaveScore(finalScore);
    setShowRegistration(false);
    setActiveGame('menu');
  };

  const isMemoryComplete = cards.length > 0 && cards.every(c => c.matched);

  return (
    <PageTransition>
      { (showScore || isMemoryComplete) && <ConfettiEffect /> }
      <div className="pt-40 container mx-auto px-6 mb-40 text-right font-sans" dir="rtl">
        <SectionHeader title="ركن الترفيه العائلي" subtitle="ألعاب ذكية تربطنا بالماضي وتجمعنا في الحاضر." />

        {/* عداد الوقت في زاوية الشاشة أثناء اللعب */}
        {timerActive && (
          <div className="fixed top-24 left-6 z-[200] bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl shadow-2xl border-2 border-emerald-500 font-black text-emerald-600 animate-pulse">
            ⏳ {formatTime(timer)}
          </div>
        )}

        {activeGame === 'menu' && (
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
             <button 
              onClick={startQuiz}
              className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl border-4 border-transparent hover:border-emerald-500 transition-all group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="text-6xl mb-6">🧠</div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">تحدي خبير العائلة</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">الأسرع في الأجوبة الصحيحة يفوز بالصدارة!</p>
             </button>

             <button 
              onClick={startMemory}
              className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl border-4 border-transparent hover:border-amber-500 transition-all group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="text-6xl mb-6">🧩</div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">تحدي الوجيه</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">تحدي الذاكرة بأقل عدد من الحركات وأقل وقت.</p>
             </button>
          </div>
        )}

        {/* نموذج تسجيل الاسم عند الفوز */}
        {showRegistration && (
          <div className="fixed inset-0 z-[300] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-emerald-500/30">
              <div className="text-6xl mb-6">🏆</div>
              <h3 className="text-2xl font-black mb-2">تسجيل البطل</h3>
              <p className="text-slate-500 mb-8">لقد حققت نتيجة مذهلة! سجل اسمك في لوحة المتصدرين.</p>
              
              <div className="space-y-4 mb-8">
                 <div className="text-right">
                    <label className="text-xs font-bold text-emerald-600 mr-2">الاسم الثلاثي</label>
                    <input 
                      type="text"
                      value={playerName}
                      onChange={e => setPlayerName(e.target.value)}
                      placeholder="مثال: فهد محمد مليباري"
                      className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 outline-none focus:border-emerald-500 text-center font-bold"
                    />
                 </div>
                 <div className="flex justify-between bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl">
                    <span className="font-bold">التوقيت: {formatTime(timer)}</span>
                    <span className="font-bold">{activeGame === 'quiz' ? `الدرجة: ${score}` : `الحركات: ${moves}`}</span>
                 </div>
              </div>

              <button 
                onClick={handleSaveResult}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all"
              >
                توثيق النتيجة
              </button>
            </div>
          </div>
        )}

        {activeGame === 'quiz' && !showRegistration && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-emerald-500/20">
             {!showScore ? (
               <div className="animate-in fade-in slide-in-from-left-4">
                  <div className="flex justify-between items-center mb-10">
                    <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-2xl text-xs font-black">السؤال {currentQuestionIndex + 1} من {data.quizQuestions.length}</span>
                    <button onClick={() => { setActiveGame('menu'); setTimerActive(false); }} className="text-slate-400 font-bold hover:text-red-500 transition-colors">إغلاق ✕</button>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-10 leading-tight">
                    {data.quizQuestions[currentQuestionIndex].question}
                  </h3>
                  <div className="grid gap-4">
                     {data.quizQuestions[currentQuestionIndex].options.map((opt, idx) => {
                       const isCorrect = idx === data.quizQuestions[currentQuestionIndex].correctAnswerIndex;
                       const isSelected = selectedOption === idx;
                       let btnClass = "bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-emerald-500";
                       if (isAnswered) {
                         if (isCorrect) btnClass = "bg-emerald-500 text-white shadow-emerald-500/50";
                         else if (isSelected) btnClass = "bg-red-500 text-white shadow-red-500/50";
                       }
                       return (
                         <button 
                          key={idx} 
                          onClick={() => handleAnswer(idx)}
                          className={`w-full p-6 rounded-2xl text-right text-lg font-bold transition-all transform ${btnClass} ${!isAnswered && 'active:scale-95'}`}
                         >
                           {opt}
                         </button>
                       );
                     })}
                  </div>
               </div>
             ) : (
               <div className="text-center animate-in zoom-in-95">
                  <div className="text-8xl mb-6">⌛</div>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">تم الإنجاز!</h3>
                  <p className="text-2xl font-bold text-emerald-600 mb-8">ننتظر تسجيل اسمك للمتابعة...</p>
               </div>
             )}
          </div>
        )}

        {activeGame === 'memory' && !showRegistration && (
          <div className="max-w-4xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-6 py-2 rounded-2xl font-black text-xl">عدد الحركات: {moves}</div>
                <div className="flex gap-4">
                  <button onClick={initMemoryGame} className="bg-amber-600 text-white px-6 py-2 rounded-2xl font-bold shadow-lg">إعادة اللعب</button>
                  <button onClick={() => { setActiveGame('menu'); setTimerActive(false); }} className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-white px-6 py-2 rounded-2xl font-bold shadow-lg">إغلاق</button>
                </div>
             </div>

             <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {cards.map((card) => (
                  <div 
                    key={card.id} 
                    onClick={() => handleCardClick(card.id)}
                    className="relative aspect-square cursor-pointer transition-all duration-500 preserve-3d group h-32 md:h-48"
                    style={{ transformStyle: 'preserve-3d', transform: (card.flipped || card.matched) ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                  >
                    <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] border-4 border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-center text-5xl backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                      <span className="opacity-20 text-xs font-black">أواصر</span>
                    </div>
                    <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] border-4 border-amber-500 shadow-xl overflow-hidden backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <img src={card.img} className="w-full h-full object-cover" alt="Memory" />
                      {card.matched && <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center text-4xl">✅</div>}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
