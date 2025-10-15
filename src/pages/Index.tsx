import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
    if (showFeedback) return;
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-3xl w-full text-center space-y-8 animate-fade-in">
          <div className="inline-block px-6 py-2 border-2 border-white/20 rotate-2 mb-4">
            <p className="text-sm tracking-widest uppercase text-white/60">Совершенно секретно</p>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
            Сигнал под<br />прикрытием
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto">
            Вы попали на шпионскую миссию. Измерьте уровень сигнала и спасите мир от радиошума!
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-white/50 py-8">
            <div className="flex items-center gap-2">
              <Icon name="Radio" size={20} />
              <span>Уровни сигнала</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Antenna" size={20} />
              <span>Децибелы</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="WavesLadder" size={20} />
              <span>Фильтрация</span>
            </div>
          </div>

          <Button 
            onClick={handleStart}
            size="lg"
            className="bg-white text-black hover:bg-white/90 text-lg px-12 py-6 uppercase tracking-wider font-bold"
          >
            Начать миссию
          </Button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8 animate-scale-in">
          <div className="inline-block p-4 border-2 border-white rounded-full mb-4">
            <Icon name="ShieldCheck" size={64} className="text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Миссия выполнена
          </h1>
          
          <p className="text-xl text-white/70 max-w-xl mx-auto">
            Превосходно, агент 7-В! Ты измерил уровень сигнала, стабилизировал усилитель и очистил спектр от помех. Связь спасена, мир снова на частоте!
          </p>

          <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
            <p className="text-sm text-white/50 uppercase tracking-wider mb-2">Статус</p>
            <p className="text-2xl font-bold">Уровень агента повышен</p>
          </div>

          <Button 
            onClick={handleRestart}
            size="lg"
            className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6 uppercase tracking-wider font-bold"
          >
            Новая миссия
          </Button>
        </div>
      </div>
    );
  }

  const stage = stages[currentStage];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Icon name="ShieldAlert" size={24} />
            <span className="text-sm uppercase tracking-widest text-white/60">Агент 7-В</span>
          </div>
          <div className="text-sm uppercase tracking-widest text-white/60">
            Этап {currentStage + 1} / {stages.length}
          </div>
        </div>

        <Progress value={progress} className="h-1" />

        <Card className="bg-white/5 border-white/10 backdrop-blur animate-fade-in">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">
                  {stage.title}
                </CardTitle>
                <CardDescription className="text-white/60 whitespace-pre-line text-base">
                  {stage.description}
                </CardDescription>
              </div>
              <div className="flex-shrink-0 p-3 bg-white/5 rounded-lg border border-white/10">
                <Icon name="Radio" size={32} />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {stage.audio && (
              <div className="flex items-center gap-3 p-4 bg-black/30 rounded-lg border border-white/10">
                <Icon name="Headphones" size={20} />
                <span className="text-sm text-white/70">[Файл {stage.audio}]</span>
              </div>
            )}

            <div className="p-4 bg-white/5 rounded-lg border-l-4 border-white">
              <p className="text-lg leading-relaxed">{stage.question}</p>
            </div>

            <div className="space-y-3">
              {stage.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedOption === index
                      ? isCorrect
                        ? 'bg-green-500/20 border-green-500'
                        : 'bg-red-500/20 border-red-500'
                      : 'bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10'
                  } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="text-lg font-medium">{option.text}</span>
                </button>
              ))}
            </div>

            {showFeedback && (
              <div className={`p-4 rounded-lg border-l-4 animate-fade-in ${
                isCorrect 
                  ? 'bg-green-500/10 border-green-500' 
                  : 'bg-red-500/10 border-red-500'
              }`}>
                <div className="flex items-start gap-3">
                  <Icon 
                    name={isCorrect ? 'CheckCircle' : 'XCircle'} 
                    size={24} 
                    className={isCorrect ? 'text-green-500' : 'text-red-500'}
                  />
                  <p className="text-base leading-relaxed">
                    {isCorrect ? stage.correctFeedback : stage.incorrectFeedback}
                  </p>
                </div>
              </div>
            )}

            {showFeedback && isCorrect && (
              <Button 
                onClick={handleNext}
                size="lg"
                className="w-full bg-white text-black hover:bg-white/90 text-lg uppercase tracking-wider font-bold"
              >
                {currentStage < stages.length - 1 ? 'Следующий этап' : 'Завершить миссию'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
