import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

type NameFormScreenProps = {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const NameFormScreen = ({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onSubmit,
}: NameFormScreenProps) => {
  return (
    <div className="min-h-screen bg-[#fff0e3] text-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-scale-in">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center border border-purple-200">
          <Icon name="UserCircle" size={48} className="text-purple-600" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Идентификация агента
        </h2>

        <p className="text-lg text-gray-700 mb-8">
          Представься, агент. Введи своё имя и фамилию для доступа к заданию.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя *
            </label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
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
              onChange={(e) => onLastNameChange(e.target.value)}
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
  );
};

export default NameFormScreen;
