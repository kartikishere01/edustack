import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle } from 'lucide-react';
import { Chunk } from '@/types';

interface ProgressTrackerProps {
  chunks: Chunk[];
  completedChunks: string[];
  courseTitle: string;
}

export default function ProgressTracker({ chunks, completedChunks, courseTitle }: ProgressTrackerProps) {
  const completionPercentage = chunks.length > 0 
    ? (completedChunks.length / chunks.length) * 100 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Course Progress</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{courseTitle}</span>
            <span>{Math.round(completionPercentage)}% Complete</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700">Sections</h4>
          <div className="space-y-2">
            {chunks.map((chunk, index) => {
              const isCompleted = completedChunks.includes(chunk.id);
              
              return (
                <div
                  key={chunk.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    isCompleted ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      isCompleted ? 'text-green-800' : 'text-gray-700'
                    }`}>
                      {index + 1}. {chunk.title}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    isCompleted 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    ${chunk.price}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}