import { useState } from 'react';
import { Droplet, MapPin, Phone, Calendar, Info, CheckCircle, X, Clock, User } from 'lucide-react';
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

export function BloodPage() {
  const [isAvailable, setIsAvailable] = useState(currentUser.available);
  const [showDonorForm, setShowDonorForm] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyColors: Record<string, string> = {
    Critical: 'from-red-600 to-red-700 shadow-red-200',
    High: 'from-orange-500 to-orange-600 shadow-orange-200',
    Medium: 'from-yellow-500 to-yellow-600 shadow-yellow-200'
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Profile Stats */}
        <Card className="mb-6 bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <Droplet className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Blood Donation</h1>
                  <p className="text-white/90">Save lives by donating blood or finding donors</p>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-white/80 mb-1">Total Donations</div>
                  <div className="text-2xl font-bold">{currentUser.totalDonations}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-white/80 mb-1">Blood Group</div>
                  <div className="text-2xl font-bold">{currentUser.bloodGroup}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-white/80 mb-1">Available</div>
                  <div className="text-2xl font-bold">{isAvailable ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          </CardContent>
          </Card>

        {/* Availability Toggle */}
        <Card className="mb-6 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Donation Availability</h3>
                <p className="text-sm text-gray-600">Mark yourself as available for blood donation</p>
              </div>
              <Switch
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
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
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Critical Blood Needs</h2>
            </div>

            <div className="space-y-4">
              {bloodRequests.map((request) => {
                const isRareBlood = ['AB-', 'B-', 'O-', 'A-'].includes(request.bloodGroup);

                return (
                  <div key={request.id} className="group relative bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-1 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-r ${urgencyColors[request.urgency]} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />

                    <CardContent className="p-6 relative z-10">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-6">
                            <div className={`bg-gradient-to-br ${urgencyColors[request.urgency]} p-4 rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-300`}>
                              <Droplet className="w-8 h-8 text-white" fill="white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">{request.hospital}</h3>
                                  <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1 bg-white/50 w-fit px-2 py-1 rounded-full">
                                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                                    {request.location}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                  <Badge className={`bg-gradient-to-r ${urgencyColors[request.urgency]} border-0 text-white shadow-md`}>
                                    {request.urgency} Priority
                                  </Badge>
                                  {isRareBlood && (
                                    <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 border-0 text-white shadow-md">
                                      Rare Blood
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Droplet className="w-4 h-4" />
                                  <span>{request.unitsNeeded} units needed</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="w-4 h-4" />
                                    <span>Contact: {request.contactName}</span>
                                  </div>
                                  {request.datePosted && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Calendar className="w-4 h-4" />
                                      <span>Posted: {new Date(request.datePosted).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-3">
                                <Button
                                  onClick={() => handleContact(request)}
                                  className={`flex-1 bg-gradient-to-r ${urgencyColors[request.urgency]} border-0 text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95`}
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  Contact Now
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-semibold"
                                >
                                  <Info className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Blood Camps */}
          <TabsContent value="camps" className="space-y-4">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Blood Donation Camps</h2>
            </div>

            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max md:grid md:grid-cols-3 md:min-w-0">
                {bloodCamps.map((camp) => (
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
                    "No recent infections or illnesses"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Preparation */}
              <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
                  <div className="flex items-center gap-3 text-white mb-1">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <Droplet className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Preparation</h3>
                  </div>
                  <p className="text-blue-50 text-sm opacity-90 pl-14">Before donation</p>
                </div>
                <CardContent className="p-6 space-y-4">
                  {[
                    "Drink plenty of water",
                    "Eat a healthy meal",
                    "Avoid alcohol 24 hours before",
                    "Get good sleep",
                    "Bring valid ID proof"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <Droplet className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* After Care */}
              <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6">
                  <div className="flex items-center gap-3 text-white mb-1">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">After Care</h3>
                  </div>
                  <p className="text-purple-50 text-sm opacity-90 pl-14">Post donation care</p>
                </div>
                <CardContent className="p-6 space-y-4">
                  {[
                    "Rest for 10-15 minutes",
                    "Drink extra fluids",
                    "Avoid strenuous activities",
                    "Keep bandage dry for 4-6 hours",
                    "Eat iron-rich foods"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                      <Heart className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
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
                <h2 className="text-2xl font-bold mb-2">Update Donor Profile</h2>
                <p className="text-white/90">Keep your information current for faster donations</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-semibold">Full Name</Label>
                  <Input id="name" defaultValue={currentUser.name} className="bg-gray-50 border-gray-200 focus:bg-white transition-all duration-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup" className="text-gray-700 font-semibold">Blood Group</Label>
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

// Heart icon component for after care section
function Heart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}
