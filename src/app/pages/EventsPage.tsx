import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Search, ChevronRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Progress } from '@/app/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { events } from '@/data/mockData';
import { toast } from 'sonner';
import { localCSV } from '@/utils/csvHelper';

export function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [ngoPosts, setNgoPosts] = useState<any[]>([]);

  // Load NGO CSV data on component mount
  useEffect(() => {
    const ngoData = localCSV.getNGOPosts();
    setNgoPosts(ngoData);
  }, []);

  const categories = ['All', 'Environment', 'Education', 'Food', 'Healthcare', 'Community'];

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.ngo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRegister = (event: typeof events[0]) => {
    setSelectedEvent(event);
    setShowRegistrationDialog(true);
  };

  const handleSubmitRegistration = () => {
    toast.success('Registration successful! 🎉', {
      description: `You're registered for ${selectedEvent?.name}. We'll send you details via email.`
    });
    setShowRegistrationDialog(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Environment: 'from-green-500 to-emerald-600',
      Education: 'from-blue-500 to-indigo-600',
      Food: 'from-orange-500 to-red-600',
      Healthcare: 'from-pink-500 to-rose-600',
      Community: 'from-purple-500 to-violet-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Events & Volunteering</h1>
                  <p className="text-white/90">Join community activities and make a difference</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-white/80 mb-1">Upcoming Events</div>
                <div className="text-2xl font-bold">{events.length}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-white/80 mb-1">Active NGOs</div>
                <div className="text-2xl font-bold">{new Set(events.map(e => e.ngo)).size}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-white/80 mb-1">Volunteers Needed</div>
                <div className="text-2xl font-bold">
                  {events.reduce((sum, e) => sum + (e.volunteersNeeded - e.volunteersRegistered), 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="mb-6 grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search events, NGOs, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                className={selectedCategory === category ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 'border-gray-300 hover:bg-blue-50'}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Event */}
        {filteredEvents.length > 0 && (
          <Card className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  ⭐ Featured
                </Badge>
                <CardTitle className="text-indigo-900">Happening This Week</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{filteredEvents[0].name}</h3>
                  <p className="text-gray-700 mb-4">{filteredEvents[0].description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className={`bg-gradient-to-r ${getCategoryColor(filteredEvents[0].category)} w-8 h-8 rounded-lg flex items-center justify-center`}>
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{new Date(filteredEvents[0].date).toLocaleDateString()} at {filteredEvents[0].time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-gray-600" />
                      </div>
                      <span>{filteredEvents[0].location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <span>by {filteredEvents[0].ngo}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleRegister(filteredEvents[0])}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Register Now
                  </Button>
                </div>

                <div className="space-y-4">
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Volunteers Registered</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {filteredEvents[0].volunteersRegistered}/{filteredEvents[0].volunteersNeeded}
                        </span>
                      </div>
                      <Progress 
                        value={(filteredEvents[0].volunteersRegistered / filteredEvents[0].volunteersNeeded) * 100} 
                        className="h-2 mb-1"
                      />
                      <p className="text-xs text-gray-500">
                        {filteredEvents[0].volunteersNeeded - filteredEvents[0].volunteersRegistered} spots remaining
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Event Highlights</h4>
                      <ul className="space-y-1 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Free refreshments provided</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Certificate of participation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Meet like-minded volunteers</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CSV NGO Events */}
        {ngoPosts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recently Added Events</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {ngoPosts.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow bg-white border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      </div>
                      <Badge className={`bg-gradient-to-r ${getCategoryColor(event.category)} text-white`}>
                        {event.category}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleRegister(event)}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Register
                      </Button>
                      <Button
                        onClick={() => setSelectedEvent(event)}
                        variant="outline"
                        className="border-purple-300 hover:bg-purple-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Events */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {filteredEvents.map((event) => {
              const spotsRemaining = event.volunteersNeeded - event.volunteersRegistered;
              const isAlmostFull = spotsRemaining <= 5;

              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`bg-gradient-to-r ${getCategoryColor(event.category)} text-white`}>
                        {event.category}
                      </Badge>
                      {isAlmostFull && (
                        <Badge variant="outline" className="border-orange-500 text-orange-700">
                          Almost Full
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>Organized by {event.ngo}</span>
                      </div>
                    </div>

                    <Card className="bg-gray-50 mb-4">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Registration Progress</span>
                          <span className="text-xs font-semibold text-gray-900">
                            {event.volunteersRegistered}/{event.volunteersNeeded} volunteers
                          </span>
                        </div>
                        <Progress 
                          value={(event.volunteersRegistered / event.volunteersNeeded) * 100} 
                          className="h-2"
                        />
                      </CardContent>
                    </Card>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleRegister(event)}
                        className={`flex-1 ${isAlmostFull ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} text-white hover:opacity-90`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Register
                      </Button>
                      <Button
                        onClick={() => setSelectedEvent(event)}
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <Card className="bg-white">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}

        {/* Registration Dialog */}
        <Dialog open={showRegistrationDialog} onOpenChange={setShowRegistrationDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register for Event</DialogTitle>
              <DialogDescription>{selectedEvent?.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-blue-900">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{selectedEvent && new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent?.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-900">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent?.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-900">
                    <Users className="w-4 h-4" />
                    <span>Organized by {selectedEvent?.ngo}</span>
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Enter your phone number" />
              </div>

              <div>
                <Label htmlFor="skills">Your Skills (Optional)</Label>
                <Input id="skills" placeholder="e.g., Teaching, First Aid, Photography" />
              </div>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-3 text-sm text-green-800">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  You'll receive event details and updates via email and SMS
                </CardContent>
              </Card>

              <Button
                onClick={handleSubmitRegistration}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 py-6 text-lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm Registration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </>
  );
}
