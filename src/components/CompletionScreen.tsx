import Icon from '@/components/ui/icon';

type CompletionScreenProps = {
  firstName: string;
  lastName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
};

const CompletionScreen = ({
  firstName,
  lastName,
  score,
  correctAnswers,
  totalQuestions,
}: CompletionScreenProps) => {
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
              Правильных ответов с первой попытки: <span className="font-bold text-gray-900">{correctAnswers} из {totalQuestions}</span>
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
};

export default CompletionScreen;
