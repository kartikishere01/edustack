import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, User, DollarSign, BookOpen, Star, ShoppingCart, CheckCircle } from 'lucide-react';
import { Course, Chunk, Review } from '@/types';
import { getCourses, getChunks, getReviews, saveReview, saveUser, getUsers } from '@/lib/storage';
import StarRating from '@/components/StarRating';
import ProgressTracker from '@/components/ProgressTracker';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [purchasedChunks, setPurchasedChunks] = useState<string[]>([]);
  const [completedChunks, setCompletedChunks] = useState<string[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    
    const courses = getCourses();
    const foundCourse = courses.find(c => c.id === courseId);
    
    if (!foundCourse) {
      navigate('/dashboard');
      return;
    }
    
    setCourse(foundCourse);
    setChunks(getChunks(courseId));
    setReviews(getReviews(courseId));
    
    // Load user's purchased and completed chunks
    if (user) {
      // In a real app, this would come from user progress data
      setPurchasedChunks(user.enrolledCourses?.includes(courseId) ? chunks.map(c => c.id) : []);
      setCompletedChunks(user.completedChunks || []);
    }
  }, [courseId, user, navigate]);

  const handlePurchaseChunk = (chunkId: string) => {
    if (!user) return;
    
    // Simulate purchase
    setPurchasedChunks(prev => [...prev, chunkId]);
    
    // Update user's enrolled courses
    const users = getUsers();
    const updatedUser = { 
      ...user, 
      enrolledCourses: user.enrolledCourses?.includes(courseId!) 
        ? user.enrolledCourses 
        : [...(user.enrolledCourses || []), courseId!]
    };
    saveUser(updatedUser);
  };

  const handleCompleteChunk = (chunkId: string) => {
    if (!user) return;
    
    setCompletedChunks(prev => [...prev, chunkId]);
    
    // Update user's completed chunks
    const users = getUsers();
    const updatedUser = { 
      ...user, 
      completedChunks: [...(user.completedChunks || []), chunkId]
    };
    saveUser(updatedUser);
  };

  const handleSubmitReview = () => {
    if (!user || !course || newReview.rating === 0) return;
    
    const review: Review = {
      id: Date.now().toString(),
      courseId: course.id,
      studentId: user.id,
      studentName: user.name,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date().toISOString()
    };
    
    saveReview(review);
    setReviews(prev => [review, ...prev]);
    setNewReview({ rating: 0, comment: '' });
    setShowReviewForm(false);
  };

  if (!course || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  const isEnrolled = user.enrolledCourses?.includes(courseId!);
  const hasReviewed = reviews.some(r => r.studentId === user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="secondary">{course.subject}</Badge>
                    <h1 className="text-3xl font-bold">{course.title}</h1>
                    <p className="text-gray-600">{course.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${course.totalPrice}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${course.pricePerSection}/section
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 pt-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{course.tutorName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarRating rating={course.averageRating} readonly size="sm" />
                    <span className="text-sm text-gray-600">
                      ({course.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Course Sections */}
            <Card>
              <CardHeader>
                <CardTitle>Course Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chunks.map((chunk, index) => {
                    const isPurchased = purchasedChunks.includes(chunk.id);
                    const isCompleted = completedChunks.includes(chunk.id);
                    
                    return (
                      <div
                        key={chunk.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          isPurchased ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                              )}
                              <div>
                                <h4 className="font-semibold">
                                  {index + 1}. {chunk.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {chunk.content.substring(0, 100)}...
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-green-600">
                              ${chunk.price}
                            </span>
                            {!isPurchased ? (
                              <Button
                                size="sm"
                                onClick={() => handlePurchaseChunk(chunk.id)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Purchase
                              </Button>
                            ) : !isCompleted ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCompleteChunk(chunk.id)}
                              >
                                Mark Complete
                              </Button>
                            ) : (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Student Reviews</CardTitle>
                  {isEnrolled && !hasReviewed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      Write Review
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Review Form */}
                {showReviewForm && (
                  <Card className="bg-blue-50">
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium">Your Rating</label>
                        <StarRating
                          rating={newReview.rating}
                          onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Your Review</label>
                        <Textarea
                          placeholder="Share your experience with this course..."
                          value={newReview.comment}
                          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleSubmitReview}>
                          Submit Review
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowReviewForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-semibold">{review.studentName}</h5>
                            <StarRating rating={review.rating} readonly size="sm" />
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {isEnrolled && (
              <ProgressTracker
                chunks={chunks}
                completedChunks={completedChunks}
                courseTitle={course.title}
              />
            )}

            {!isEnrolled && (
              <Card>
                <CardHeader>
                  <CardTitle>Enroll in Course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      Purchase individual sections or get the full course at a discounted rate.
                    </AlertDescription>
                  </Alert>
                  <Button className="w-full" size="lg">
                    Enroll for ${course.totalPrice}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sections</span>
                  <span className="font-semibold">{course.numberOfSections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Reviews</span>
                  <span className="font-semibold">{course.totalReviews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <span className="font-semibold">{course.averageRating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subject</span>
                  <Badge variant="secondary">{course.subject}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}