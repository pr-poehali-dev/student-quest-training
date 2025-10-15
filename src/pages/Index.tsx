import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type Stage = {
  id: number;
  title: string;
  description: string;
  audio?: string;
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
    title: 'Контроль усилителя',
    description: 'Усилитель нестабилен. Коэффициент усиления G изменяется.\nЕсли входной уровень 2 В, а выходной 8 В — вычисли коэффициент усиления в децибелах.',
    audio: 'amp_briefing.mp3',
    question: 'Формула: G = 20·log₁₀(Uвых/Uвх)',
    options: [
      { text: '3 дБ', correct: false },
      { text: '9 дБ', correct: false },
      { text: '12 дБ', correct: true },
    ],
    correctFeedback: 'Отлично! Усилитель стабилен, сигнал в норме.',
    incorrectFeedback: 'Коэффициент не совпадает, уровень сбивается. Проверь расчёт.',
  },
];

const Index = () => {
  const [started, setStarted] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  const handleOptionSelect = (index: number) => {
    if (showFeedback && isCorrect) return;
    setSelectedOption(index);
    const correct = stages[currentStage].options[index].correct;
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentStage(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setCompleted(false);
  };

  const progress = ((currentStage + 1) / stages.length) * 100;

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
              <Icon name="Radio" size={64} className="text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Сигнал под прикрытием
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
              Вы попали на шпионскую миссию. Измерьте уровень сигнала и спасите мир от радиошума!
            </p>
          </div>

          <Button 
            onClick={handleStart}
            size="lg"
            className="bg-white text-purple-600 hover:bg-white/90 text-lg px-16 py-7 rounded-full font-semibold shadow-xl hover:scale-105 transition-transform"
          >
            Начать миссию
          </Button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8 animate-scale-in">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
            <Icon name="ShieldCheck" size={64} className="text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Миссия выполнена!
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
            Превосходно, агент 7-В! Ты измерил уровень сигнала, стабилизировал усилитель и очистил спектр от помех. Связь спасена, мир снова на частоте!
          </p>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl max-w-md mx-auto">
            <p className="text-sm text-white/70 mb-2">Статус миссии</p>
            <p className="text-2xl font-bold">Уровень агента повышен ✓</p>
          </div>

          <Button 
            onClick={handleRestart}
            size="lg"
            className="bg-white text-purple-600 hover:bg-white/90 text-lg px-12 py-7 rounded-full font-semibold shadow-xl hover:scale-105 transition-transform"
          >
            Пройти снова
          </Button>
        </div>
      </div>
    );
  }

  const stage = stages[currentStage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 text-white/80 text-sm">
            <span>Этап {currentStage + 1} из {stages.length}</span>
            <span>{Math.round(progress)}% завершено</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
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



            <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 mb-6">
              <p className="text-lg text-gray-800 leading-relaxed font-medium">
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