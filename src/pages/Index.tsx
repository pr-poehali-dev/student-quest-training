import { useState, useEffect } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import NameFormScreen from '@/components/NameFormScreen';
import QuestionScreen from '@/components/QuestionScreen';
import CompletionScreen from '@/components/CompletionScreen';
import { stages } from '@/data/stages';
import { playSound } from '@/utils/audio';

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

  if (showNameForm) {
    return (
      <NameFormScreen
        firstName={firstName}
        lastName={lastName}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onSubmit={handleSubmitName}
      />
    );
  }

  if (!started) {
    return (
      <WelcomeScreen
        hasCompleted={hasCompleted}
        onStartClick={handleStartClick}
      />
    );
  }

  if (completed) {
    const correctAnswers = firstAttempts.filter(Boolean).length;
    const score = Math.round((correctAnswers / stages.length) * 100);
    
    return (
      <CompletionScreen
        firstName={firstName}
        lastName={lastName}
        score={score}
        correctAnswers={correctAnswers}
        totalQuestions={stages.length}
      />
    );
  }

  return (
    <QuestionScreen
      stage={stages[currentStage]}
      currentStage={currentStage}
      totalStages={stages.length}
      firstName={firstName}
      selectedOption={selectedOption}
      showFeedback={showFeedback}
      isCorrect={isCorrect}
      onOptionSelect={handleOptionSelect}
      onNext={handleNext}
    />
  );
};

export default Index;
