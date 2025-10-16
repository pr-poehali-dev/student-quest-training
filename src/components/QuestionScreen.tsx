import { Button } from '@/components/ui/button';
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

type QuestionScreenProps = {
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

const QuestionScreen = ({
  stage,
  currentStage,
  totalStages,
  firstName,
  selectedOption,
  showFeedback,
  isCorrect,
  onOptionSelect,
  onNext,
}: QuestionScreenProps) => {
  return (
    <div className="min-h-screen bg-[#fff0e3] text-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center border border-purple-200">
              <Icon name="Radio" size={24} className="text-purple-600" />
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

            {stage.image && (
              <div className="mb-6">
                <img
                  src={stage.image}
                  alt="Stage visual"
                  className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg"
                />
              </div>
            )}

            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-xl">
              <p className="text-gray-800 font-medium whitespace-pre-line">
                {stage.question}
              </p>
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

export default QuestionScreen;
