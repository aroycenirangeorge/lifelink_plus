import { Droplet, DollarSign, AlertTriangle, Calendar, Heart, Users, TrendingUp, Award, Newspaper, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { DemoLogin } from '@/app/components/DemoLogin';
import { useState } from 'react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [showDemoLogin, setShowDemoLogin] = useState(true);

  const impactStats = [
    { label: 'Lives Saved', value: '2,500+', icon: Heart, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Active Volunteers', value: '1,200+', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Funds Raised', value: '₹25L+', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'NGOs Verified', value: '50+', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  const quickActions = [
    { id: 'blood', title: 'Donate Blood', icon: Droplet, gradient: 'from-red-500 to-red-700', stat: '3 Critical' },
    { id: 'donations', title: 'Donate Money', icon: DollarSign, gradient: 'from-green-500 to-emerald-700', stat: '12 NGOs' },
    { id: 'disaster', title: 'Disaster Relief', icon: AlertTriangle, gradient: 'from-orange-500 to-red-700', stat: '2 Active' },
    { id: 'events', title: 'Events', icon: Calendar, gradient: 'from-blue-500 to-indigo-700', stat: '5 Upcoming' }
  ];

  const latestNews = [
    {
      title: 'Blood Donation Camp Success',
      description: 'Over 500 units collected at the Mumbai Central camp last weekend.',
      time: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400'
    },
    {
      title: 'New NGO Partnership',
      description: 'LifeLink+ partners with Red Cross for disaster relief operations.',
      time: '5 hours ago',
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400'
    },
    {
      title: 'Volunteer Milestone',
      description: 'We have reached 1,200+ active volunteers across India!',
      time: '1 day ago',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400'
    }
  ];

  const urgentRequests = [
    { bloodType: 'O-', location: 'AIIMS Delhi', urgency: 'Critical', time: '30 mins ago' },
    { bloodType: 'AB+', location: 'Apollo Mumbai', urgency: 'Urgent', time: '1 hour ago' },
    { bloodType: 'B-', location: 'CMC Vellore', urgency: 'Critical', time: '2 hours ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      {/* Hero Section with Login */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-pink-600 to-orange-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6">
            {/* Logo */}
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <Heart className="w-8 h-8" fill="currentColor" />
              <span className="text-2xl font-bold">LifeLink+</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold">
              One Platform,
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Infinite Impact
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Donate blood, support causes, volunteer, and help disaster relief - all in one place
            </p>

            {/* Login CTA */}
            <div className="pt-4">
              <Button
                size="lg"
                onClick={() => setShowDemoLogin(true)}
                className="bg-white text-red-600 hover:bg-gray-100 shadow-xl text-lg px-10 py-6 rounded-2xl transition-all hover:scale-105"
              >
                <Heart className="w-5 h-5 mr-2" />
                Login to Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {impactStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                <CardContent className="p-5 text-center">
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions & Urgent Requests */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.id}
                    className="group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
                    onClick={() => setShowDemoLogin(true)}
                  >
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className={`bg-gradient-to-br ${action.gradient} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-500">{action.stat} needs</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Urgent Blood Requests */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Droplet className="w-6 h-6 text-red-600" />
              Urgent Requests
            </h2>
            <Card className="shadow-lg">
              <CardContent className="p-4 space-y-3">
                {urgentRequests.map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                    onClick={() => setShowDemoLogin(true)}
                  >
                    <div className="bg-red-600 text-white font-bold w-12 h-12 rounded-xl flex items-center justify-center text-sm">
                      {request.bloodType}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {request.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${request.urgency === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                          {request.urgency}
                        </span>
                        <span className="text-xs text-gray-400">{request.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => setShowDemoLogin(true)}
                >
                  View All Requests
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Latest News */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-blue-600" />
              Latest News & Updates
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {latestNews.map((news, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                <div className="h-40 overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <Clock className="w-3 h-3" />
                    {news.time}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{news.title}</h3>
                  <p className="text-sm text-gray-600">{news.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>



      {/* Footer Note */}
      <div className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 LifeLink+ | Made with ❤️ by HumanityOS
          </p>
        </div>
      </div>

      <DemoLogin open={showDemoLogin} onOpenChange={setShowDemoLogin} onNavigate={onNavigate} />
    </div>
  );
}