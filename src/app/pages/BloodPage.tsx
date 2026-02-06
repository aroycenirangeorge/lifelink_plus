import { useState, useEffect } from 'react';
import { Droplet, MapPin, Phone, Calendar, Info, CheckCircle, X, Clock, User, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { currentUser, bloodRequests, bloodCamps } from '@/data/mockData';
import { toast } from 'sonner';
import { localCSV } from '@/utils/csvHelper';

interface BloodPageProps {
  onNavigate: (page: string) => void;
}

export function BloodPage(_: BloodPageProps) {
  const [isAvailable, setIsAvailable] = useState(currentUser.available);
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [campPosts, setCampPosts] = useState<any[]>([]);
  const [requirementPosts, setRequirementPosts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'urgency' | 'location' | 'date'>('urgency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [campSortOrder, setCampSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load CSV data on component mount
  useEffect(() => {
    const camps = localCSV.getCampPosts();
    const requirements = localCSV.getRequirementPosts();
    setCampPosts(camps);
    setRequirementPosts(requirements);
  }, []);

  const handleContact = (request: typeof bloodRequests[0]) => {
    toast.success(`Contact initiated with ${request.contactName}`, {
      description: `Call ${request.contactPhone} for ${request.bloodGroup} blood at ${request.hospital}`
    });
  };

  const handleJoinCamp = (camp: typeof bloodCamps[0]) => {
    toast.success('Successfully registered for blood camp!', {
      description: `${camp.name} on ${new Date(camp.date).toLocaleDateString()}`
    });
  };

  const handleReminder = (camp: typeof bloodCamps[0]) => {
    toast.success('Reminder set!', {
      description: `We'll remind you about ${camp.name} one day before`
    });
  };

  // Sort blood camps by date
  const sortedBloodCamps = [...bloodCamps].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return campSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Sort CSV camp posts by date
  const sortedCampPosts = [...campPosts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return campSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Sort mock blood requests by urgency (Critical to Low)
  const sortedBloodRequests = [...bloodRequests].sort((a, b) => {
    const urgencyOrder = { 'Critical': 3, 'High': 2, 'Medium': 1 };
    return urgencyOrder[b.urgency as keyof typeof urgencyOrder] - urgencyOrder[a.urgency as keyof typeof urgencyOrder];
  });

  // Sorting functions
  const sortedRequirementPosts = [...requirementPosts].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'urgency':
        const urgencyOrder = { 'Critical': 3, 'High': 2, 'Medium': 1 };
        comparison = urgencyOrder[b.urgency as keyof typeof urgencyOrder] - urgencyOrder[a.urgency as keyof typeof urgencyOrder];
        break;
      case 'location':
        comparison = a.location.localeCompare(b.location);
        break;
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Profile Stats */}
        <Card className="mb-6 bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <Droplet className="w-10 h-10 text-white" fill="white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Blood Donation</h1>
                  <p className="text-white/90">Save lives, donate blood</p>
                </div>
              </div>
            </div>

            {/* Enhanced Profile Section */}
            <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Profile Avatar & Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isAvailable ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                    }`}>
                      {isAvailable ? '✓' : '○'}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{currentUser.name}</h2>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{currentUser.city}</span>
                      <span className="text-white/40">•</span>
                      <span className="text-sm">{currentUser.bloodGroup}</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                    <div className="text-white/70 text-xs font-medium mb-1 group-hover:text-white transition-colors">Blood Group</div>
                    <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">{currentUser.bloodGroup}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                    <div className="text-white/70 text-xs font-medium mb-1 group-hover:text-white transition-colors">Donations</div>
                    <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">{currentUser.totalDonations}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                    <div className="text-white/70 text-xs font-medium mb-1 group-hover:text-white transition-colors">Lives Saved</div>
                    <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">{currentUser.totalDonations * 3}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                    <div className="text-white/70 text-xs font-medium mb-1 group-hover:text-white transition-colors">Impact</div>
                    <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">{currentUser.impactScore}</div>
                  </div>
                </div>

                {/* Donor Status Toggle */}
                <div className={`backdrop-blur-sm rounded-xl p-4 transition-all duration-300 ${
                  isAvailable 
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-300/30 shadow-[0_0_20px_rgba(74,222,128,0.3)]' 
                    : 'bg-white/10 border border-white/20'
                }`}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-center">
                      <div className={`text-sm font-medium mb-1 ${
                        isAvailable ? 'text-green-100' : 'text-white/80'
                      }`}>
                        Donor Status
                      </div>
                      <div className={`text-lg font-bold ${
                        isAvailable ? 'text-white' : 'text-white/60'
                      }`}>
                        {isAvailable ? 'Available' : 'Unavailable'}
                      </div>
                      <div className={`text-xs ${
                        isAvailable ? 'text-green-200' : 'text-white/50'
                      }`}>
                        {isAvailable ? 'Ready to donate' : 'Mark as available'}
                      </div>
                    </div>
                    <Switch
                      checked={isAvailable}
                      onCheckedChange={setIsAvailable}
                      className={`transition-all duration-300 ${
                        isAvailable 
                          ? 'bg-green-400 data-[state=checked]:bg-white' 
                          : 'bg-white/30 data-[state=unchecked]:bg-black/20'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info Bar */}
              <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-white/60 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Last: {new Date(currentUser.lastDonation).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>Member since {new Date(currentUser.joinedDate).getFullYear()}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setShowDonorForm(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>

                      </CardContent>
        </Card>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="bg-white/40 backdrop-blur-md border border-white/50 p-2 rounded-full shadow-lg w-full md:w-auto md:inline-flex gap-2">
            <TabsTrigger
              value="requests"
              className="rounded-full px-8 py-3 text-base md:text-lg font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Critical Needs
            </TabsTrigger>
            <TabsTrigger
              value="camps"
              className="rounded-full px-8 py-3 text-base md:text-lg font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Blood Camps
            </TabsTrigger>
            <TabsTrigger
              value="guidelines"
              className="rounded-full px-8 py-3 text-base md:text-lg font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Guidelines
            </TabsTrigger>
          </TabsList>

          {/* Critical Blood Requests */}
          <TabsContent value="requests" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Critical Blood Needs</h2>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgency">Urgency</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>

            {/* CSV Requirement Posts */}
            {requirementPosts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Needs</h3>
                {sortedRequirementPosts.map((request) => (
                  <div key={request.id} className="group relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-1 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`absolute inset-0 bg-gradient-to-r ${
                      request.urgency === 'Critical' ? 'from-red-500 to-pink-500' : 
                      request.urgency === 'High' ? 'from-orange-500 to-yellow-500' : 
                      'from-yellow-400 to-orange-400'
                    } opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                    
                    <CardContent className="p-4 relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                            request.urgency === 'Critical' ? 'bg-gradient-to-br from-red-500 to-red-600' : 
                            request.urgency === 'High' ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 
                            'bg-gradient-to-br from-yellow-500 to-yellow-600'
                          }`}>
                            <Droplet className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{request.bloodGroup}</h3>
                            <p className="text-xs text-gray-600 font-medium">{request.hospital || request.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={`${
                            request.urgency === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' : 
                            request.urgency === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                          } text-xs font-bold px-2 py-1 rounded-full shadow-sm`}>
                            {request.urgency}
                          </Badge>
                          {['AB-', 'B-', 'O-', 'A-'].includes(request.bloodGroup) && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                              Rare
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                            <MapPin className="w-3 h-3" />
                          </div>
                          <div className="text-xs font-medium text-gray-700 truncate">{request.location}</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                            <Droplet className="w-3 h-3" />
                          </div>
                          <div className="text-xs font-medium text-gray-700">{request.units} units</div>
                        </div>
                        {request.contact && (
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                              <User className="w-3 h-3" />
                            </div>
                            <div className="text-xs font-medium text-gray-700 truncate">{request.contact}</div>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => handleContact(request)}
                        className={`w-full py-2 text-white font-semibold transition-all duration-200 transform hover:scale-105 ${
                          request.urgency === 'Critical' ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-200' : 
                          request.urgency === 'High' ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-orange-200' : 
                          'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 shadow-yellow-200'
                        } shadow-lg hover:shadow-xl`}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Now
                      </Button>
                    </CardContent>
                  </div>
                ))}
              </div>
            )}

            {/* Mock Blood Requests */}

            {/* Mock Blood Requests */}
            {requirementPosts.length === 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Critical Blood Needs</h2>
                <div className="space-y-4">
                  {sortedBloodRequests.map((request) => {
                    const isRareBlood = ['AB-', 'B-', 'O-', 'A-'].includes(request.bloodGroup);

                return (
                  <div key={request.id} className="group relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-1 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`absolute inset-0 bg-gradient-to-r ${
                      request.urgency === 'Critical' ? 'from-red-500 to-pink-500' : 
                      request.urgency === 'High' ? 'from-orange-500 to-yellow-500' : 
                      'from-yellow-400 to-orange-400'
                    } opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                    
                    <CardContent className="p-4 relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                            request.urgency === 'Critical' ? 'bg-gradient-to-br from-red-500 to-red-600' : 
                            request.urgency === 'High' ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 
                            'bg-gradient-to-br from-yellow-500 to-yellow-600'
                          }`}>
                            <Droplet className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{request.bloodGroup}</h3>
                            <p className="text-xs text-gray-600 font-medium">{request.hospital}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={`${
                            request.urgency === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' : 
                            request.urgency === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                          } text-xs font-bold px-2 py-1 rounded-full shadow-sm`}>
                            {request.urgency}
                          </Badge>
                          {isRareBlood && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                              Rare
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                            <MapPin className="w-3 h-3" />
                          </div>
                          <div className="text-xs font-medium text-gray-700 truncate">{request.location}</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                            <Droplet className="w-3 h-3" />
                          </div>
                          <div className="text-xs font-medium text-gray-700">{request.unitsNeeded} units</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                            <Phone className="w-3 h-3" />
                          </div>
                          <div className="text-xs font-medium text-gray-700">{request.distance}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleContact(request)}
                          className={`flex-1 py-2 text-white font-semibold transition-all duration-200 transform hover:scale-105 ${
                            request.urgency === 'Critical' ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-200' : 
                            request.urgency === 'High' ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-orange-200' : 
                            'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 shadow-yellow-200'
                          } shadow-lg hover:shadow-xl`}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Now
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-semibold"
                        >
                          <Info className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                );
              })}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Blood Camps */}
          <TabsContent value="camps" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Blood Donation Camps</h2>

            {/* CSV Camp Posts */}
            {campPosts.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Camps upcoming...</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCampSortOrder(campSortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Date {campSortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4 min-w-max md:grid md:grid-cols-3 md:min-w-0">
                    {sortedCampPosts.map((camp) => (
                      <div key={camp.id} className="min-w-[320px] md:min-w-0 group relative bg-white border border-blue-200 rounded-3xl p-1 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 mb-6 text-white shadow-lg relative overflow-hidden group-hover:shadow-blue-200 transition-shadow">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl" />
                            <div className="relative z-10 flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2 mb-2 opacity-90">
                                  <Calendar className="w-5 h-5" />
                                  <span className="text-sm font-semibold uppercase tracking-wider">CAMP</span>
                                </div>
                                <div className="text-3xl font-black tracking-tight">
                                  {new Date(camp.date).toLocaleDateString('en-US', { day: 'numeric' })}
                                </div>
                                <div className="text-xl font-medium opacity-90">
                                  {new Date(camp.date).toLocaleDateString('en-US', { month: 'long' })}
                                </div>
                              </div>
                              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <Droplet className="w-8 h-8 text-white" fill="currentColor" />
                              </div>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1 group-hover:text-blue-600 transition-colors">{camp.title}</h3>

                          <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <User className="w-5 h-5 text-gray-400 mt-0.5" />
                              <div>
                                <div className="text-xs text-gray-500 font-semibold uppercase">Organizer</div>
                                <div className="text-sm font-medium text-gray-900">{camp.organizer}</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                              <div>
                                <div className="text-xs text-gray-500 font-semibold uppercase">Location</div>
                                <div className="text-sm font-medium text-gray-900">{camp.location}</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                              <div>
                                <div className="text-xs text-gray-500 font-semibold uppercase">Time</div>
                                <div className="text-sm font-medium text-gray-900">{camp.time}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mock Blood Camps */}
            {campPosts.length === 0 && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Upcoming Blood Donation Camps</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCampSortOrder(campSortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Date {campSortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>

            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max md:grid md:grid-cols-3 md:min-w-0">
                {sortedBloodCamps.map((camp) => (
                  <div key={camp.id} className="min-w-[320px] md:min-w-0 group relative bg-white border border-gray-100 rounded-3xl p-1 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 mb-6 text-white shadow-lg relative overflow-hidden group-hover:shadow-red-200 transition-shadow">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl" />
                        <div className="relative z-10 flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2 opacity-90">
                              <Calendar className="w-5 h-5" />
                              <span className="text-sm font-semibold uppercase tracking-wider">Upcoming Camp</span>
                            </div>
                            <div className="text-3xl font-black tracking-tight">
                              {new Date(camp.date).toLocaleDateString('en-US', { day: 'numeric' })}
                            </div>
                            <div className="text-xl font-medium opacity-90">
                              {new Date(camp.date).toLocaleDateString('en-US', { month: 'long' })}
                            </div>
                          </div>
                          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            <Droplet className="w-8 h-8 text-white" fill="currentColor" />
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1 group-hover:text-red-600 transition-colors">{camp.name}</h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <User className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <div className="text-xs text-gray-500 font-semibold uppercase">Organizer</div>
                            <div className="text-sm font-medium text-gray-900">{camp.organizer}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <div className="text-xs text-gray-500 font-semibold uppercase">Location</div>
                            <div className="text-sm font-medium text-gray-900">{camp.location}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <div className="text-xs text-gray-500 font-semibold uppercase">Time</div>
                            <div className="text-sm font-medium text-gray-900">{camp.time}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleJoinCamp(camp)}
                          className="flex-1 bg-gray-900 text-white hover:bg-red-600 rounded-xl py-6 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Join Camp
                        </Button>
                        <Button
                          onClick={() => handleReminder(camp)}
                          variant="outline"
                          size="icon"
                          className="w-12 h-auto rounded-xl border-2 border-gray-100 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                        >
                          <Calendar className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                ))}
              </div>
            </div>
              </>
            )}
          </TabsContent>

          {/* Guidelines */}
          <TabsContent value="guidelines" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Eligibility */}
              <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6">
                  <div className="flex items-center gap-3 text-white mb-1">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Eligibility</h3>
                  </div>
                  <p className="text-emerald-50 text-sm opacity-90 pl-14">Who can donate?</p>
                </div>
                <CardContent className="p-6 space-y-4">
                  {[
                    "Age: 18-65 years",
                    "Weight: Minimum 50kg",
                    "Hemoglobin: >12.5 g/dL",
                    "Must be healthy and fit",
                    "90 days gap from last donation"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 group/item">
                      <div className="mt-1 w-2 h-2 rounded-full bg-emerald-400 group-hover/item:bg-emerald-600 transition-colors" />
                      <span className="text-gray-600 font-medium">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Do's */}
              <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
                  <div className="flex items-center gap-3 text-white mb-1">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Do's</h3>
                  </div>
                  <p className="text-blue-50 text-sm opacity-90 pl-14">Before donation</p>
                </div>
                <CardContent className="p-6 space-y-4">
                  {[
                    "Drink plenty of water before",
                    "Eat a healthy meal 2-3 hours prior",
                    "Get adequate sleep",
                    "Bring valid ID proof",
                    "Rest for 10-15 min after donation"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 group/item">
                      <div className="mt-1 w-2 h-2 rounded-full bg-blue-400 group-hover/item:bg-blue-600 transition-colors" />
                      <span className="text-gray-600 font-medium">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Don'ts */}
              <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                <div className="bg-gradient-to-br from-red-500 to-pink-600 p-6">
                  <div className="flex items-center gap-3 text-white mb-1">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <X className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Don'ts</h3>
                  </div>
                  <p className="text-red-50 text-sm opacity-90 pl-14">Avoid these</p>
                </div>
                <CardContent className="p-6 space-y-4">
                  {[
                    "Don't donate on empty stomach",
                    "Avoid alcohol 24 hours before",
                    "Don't smoke 2 hours before/after",
                    "Avoid strenuous activity after",
                    "Don't donate if you have cold/fever"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 group/item">
                      <div className="mt-1 w-2 h-2 rounded-full bg-red-400 group-hover/item:bg-red-600 transition-colors" />
                      <span className="text-gray-600 font-medium">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recovery Tips */}
            <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="p-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-20" />
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Recovery Tips & After Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    "Drink extra fluids for 24-48 hours after donation",
                    "Eat iron-rich foods to replenish iron stores",
                    "Keep bandage on for 4-5 hours",
                    "If you feel dizzy, lie down and elevate feet"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/50 p-4 rounded-xl border border-purple-100 hover:bg-white hover:border-purple-200 transition-all duration-300">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Info className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Donor Registration Dialog */}
        <Dialog open={showDonorForm} onOpenChange={setShowDonorForm}>
          <DialogContent className="max-w-xl p-0 overflow-hidden border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-2xl" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm mb-4 shadow-inner ring-4 ring-white/10">
                  <User className="w-10 h-10 text-white" />
                </div>
                <DialogTitle className="text-2xl font-bold">Update Donor Profile</DialogTitle>
                <DialogDescription className="text-red-100 mt-1">
                  Keep your life-saving information up to date
                </DialogDescription>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-semibold">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="name" defaultValue={currentUser.name} className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700 font-semibold">Age</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="age" type="number" placeholder="Enter age" className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroupUpdate" className="text-gray-700 font-semibold">Blood Group</Label>
                  <Select defaultValue={currentUser.bloodGroup}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-all duration-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-semibold">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="phone" defaultValue={currentUser.phone} className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-700 font-semibold">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="city" defaultValue={currentUser.city} className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-300" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 h-4 w-4 text-gray-400 flex items-center justify-center">@</div>
                  <Input id="email" type="email" defaultValue={currentUser.email} className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-300" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastDonation" className="text-gray-700 font-semibold">Last Donation Date</Label>
                <div className="relative">
                  <Input id="lastDonation" type="date" defaultValue={currentUser.lastDonation} className="bg-gray-50 border-gray-200 focus:bg-white transition-all duration-300" />
                </div>
              </div>

              <Button
                onClick={() => {
                  toast.success('Donor profile updated successfully!');
                  setShowDonorForm(false);
                }}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-6 text-lg shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-300 mt-2"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
