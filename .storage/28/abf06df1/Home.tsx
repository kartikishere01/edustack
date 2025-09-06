import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Award, TrendingUp, Layers, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              EduStack
            </span>
          </div>
          <div className="space-x-4">
            <Link to="/auth?mode=login">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Login
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Learn{' '}
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Anything
            </span>{' '}
            with Expert Guidance
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Master any subject through interactive lessons, hands-on projects, 
            and personalized guidance from expert tutors across all domains.
          </p>
          <div className="space-x-4">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Start Learning Free
              </Button>
            </Link>
            <Link to="/auth?mode=signup&role=tutor">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-gray-600 text-gray-300 hover:bg-gray-800">
                Become a Tutor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose EduStack?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our platform combines the best of interactive learning with expert guidance across all subjects
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-gray-900 border-gray-800 text-center p-6 hover:bg-gray-800 transition-colors">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Interactive Lessons</h3>
              <p className="text-gray-400">
                Learn through hands-on exercises and real-world projects across all subjects
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-center p-6 hover:bg-gray-800 transition-colors">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Expert Tutors</h3>
              <p className="text-gray-400">
                Get guidance from industry professionals and experienced educators
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-center p-6 hover:bg-gray-800 transition-colors">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Earn Badges</h3>
              <p className="text-gray-400">
                Track your progress and earn achievements as you complete courses
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-center p-6 hover:bg-gray-800 transition-colors">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-orange-900/50 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Track Progress</h3>
              <p className="text-gray-400">
                Monitor your learning journey with detailed progress analytics
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-center p-6 hover:bg-gray-800 transition-colors">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto">
                <IndianRupee className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Flexible Pricing</h3>
              <p className="text-gray-400">
                Buy courses in chunks - pay only for what you want to learn
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900/50 to-green-900/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of students already learning on our platform
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-black hover:bg-gray-200">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Layers className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">EduStack</span>
          </div>
          <p className="text-gray-400">
            © 2024 EduStack. All rights reserved. Built with ❤️ for learners everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}