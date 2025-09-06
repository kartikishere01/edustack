import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Plus, Users, DollarSign, LogOut, AlertCircle } from 'lucide-react';
import { Course, Chunk } from '@/types';
import { getCourses, saveCourse, saveChunk, saveUser, getUsers } from '@/lib/storage';
import CourseCard from '@/components/CourseCard';

export default function TutorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(user?.subjects || []);
  
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    subject: '',
    numberOfSections: 4,
    totalPrice: 80,
    sections: Array(4).fill('').map(() => ({ title: '', content: '' }))
  });

  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology'];

  useEffect(() => {
    if (user?.id) {
      const allCourses = getCourses();
      const tutorCourses = allCourses.filter(course => course.tutorId === user.id);
      setMyCourses(tutorCourses);
    }
  }, [user]);

  const handleSubjectToggle = (subject: string) => {
    const updated = selectedSubjects.includes(subject)
      ? selectedSubjects.filter(s => s !== subject)
      : [...selectedSubjects, subject];
    
    setSelectedSubjects(updated);
    
    if (user) {
      const users = getUsers();
      const updatedUser = { ...user, subjects: updated };
      saveUser(updatedUser);
    }
  };

  const handleCourseFormChange = (field: string, value: any) => {
    setCourseForm(prev => ({ ...prev, [field]: value }));
    
    if (field === 'numberOfSections') {
      const newSections = Array(value).fill('').map((_, i) => 
        prev.sections[i] || { title: '', content: '' }
      );
      setCourseForm(prev => ({ ...prev, sections: newSections }));
    }
  };

  const handleSectionChange = (index: number, field: string, value: string) => {
    setCourseForm(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleCreateCourse = () => {
    if (!user || !courseForm.title || !courseForm.subject) return;
    
    const courseId = Date.now().toString();
    const pricePerSection = Math.round(courseForm.totalPrice / courseForm.numberOfSections);
    
    const newCourse: Course = {
      id: courseId,
      title: courseForm.title,
      description: courseForm.description,
      tutorId: user.id,
      tutorName: user.name,
      subject: courseForm.subject,
      totalPrice: courseForm.totalPrice,
      numberOfSections: courseForm.numberOfSections,
      pricePerSection,
      averageRating: 0,
      totalReviews: 0,
      createdAt: new Date().toISOString()
    };
    
    saveCourse(newCourse);
    
    // Create course chunks
    courseForm.sections.forEach((section, index) => {
      const chunk: Chunk = {
        id: `${courseId}-${index + 1}`,
        courseId,
        title: section.title || `Section ${index + 1}`,
        content: section.content || 'Content coming soon...',
        order: index + 1,
        price: pricePerSection
      };
      saveChunk(chunk);
    });
    
    setMyCourses(prev => [...prev, newCourse]);
    setCourseForm({
      title: '',
      description: '',
      subject: '',
      numberOfSections: 4,
      totalPrice: 80,
      sections: Array(4).fill('').map(() => ({ title: '', content: '' }))
    });
    setShowCourseForm(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || user.role !== 'tutor') {
    navigate('/auth');
    return null;
  }

  if (!user.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span>Tutor Access Pending</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Your tutor application is being reviewed. You'll be able to create courses once approved.
              </AlertDescription>
            </Alert>
            <div className="flex space-x-2">
              <Button onClick={() => navigate('/tutor-access')} className="flex-1">
                Take Assessment
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  EduPlatform
                </span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Tutor Dashboard
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                    Approved Tutor
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">My Courses</span>
                    <span className="font-semibold">{myCourses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Students</span>
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject Selection */}
            <Card>
              <CardHeader>
                <CardTitle>My Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {subjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={subject}
                        checked={selectedSubjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject)}
                        className="rounded"
                      />
                      <label htmlFor={subject} className="text-sm">{subject}</label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Course Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <Button onClick={() => setShowCourseForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </div>

            {/* Course Creation Form */}
            {showCourseForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        value={courseForm.title}
                        onChange={(e) => handleCourseFormChange('title', e.target.value)}
                        placeholder="Enter course title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={courseForm.subject}
                        onValueChange={(value) => handleCourseFormChange('subject', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedSubjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={courseForm.description}
                      onChange={(e) => handleCourseFormChange('description', e.target.value)}
                      placeholder="Describe your course"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sections">Number of Sections</Label>
                      <Select
                        value={courseForm.numberOfSections.toString()}
                        onValueChange={(value) => handleCourseFormChange('numberOfSections', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} sections
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Total Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={courseForm.totalPrice}
                        onChange={(e) => handleCourseFormChange('totalPrice', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Section Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Section Details</h4>
                    {courseForm.sections.map((section, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          <Label>Section {index + 1}</Label>
                          <Input
                            placeholder="Section title"
                            value={section.title}
                            onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                          />
                          <Textarea
                            placeholder="Section content"
                            value={section.content}
                            onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                            rows={2}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={handleCreateCourse}>
                      Create Course
                    </Button>
                    <Button variant="outline" onClick={() => setShowCourseForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* My Courses Grid */}
            {myCourses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No courses yet</h3>
                  <p className="text-gray-500 mb-4">
                    Create your first course to start teaching students.
                  </p>
                  <Button onClick={() => setShowCourseForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {myCourses.map((course) => (
                  <CourseCard key={course.id} course={course} showEnrollButton={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}