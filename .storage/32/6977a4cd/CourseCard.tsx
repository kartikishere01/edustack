import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, User, IndianRupee } from 'lucide-react';
import { Course } from '@/types';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
}

export default function CourseCard({ course, showEnrollButton = true }: CourseCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gray-900 border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="mb-2 bg-blue-900/50 text-blue-300">
            {course.subject}
          </Badge>
          <div className="flex items-center space-x-1">
            {renderStars(course.averageRating)}
            <span className="text-sm text-gray-400 ml-1">
              ({course.totalReviews})
            </span>
          </div>
        </div>
        <CardTitle className="text-lg group-hover:text-blue-400 transition-colors text-white">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-gray-400">
          {course.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-400">
            <User className="h-4 w-4 mr-1" />
            {course.tutorName}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <IndianRupee className="h-4 w-4 text-green-400" />
              <span className="font-semibold text-green-400">
                {course.totalPrice}
              </span>
              <span className="text-gray-500 ml-1">
                (₹{course.pricePerSection}/section)
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {course.numberOfSections} sections
            </span>
          </div>
          
          {showEnrollButton && (
            <Link to={`/course/${course.id}`} className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Course
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}