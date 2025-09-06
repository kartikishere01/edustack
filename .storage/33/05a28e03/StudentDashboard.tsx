import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Layers, Search, Filter, Award, Calendar, TrendingUp, LogOut, Globe } from 'lucide-react';
import { Course, Badge as BadgeType } from '@/types';
import { getCourses, getBadges } from '@/lib/storage';
import CourseCard from '@/components/CourseCard';
import Badge from '@/components/Badge';
import { useNavigate, Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    const allCourses = getCourses();
    const allBadges = getBadges();
    setCourses(allCourses);
    setFilteredCourses(allCourses);
    setBadges(allBadges);
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tutorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(course => course.subject === selectedSubject);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedSubject, courses]);

  const subjects = Array.from(new Set(courses.map(course => course.subject)));
  const enrolledCoursesCount = user?.enrolledCourses?.length || 0;
  const earnedBadgesCount = user?.badges?.length || 0;
  const currentStreak = user?.streak || 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || user.role !== 'student') {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Layers className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  EduStack
                </span>
              </div>
              <BadgeUI variant="secondary" className="bg-blue-900/50 text-blue-300">
                Student Dashboard
              </BadgeUI>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/api-integration">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <Globe className="h-4 w-4 mr-2" />
                  API Integration
                </Button>
              </Link>
              <span className="text-sm text-gray-400">Welcome, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Student Profile */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">My Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-900/50 to-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-400">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Enrolled Courses</span>
                    </div>
                    <span className="font-semibold text-white">{enrolledCoursesCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">Badges Earned</span>
                    </div>
                    <span className="font-semibold text-white">{earnedBadgesCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">Current Streak</span>
                    </div>
                    <span className="font-semibold text-white">{currentStreak} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges Section */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">My Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {badges.slice(0, 4).map((badge) => (
                    <Badge
                      key={badge.id}
                      badge={badge}
                      earned={user.badges?.includes(badge.id)}
                      size="sm"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Courses */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filter */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search courses, tutors, or topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Filter by subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all" className="text-white">All Subjects</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject} className="text-white">
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Courses Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Available Courses</h2>
                <span className="text-sm text-gray-400">
                  {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              {filteredCourses.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-12 text-center">
                    <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">No courses found</h3>
                    <p className="text-gray-500">
                      Try adjusting your search terms or filters to find more courses.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}