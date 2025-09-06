import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Brain, ArrowLeft } from 'lucide-react';
import { saveUser, getUsers } from '@/lib/storage';

const questions = [
  {
    id: 1,
    question: "What is the derivative of x²?",
    options: ["2x", "x", "2", "x²"],
    correct: 0
  },
  {
    id: 2,
    question: "Which of the following is Newton's second law?",
    options: ["F = ma", "E = mc²", "v = u + at", "P = mv"],
    correct: 0
  },
  {
    id: 3,
    question: "What is the molecular formula for water?",
    options: ["H₂O₂", "H₂O", "HO", "H₃O"],
    correct: 1
  },
  {
    id: 4,
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
    correct: 2
  },
  {
    id: 5,
    question: "What is the quadratic formula?",
    options: ["x = -b ± √(b²-4ac)/2a", "x = b ± √(b²+4ac)/2a", "x = -b ± √(b²+4ac)/2a", "x = b ± √(b²-4ac)/2a"],
    correct: 0
  }
];

export default function TutorAccess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correctAnswers = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correct ? 1 : 0);
      }, 0);
      
      const finalScore = (correctAnswers / questions.length) * 10;
      setScore(finalScore);
      setShowResults(true);
      
      // Update user approval status
      if (user && finalScore >= 5) {
        const users = getUsers();
        const updatedUser = { 
          ...user, 
          isApproved: true, 
          accessScore: finalScore 
        };
        saveUser(updatedUser);
      }
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!user || user.role !== 'tutor') {
    navigate('/auth');
    return null;
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {score >= 5 ? (
                <CheckCircle className="h-16 w-16 text-green-600" />
              ) : (
                <XCircle className="h-16 w-16 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              Assessment {score >= 5 ? 'Passed!' : 'Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="text-3xl font-bold">
              {score.toFixed(1)}/10
            </div>
            
            {score >= 5 ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Congratulations! You've been approved as a tutor. You can now create and manage courses.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  You need a score of 5 or higher to become a tutor. Please study more and try again later.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => navigate('/dashboard')}
              >
                {score >= 5 ? 'Go to Dashboard' : 'Back to Profile'}
              </Button>
              {score < 5 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setSelectedAnswer(null);
                    setShowResults(false);
                    setScore(0);
                  }}
                >
                  Retake Assessment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Tutor Assessment</CardTitle>
                <p className="text-gray-600">
                  Answer {questions.length} questions to demonstrate your knowledge
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {questions[currentQuestion].question}
              </h3>
              
              <RadioGroup 
                value={selectedAnswer?.toString()} 
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleNext}
                disabled={selectedAnswer === null}
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Assessment'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>You need a score of 5/10 or higher to become an approved tutor.</p>
        </div>
      </div>
    </div>
  );
}