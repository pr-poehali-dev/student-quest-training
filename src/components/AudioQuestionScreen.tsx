import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type Stage = {
  id: number;
  title: string;
  description: string;
  question: string;
  options: { text: string; correct: boolean }[];
  correctFeedback: string;
  incorrectFeedback: string;
};

type AudioQuestionScreenProps = {
  stage: Stage;
  currentStage: number;
  totalStages: number;
  firstName: string;
  selectedOption: number | null;
  showFeedback: boolean;
  isCorrect: boolean;
  onOptionSelect: (index: number) => void;
  onNext: () => void;
};

const AudioQuestionScreen = ({
  stage,
  currentStage,
  totalStages,
  firstName,
  selectedOption,
  showFeedback,
  isCorrect,
  onOptionSelect,
  onNext,
}: AudioQuestionScreenProps) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([null, null, null]);

  const audioSamples = [
    { 
      url: 'https://cdn.poehali.dev/files/a2e9fb0c-bd23-44ad-a51e-e99dd5c86c7e.mp3', 
      label: 'A', 
      volume: 0.3,
      voltage: '2 В',
      image: 'https://cdn.poehali.dev/projects/c09e2a63-dbea-4624-98e2-78eeaf56d80c/files/842467f5-75e8-4930-8ea5-4c03b491af90.jpg'
    },
    { 
      url: 'https://cdn.poehali.dev/files/d25cb96d-5f02-4c13-8d74-8f49af9cf63f.mp3', 
      label: 'B', 
      volume: 0.7,
      voltage: '4 В',
      image: 'https://cdn.poehali.dev/projects/c09e2a63-dbea-4624-98e2-78eeaf56d80c/files/f46d3030-26ef-4a42-956b-6f9909b420c7.jpg'
    },
    { 
      url: 'https://cdn.poehali.dev/files/47f9aa82-7bb7-4e40-918c-5b7d4e1e086a.mp3', 
      label: 'C', 
      volume: 0.5,
      voltage: '3 В',
      image: 'https://cdn.poehali.dev/projects/c09e2a63-dbea-4624-98e2-78eeaf56d80c/files/e5b0eba1-f77a-4933-9be1-aea17635418b.jpg'
    },
  ];

  const handlePlayAudio = async (index: number) => {
    audioRefs.current.forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const audio = audioRefs.current[index];
    if (audio) {
      try {
        audio.volume = audioSamples[index].volume;
        await audio.play();
        setPlayingIndex(index);
        audio.onended = () => setPlayingIndex(null);
      } catch (error) {
        console.error('Failed to play audio:', error);
        setPlayingIndex(null);
      }
    }
  };

  const handleStopAudio = () => {
    audioRefs.current.forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setPlayingIndex(null);
  };

  return (
    <div className="min-h-screen bg-[#fff0e3] text-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center border border-purple-200">
              <Icon name="Music" size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Агент {firstName}</p>
              <p className="font-semibold text-gray-900">
                Этап {currentStage + 1} из {totalStages}
              </p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-full border border-purple-200 shadow-sm">
            <p className="text-sm font-medium text-purple-600">
              {Math.round(((currentStage + 1) / totalStages) * 100)}% завершено
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-purple-100 animate-slide-up">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              {stage.title}
            </h2>
            <p className="text-gray-700 whitespace-pre-line mb-6 leading-relaxed">
              {stage.description}
            </p>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-xl mb-6">
              <p className="text-gray-800 font-medium whitespace-pre-line">
                {stage.question}
              </p>
            </div>

            <div className="mb-6 space-y-6">
              <h3 className="font-semibold text-lg text-gray-900">🎧 Прослушай записи и изучи осциллограммы:</h3>
              {audioSamples.map((sample, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <audio
                    ref={(el) => (audioRefs.current[index] = el)}
                    src={sample.url}
                    preload="auto"
                  />
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                      <button
                        onClick={() =>
                          playingIndex === index ? handleStopAudio() : handlePlayAudio(index)
                        }
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                          playingIndex === index
                            ? 'bg-purple-100 border-purple-600 text-purple-900'
                            : 'bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50 text-gray-800'
                        }`}
                      >
                        <span className="font-medium">Запись {sample.label}</span>
                        <Icon
                          name={playingIndex === index ? 'Pause' : 'Play'}
                          size={24}
                          className={playingIndex === index ? 'text-purple-600' : 'text-gray-600'}
                        />
                      </button>
                      <div className="mt-3 text-center">
                        <p className="text-sm text-gray-600">Напряжение на осциллографе:</p>
                        <p className="text-xl font-bold text-purple-600">{sample.voltage}</p>
                      </div>
                    </div>
                    <div className="flex-1 w-full">
                      <img 
                        src={sample.image} 
                        alt={`Осциллограмма записи ${sample.label}`}
                        className="w-full h-auto rounded-xl border-2 border-gray-300 shadow-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {stage.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const showCorrect = showFeedback && option.correct;
              const showIncorrect = showFeedback && isSelected && !option.correct;

              return (
                <button
                  key={index}
                  onClick={() => onOptionSelect(index)}
                  disabled={showFeedback && isCorrect}
                  className={`w-full p-4 md:p-6 rounded-2xl border-2 transition-all text-left font-medium ${
                    showCorrect
                      ? 'bg-green-50 border-green-500 text-green-800'
                      : showIncorrect
                      ? 'bg-red-50 border-red-500 text-red-800'
                      : isSelected
                      ? 'bg-purple-50 border-purple-600 text-purple-900'
                      : 'bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50 text-gray-800'
                  } ${
                    showFeedback && isCorrect
                      ? 'cursor-not-allowed opacity-75'
                      : 'cursor-pointer hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg">{option.text}</span>
                    {showCorrect && (
                      <Icon name="CheckCircle" size={24} className="text-green-600 flex-shrink-0 ml-2" />
                    )}
                    {showIncorrect && (
                      <Icon name="XCircle" size={24} className="text-red-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div
              className={`mt-6 p-6 rounded-2xl border-2 animate-scale-in ${
                isCorrect
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex items-start">
                <Icon
                  name={isCorrect ? 'CheckCircle' : 'XCircle'}
                  size={28}
                  className={`mr-3 flex-shrink-0 ${
                    isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}
                />
                <div className="flex-1">
                  <p
                    className={`font-semibold text-lg mb-2 ${
                      isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {isCorrect ? 'Верно!' : 'Неверно!'}
                  </p>
                  <p
                    className={
                      isCorrect ? 'text-green-700' : 'text-red-700'
                    }
                  >
                    {isCorrect
                      ? stage.correctFeedback
                      : stage.incorrectFeedback}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showFeedback && isCorrect && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={onNext}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                {currentStage < totalStages - 1 ? (
                  <>
                    Следующее испытание
                    <Icon name="ArrowRight" size={20} className="ml-2" />
                  </>
                ) : (
                  <>
                    Завершить миссию
                    <Icon name="Flag" size={20} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioQuestionScreen;