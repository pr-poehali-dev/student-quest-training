import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type MatchingPair = {
  left: string;
  right: string;
};

type MatchingQuestionScreenProps = {
  stage: {
    id: number;
    title: string;
    description: string;
    question: string;
    matchingPairs?: MatchingPair[];
    correctFeedback: string;
    incorrectFeedback: string;
  };
  currentStage: number;
  totalStages: number;
  firstName: string;
  onNext: (isCorrect: boolean) => void;
};

const MatchingQuestionScreen = ({
  stage,
  currentStage,
  totalStages,
  firstName,
  onNext,
}: MatchingQuestionScreenProps) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const pairs = stage.matchingPairs || [];
  const leftItems = pairs.map((p) => p.left);
  const rightItems = [...pairs.map((p) => p.right)].sort(() => Math.random() - 0.5);

  const handleLeftClick = (item: string) => {
    if (showFeedback) return;
    setSelectedLeft(item);
  };

  const handleRightClick = (item: string) => {
    if (showFeedback || !selectedLeft) return;
    const newMatches = { ...matches, [selectedLeft]: item };
    setMatches(newMatches);
    setSelectedLeft(null);
  };

  const handleRemoveMatch = (leftItem: string) => {
    if (showFeedback) return;
    const newMatches = { ...matches };
    delete newMatches[leftItem];
    setMatches(newMatches);
  };

  const handleSubmit = () => {
    if (Object.keys(matches).length !== pairs.length) return;

    const allCorrect = pairs.every((pair) => matches[pair.left] === pair.right);
    setIsCorrect(allCorrect);
    setShowFeedback(true);
  };

  const handleNextClick = () => {
    onNext(isCorrect);
  };

  return (
    <div className="min-h-screen bg-[#fff0e3] text-gray-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center border border-purple-200">
              <Icon name="Zap" size={24} className="text-purple-600" />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Прибор</h3>
              <div className="space-y-3">
                {leftItems.map((item) => {
                  const isMatched = !!matches[item];
                  const isSelected = selectedLeft === item;

                  return (
                    <div key={item} className="relative">
                      <button
                        onClick={() => handleLeftClick(item)}
                        disabled={showFeedback}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${
                          isSelected
                            ? 'bg-purple-100 border-purple-600 text-purple-900'
                            : isMatched
                            ? 'bg-green-50 border-green-500 text-green-800'
                            : 'bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50 text-gray-800'
                        } ${
                          showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        {item}
                      </button>
                      {isMatched && (
                        <button
                          onClick={() => handleRemoveMatch(item)}
                          disabled={showFeedback}
                          className="absolute -right-3 -top-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                        >
                          <Icon name="X" size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Что измеряет</h3>
              <div className="space-y-3">
                {rightItems.map((item) => {
                  const isUsed = Object.values(matches).includes(item);

                  return (
                    <button
                      key={item}
                      onClick={() => handleRightClick(item)}
                      disabled={showFeedback || !selectedLeft || isUsed}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${
                        isUsed
                          ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                          : selectedLeft
                          ? 'bg-white border-purple-400 hover:bg-purple-50 text-gray-800 cursor-pointer'
                          : 'bg-white border-gray-200 text-gray-800 cursor-not-allowed'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {!showFeedback && (
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(matches).length !== pairs.length}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Проверить
                <Icon name="CheckCircle" size={20} className="ml-2" />
              </Button>
            </div>
          )}

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
                  <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                    {isCorrect ? stage.correctFeedback : stage.incorrectFeedback}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showFeedback && isCorrect && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleNextClick}
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

export default MatchingQuestionScreen;
