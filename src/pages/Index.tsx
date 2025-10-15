import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

type Stage = {
  id: number;
  title: string;
  description: string;
  audio?: string;
  image?: string;
  question: string;
  options: { text: string; correct: boolean }[];
  correctFeedback: string;
  incorrectFeedback: string;
};

const stages: Stage[] = [
  {
    id: 1,
    title: 'Выбор инструмента агента',
    description: 'Ты находишься в тёмной лаборатории связи. На столе лежат три устройства:',
    audio: 'device_hint.mp3',
    question: 'Одно из этих устройств позволяет измерять мощность и уровень в децибелах. Остальные — лишь помощники. Выбери верно, агент.',
    options: [
      { text: 'Осциллограф', correct: false },
      { text: 'Измеритель уровня сигнала', correct: true },
      { text: 'Вольтметр', correct: false },
    ],
    correctFeedback: 'Отлично, агент! Устройство активировано. Переходим к анализу.',
    incorrectFeedback: 'Ошибка! Эти приборы показывают форму или напряжение сигнала, но не его уровень. Повтори попытку.',
  },
  {
    id: 2,
    title: 'Расшифровка сигнала',
    description: 'На экране прибора появились данные:\nНапряжение сигнала: 2 В\nОпорное напряжение: 1 В',
    audio: 'calc_briefing.mp3',
    question: 'Агент, вычисли относительный уровень сигнала. Формула: L = 20·log₁₀(U/U₀). Не ошибись — система чувствительна к каждому децибелу.',
    options: [
      { text: '3 дБ', correct: false },
      { text: '6 дБ', correct: true },
      { text: '12 дБ', correct: false },
    ],
    correctFeedback: 'Отлично! Сигнал усилен ровно в два раза. Уровень: +6 дБ. Переходим к фильтрации.',
    incorrectFeedback: 'Что-то не сходится… уровень не стабилизировался. Проверь расчёт ещё раз.',
  },
  {
    id: 3,
    title: 'Шумовая ловушка',
    description: 'На экране — спектр сигнала. Видны три пика:\n1 кГц, 10 кГц, 100 кГц',
    audio: 'filter_hint.mp3',
    question: 'Агент, источник передаёт полезный сигнал на частоте 10 кГц, но рядом мешающие гармоники. Примени нужный фильтр, чтобы изолировать основной сигнал.',
    options: [
      { text: 'Высокочастотный фильтр', correct: false },
      { text: 'Полосовой фильтр', correct: true },
      { text: 'Низкочастотный фильтр', correct: false },
    ],
    correctFeedback: 'Превосходно! Гармоники подавлены, спектр чист. Уровень можно измерять точно.',
    incorrectFeedback: 'Нет! Ты либо отсёк полезный сигнал, либо пропустил шум. Проверь настройки фильтра.',
  },
  {
    id: 4,
    title: 'Декодирование уровня',
    description: 'Агент, тебе нужно перевести измеренные данные в стандартную форму — децибелы относительно 1 мВт.\nМощность сигнала = 10 мВт\nОпорная мощность = 1 мВт',
    audio: 'decode_briefing.mp3',
    question: 'Какой уровень сигнала в dBm?',
    options: [
      { text: '1 dBm', correct: false },
      { text: '10 dBm', correct: true },
      { text: '20 dBm', correct: false },
    ],
    correctFeedback: 'Точная работа, агент. Система восстановила синхронизацию! Остался последний шаг — стабилизировать тракт измерения.',
    incorrectFeedback: 'Вычисления неверны. Перепроверь формулу преобразования.',
  },
  {
    id: 5,
    title: 'Акустический контроль',
    description: 'Комната акустического контроля. На столе — измерительный микрофон и старые студийные наушники, подключённые к анализатору уровня звукового давления.\n\n🎧 Агент, внимание!\n\nНаушники поймали едва различимый шум — уровень звукового давления 20 мкПа.\n\nЭто эталонная точка отсчёта, соответствующая нулевому уровню звука.\nТвоя задача — определить, насколько громче сигнал, если измеренное давление выросло до 2000 мкПа.',
    audio: 'acoustic_briefing.mp3',
    image: 'https://cdn.poehali.dev/files/f20ca014-9bad-4b58-82b2-fefb37ed51c5.PNG',
    question: 'Используй формулу уровня звука:\nL = 20 × log₁₀(p / p₀),\nгде p₀ = 20 мкПа.\n\nНе подведи, агент. От правильного расчёта зависит расшифровка аудиопотока.\n\n(Подсказка🔔! Ответ вводите в дБ)',
    options: [
      { text: '20 дБ', correct: false },
      { text: '40 дБ', correct: true },
      { text: '100 дБ', correct: false },
    ],
    correctFeedback: 'Блестяще! Сигнал усилился в 100 раз, что соответствует +40 дБ. Аудиопоток расшифрован!',
    incorrectFeedback: 'Давление выросло в 100 раз (2000/20). Проверь логарифмический расчёт.',
  },
];

