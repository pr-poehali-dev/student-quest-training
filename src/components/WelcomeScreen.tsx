import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type WelcomeScreenProps = {
  hasCompleted: boolean;
  onStartClick: () => void;
};

const WelcomeScreen = ({ hasCompleted, onStartClick }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-[#fff0e3] text-gray-800 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-8 animate-scale-in">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center border border-purple-200">
          <Icon name="Wifi" size={64} className="text-purple-600" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
          Операция "Агент 7-В"
        </h1>

        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Секретное задание: связь между агентами прервана. Только ты можешь восстановить её, пройдя пять испытаний на знание измерения уровней сигнала. Каждый вопрос — это шаг к разгадке.
        </p>

        <div className="bg-white border border-purple-200 p-6 rounded-2xl max-w-md mx-auto shadow-lg">
          <p className="text-sm text-gray-600 mb-2">Твоя миссия</p>
          <ul className="text-left space-y-2 text-gray-800">
            <li className="flex items-start">
              <Icon name="CheckCircle" size={20} className="mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Пройди 5 испытаний</span>
            </li>
            <li className="flex items-start">
              <Icon name="CheckCircle" size={20} className="mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Реши задачи на измерение сигнала</span>
            </li>
            <li className="flex items-start">
              <Icon name="CheckCircle" size={20} className="mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Стань агентом высшего класса</span>
            </li>
          </ul>
        </div>

        {hasCompleted && (
          <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-2xl max-w-md mx-auto">
            <p className="text-yellow-800 font-semibold">
              ⚠️ Внимание! Ты уже проходил эту миссию. При повторном прохождении результат в базу не сохранится.
            </p>
          </div>
        )}

        <Button
          onClick={onStartClick}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl px-12 py-6 rounded-full font-semibold shadow-xl hover:scale-105 transition-transform"
        >
          Начать миссию
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
