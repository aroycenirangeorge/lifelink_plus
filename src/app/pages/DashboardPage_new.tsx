import { useState, useEffect } from 'react';
import { 
  Heart, 
  Droplet, 
  DollarSign, 
  Calendar, 
  Award, 
  TrendingUp, 
  MapPin, 
  AlertCircle, 
  Clock,
  Star,
  ChevronRight,
  Plus,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { currentUser, events, bloodRequests, getGreeting, isBirthday } from '@/data/mockData';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [greeting, setGreeting] = useState('');
  const [showBirthday, setShowBirthday] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setGreeting(getGreeting());
    setShowBirthday(isBirthday());
  }, []);

  const stats = [
    {
      title: "Total Donations",
      value: currentUser.totalDonations,
      icon: Droplet,
      color: "gradient-brand",
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "Lives Impacted",
      value: "1,247",
      icon: Heart,
      color: "gradient-brand",
      change: "+8%",
      changeType: "increase" as const,
    },
    {
      title: "Events Attended",
      value: "23",
      icon: Calendar,
      color: "gradient-brand",
      change: "+3",
      changeType: "increase" as const,
    },
    {
      title: "Achievement Points",
      value: "850",
      icon: Award,
      color: "gradient-brand",
      change: "+50",
      changeType: "increase" as const,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "donation",
      title: "Blood Donation Completed",
      description: "Successfully donated O+ blood at City Hospital",
      time: "2 hours ago",
      icon: Droplet,
      color: "text-brand-600",
    },
    {
      id: 2,
      type: "event",
      title: "Event Registration",
      description: "Registered for Community Blood Drive",
      time: "1 day ago",
      icon: Calendar,
      color: "text-info",
    },
    {
      id: 3,
      type: "achievement",
      title: "New Achievement",
      description: "Earned 'Life Saver' badge for 10 donations",
      time: "3 days ago",
      icon: Award,
      color: "text-warning",
    },
    {
      id: 4,
      type: "thankyou",
      title: "Thank You Message",
      description: "Received thanks from blood recipient",
      time: "1 week ago",
      icon: Heart,
      color: "text-success",
    },
  ];

  const upcomingEvents = events.slice(0, 3);

  const urgentRequests = bloodRequests
    .filter(req => req.urgency === 'Critical')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8 slide-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {greeting}, {currentUser.name}!
              </h1>
              <p className="text-lg text-text-secondary">
                Welcome back to your LifeLink+ dashboard
              </p>
              {showBirthday && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-xl border border-brand-200">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">Happy Birthday! 🎉</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button className="gradient-brand text-white shadow-brand-sm hover:shadow-brand-md transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Quick Donate
              </Button>
              <Button variant="outline" className="border-border-subtle hover:bg-surface transition-all duration-200">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-elevated group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shadow-brand-sm group-hover:shadow-brand-md transition-all duration-200`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-success' : 'text-destructive'
                    }`}>
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                    <div className="text-sm text-text-tertiary">{stat.title}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-effect p-1 rounded-xl border border-border-subtle">
            <TabsTrigger 
              value="overview" 
              className="rounded-lg px-4 py-2 data-[state=active]:bg-surface data-[state=active]:shadow-sm transition-all duration-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="rounded-lg px-4 py-2 data-[state=active]:bg-surface data-[state=active]:shadow-sm transition-all duration-200"
            >
              Activities
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="rounded-lg px-4 py-2 data-[state=active]:bg-surface data-[state=active]:shadow-sm transition-all duration-200"
            >
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="requests" 
              className="rounded-lg px-4 py-2 data-[state=active]:bg-surface data-[state=active]:shadow-sm transition-all duration-200"
            >
              Urgent Needs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Activities */}
              <div className="lg:col-span-2">
                <Card className="card-elevated">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold text-text-primary">Recent Activities</CardTitle>
                        <CardDescription className="text-text-tertiary">Your latest actions and achievements</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => {
                        const Icon = activity.icon;
                        return (
                          <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-surface/50 hover:bg-surface transition-colors duration-200">
                            <div className={`w-10 h-10 rounded-lg bg-surface flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 ${activity.color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-text-primary">{activity.title}</div>
                              <div className="text-sm text-text-secondary mt-1">{activity.description}</div>
                              <div className="text-xs text-text-quaternary mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.time}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card className="card-elevated">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-text-primary">Quick Actions</CardTitle>
                    <CardDescription className="text-text-tertiary">Common tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => onNavigate('blood')}
                      className="w-full justify-start gap-3 h-12 px-4"
                      variant="outline"
                    >
                      <Droplet className="w-5 h-5 text-brand-600" />
                      <span>Blood Donation</span>
                    </Button>
                    <Button 
                      onClick={() => onNavigate('events')}
                      className="w-full justify-start gap-3 h-12 px-4"
                      variant="outline"
                    >
                      <Calendar className="w-5 h-5 text-info" />
                      <span>Find Events</span>
                    </Button>
                    <Button 
                      onClick={() => onNavigate('donations')}
                      className="w-full justify-start gap-3 h-12 px-4"
                      variant="outline"
                    >
                      <DollarSign className="w-5 h-5 text-success" />
                      <span>Make Donation</span>
                    </Button>
                    <Button 
                      onClick={() => onNavigate('disaster')}
                      className="w-full justify-start gap-3 h-12 px-4"
                      variant="outline"
                    >
                      <AlertCircle className="w-5 h-5 text-warning" />
                      <span>Emergency Aid</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-text-primary">All Activities</CardTitle>
                <CardDescription className="text-text-tertiary">Complete history of your activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl border border-border-subtle hover:bg-surface transition-colors duration-200">
                      <div className={`w-10 h-10 rounded-lg bg-surface flex items-center justify-center`}>
                        <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-text-primary">{activity.title}</div>
                        <div className="text-sm text-text-secondary">{activity.description}</div>
                      </div>
                      <div className="text-xs text-text-quaternary">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="card-elevated group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shadow-brand-sm">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-brand-100 text-brand-700 border-brand-200">
                        Upcoming
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-text-primary mb-2 group-hover:text-brand-600 transition-colors">
                      {event.name}
                    </h3>
                    <div className="space-y-2 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-text-primary">Urgent Blood Requests</CardTitle>
                <CardDescription className="text-text-tertiary">Critical needs in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {urgentRequests.map((request) => (
                    <div key={request.id} className="flex items-center gap-4 p-4 rounded-xl border border-border-subtle hover:bg-surface transition-colors duration-200">
                      <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                        <Droplet className="w-6 h-6 text-brand-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-text-primary">{request.hospital}</div>
                        <div className="text-sm text-text-secondary">
                          {request.bloodGroup} • {request.unitsNeeded} units needed
                        </div>
                        <div className="text-xs text-text-quaternary mt-1">{request.location}</div>
                      </div>
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                        Critical
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