const Index = () => {
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [firstAttempts, setFirstAttempts] = useState<boolean[]>([]);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    const testCompleted = localStorage.getItem('test_completed');
    if (testCompleted === 'true') {
      setHasCompleted(true);
    }
  }, []);

  const playSound = (type: 'correct' | 'incorrect') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'correct') {
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } else {
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const handleStartClick = () => {
    setShowNameForm(true);
  };

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      setStarted(true);
      setShowNameForm(false);
      setStartTime(Date.now());
    }
  };

  const handleOptionSelect = (index: number) => {
    if (showFeedback && isCorrect) return;
    setSelectedOption(index);
    const correct = stages[currentStage].options[index].correct;
    setIsCorrect(correct);
    setShowFeedback(true);
    playSound(correct ? 'correct' : 'incorrect');
    
    if (!hasAnswered) {
      setFirstAttempts([...firstAttempts, correct]);
      setHasAnswered(true);
    }
  };

  const handleNext = async () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setHasAnswered(false);
    } else {
      setCompleted(true);
      localStorage.setItem('test_completed', 'true');
      setHasCompleted(true);
      
      const completionTime = Math.floor((Date.now() - startTime) / 1000);
      const correctAnswers = firstAttempts.filter(Boolean).length;
      const score = Math.round((correctAnswers / stages.length) * 100);
      
      try {
        await fetch('https://functions.poehali.dev/ca7d116e-bf46-44ca-8e35-a26b229ee287', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            completionTime: completionTime,
            score: score,
            totalQuestions: stages.length
          })
        });
      } catch (error) {
        console.error('Failed to submit test results:', error);
      }
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentStage(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setCompleted(false);
    setFirstAttempts([]);
    setHasAnswered(false);
  };

  const handleResetTest = () => {
    localStorage.removeItem('test_completed');
    setHasCompleted(false);
    setStarted(false);
    setCurrentStage(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setCompleted(false);
    setShowNameForm(false);
    setFirstName('');
    setLastName('');
    setFirstAttempts([]);
    setHasAnswered(false);
  };

  const progress = ((currentStage + 1) / stages.length) * 100;

  if (hasCompleted && !completed) {
    return (
      <div className="min-h-screen bg-[#fff0e3] text-gray-800 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center border border-purple-200">
            <Icon name="Lock" size={64} className="text-purple-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Тест уже пройден
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto">
            Вы уже проходили этот тест на данном компьютере. Тест можно пройти только один раз.
          </p>

          <button
            onClick={handleResetTest}
            className="text-sm text-gray-400 hover:text-purple-600 transition-colors"
            title="Только для создателя"
          >
            Сбросить ограничение
          </button>
        </div>
      </div>
    );
  }

  if (showNameForm) {
    return (
      <div className="min-h-screen bg-[#fff0e3] text-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center border border-purple-200">
                <Icon name="UserCheck" size={40} className="text-purple-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Представьтесь, агент
              </h2>
              <p className="text-gray-600">
                Введите ваши данные для начала миссии
              </p>
            </div>

            <form onSubmit={handleSubmitName} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя *
                </label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Введите имя"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фамилия *
                </label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Введите фамилию"
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6 rounded-full font-semibold shadow-xl hover:scale-105 transition-transform"
                disabled={!firstName.trim() || !lastName.trim()}
              >
                Начать миссию
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-[#fff0e3] text-gray-800 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center animate-fade-in">
            <div className="order-2 md:order-1 space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Агент 7-В, приём!
              </h1>
              
              <div className="space-y-4 text-base md:text-lg text-gray-700 leading-relaxed">
                <p>
                  — Центр сообщает: перехвачен неизвестный радиосигнал с частотой 10 кГц. Его уровень нестабилен, и только ты способен его измерить, чтобы предотвратить сбой в системе связи.
                </p>
                <p>
                  — Используй знания по измерению уровня сигналов.
                </p>
                <p className="font-semibold">
                  — Готов? Вперёд!
                </p>
              </div>

              <Button 
                onClick={handleStartClick}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-12 py-7 rounded-full font-semibold shadow-xl hover:scale-105 transition-transform"
              >
                Начать миссию
              </Button>
            </div>

            <div className="order-1 md:order-2">
              <img 
                src="https://cdn.poehali.dev/files/03757991-5602-447c-8abe-4a869d5db582.PNG" 
                alt="Агент со шпионской камерой" 
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    const correctAnswers = firstAttempts.filter(Boolean).length;
    const score = Math.round((correctAnswers / stages.length) * 100);
    
    return (
      <div className="min-h-screen bg-[#fff0e3] text-gray-800 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8 animate-scale-in">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center border border-purple-200">
            <Icon name="ShieldCheck" size={64} className="text-purple-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Миссия выполнена!
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto">
            Превосходно, {firstName} {lastName}! Ты измерил уровень сигнала, стабилизировал усилитель и очистил спектр от помех. Связь спасена, мир снова на частоте!
          </p>

          <div className="bg-white border border-purple-200 p-6 rounded-2xl max-w-md mx-auto shadow-lg space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Твой результат</p>
              <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {score}%
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Правильных ответов с первой попытки: <span className="font-bold text-gray-900">{correctAnswers} из {stages.length}</span>
              </p>
            </div>

            <div className="pt-2">
              <p className="text-lg font-semibold text-gray-900">
                {score === 100 ? '🏆 Идеальный результат!' : 
                 score >= 80 ? '⭐ Отличная работа!' : 
                 score >= 60 ? '✓ Хорошо!' : 
                 '💪 Продолжай учиться!'}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <img 
              src="https://cdn.poehali.dev/files/ad806bf1-fb0e-428b-aa48-d88d35f2e40e.PNG" 
              alt="Кот-детектив"
              className="w-64 h-64 mx-auto rounded-3xl shadow-2xl object-cover"
            />
            <p className="mt-6 text-2xl font-semibold text-gray-800">
              Вы молодцы! Хороших выходных❤️
            </p>
          </div>
        </div>
      </div>
    );
  }

  const stage = stages[currentStage];

  return (
    <div className="min-h-screen bg-[#fff0e3] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 text-gray-600 text-sm">
            <span>Этап {currentStage + 1} из {stages.length}</span>
            <span>{Math.round(progress)}% завершено</span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {stage.title}
              </h2>
              <p className="text-gray-600 whitespace-pre-line text-base leading-relaxed">
                {stage.description}
              </p>
            </div>

            {stage.image && (
              <div className="mb-6">
                <img 
                  src={stage.image} 
                  alt={stage.title}
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            )}

            <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 mb-6">
              <p className="text-lg text-gray-800 leading-relaxed font-medium whitespace-pre-line">
                {stage.question}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {stage.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showFeedback && isCorrect}
                  className={`w-full p-5 text-left rounded-2xl border-2 transition-all font-medium text-lg ${
                    selectedOption === index
                      ? isCorrect
                        ? 'bg-green-50 border-green-400 text-green-800'
                        : 'bg-red-50 border-red-400 text-red-800'
                      : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-800'
                  } ${showFeedback && isCorrect ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}`}
                >
                  {option.text}
                </button>
              ))}
            </div>

            {showFeedback && (
              <div className={`p-5 rounded-2xl mb-6 animate-fade-in ${
                isCorrect 
                  ? 'bg-green-50 border-2 border-green-300' 
                  : 'bg-red-50 border-2 border-red-300'
              }`}>
                <div className="flex items-start gap-3">
                  <Icon 
                    name={isCorrect ? 'CheckCircle2' : 'XCircle'} 
                    size={24} 
                    className={isCorrect ? 'text-green-600 flex-shrink-0' : 'text-red-600 flex-shrink-0'}
                  />
                  <p className={`text-base leading-relaxed ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? stage.correctFeedback : stage.incorrectFeedback}
                  </p>
                </div>
              </div>
            )}

            {showFeedback && isCorrect && (
              <Button 
                onClick={handleNext}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-7 rounded-full font-semibold shadow-lg hover:scale-[1.02] transition-transform"
              >
                {currentStage < stages.length - 1 ? 'Следующий этап →' : 'Завершить миссию ✓'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;