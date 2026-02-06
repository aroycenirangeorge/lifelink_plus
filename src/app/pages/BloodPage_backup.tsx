import { useState } from 'react';
import { 
  Droplet, 
  MapPin, 
  Phone, 
  Calendar, 
  Info, 
  CheckCircle, 
  Clock, 
  User,
  Heart,
  Users,
  Search,
  Bell,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent } from '@/app/components/ui/dialog';
import { currentUser, bloodRequests, bloodCamps } from '@/data/mockData';
import { toast } from 'sonner';

interface BloodPageProps {
  onNavigate?: (page: string) => void;
}

export function BloodPage({ onNavigate }: BloodPageProps) {
  const [isAvailable, setIsAvailable] = useState(currentUser.available);
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('all');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const urgencyColors: Record<string, { bg: string; text: string; border: string }> = {
    Critical: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' },
    High: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
    Medium: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/20' }
  };

  const stats = [
    {
      title: "Total Donations",
      value: currentUser.totalDonations,
      icon: Droplet,
      color: "gradient-brand",
      change: "+2 this month",
    },
    {
      title: "Lives Saved",
      value: "47",
      icon: Heart,
      color: "gradient-brand",
      change: "+5 this month",
    },
    {
      title: "Next Eligible",
      value: "12 days",
      icon: Calendar,
      color: "gradient-brand",
      change: "Track progress",
    },
    {
      title: "Blood Group",
      value: currentUser.bloodGroup,
      icon: Users,
      color: "gradient-brand",
      change: currentUser.bloodGroup === 'O-' ? "Universal donor" : "Regular donor",
    },
  ];

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

  const filteredRequests = bloodRequests.filter(request => {
    const matchesSearch = request.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = selectedUrgency === 'all' || request.urgency === selectedUrgency;
    return matchesSearch && matchesUrgency;
  });

  // Sort blood requests by urgency (Critical to Low)
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const urgencyOrder = { 'Critical': 3, 'High': 2, 'Medium': 1 };
    return urgencyOrder[b.urgency as keyof typeof urgencyOrder] - urgencyOrder[a.urgency as keyof typeof urgencyOrder];
  });

  // Sort blood camps by date
  const sortedCamps = [...bloodCamps].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB; // Ascending (soonest first)
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8 slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Blood Donation Center</h1>
              <p className="text-lg text-text-secondary">Save lives by donating blood or finding donors</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowDonorForm(true)}
                className="gradient-brand text-white shadow-brand-sm hover:shadow-brand-md transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
              <Button variant="outline" className="border-border-subtle hover:bg-surface transition-all duration-200">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
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
                    <div className="text-xs text-text-quaternary text-right">
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

        {/* Availability Card */}
        <Card className="card-elevated mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isAvailable ? 'bg-success/10' : 'bg-neutral-100'
                }`}>
                  <Droplet className={`w-6 h-6 ${isAvailable ? 'text-success' : 'text-text-tertiary'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Donation Availability</h3>
                  <p className="text-sm text-text-secondary">
                    {isAvailable ? 'You are marked as available for donations' : 'Mark yourself as available to help save lives'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Switch
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                />
                <span className={`text-sm font-medium ${
                  isAvailable ? 'text-success' : 'text-text-tertiary'
                }`}>
                  {isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-quaternary" />
            <Input
              placeholder="Search by hospital, location, or blood group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-border-subtle"
            />
          </div>
          <Select value={selectedUrgency} onValueChange={(value: any) => setSelectedUrgency(value)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgencies</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-effect p-1 rounded-xl border border-border-subtle">
            <TabsTrigger 
              value="requests" 
              className="rounded-lg px-4 py-2 data-[state=active]:bg-surface data-[state=active]:shadow-sm transition-all duration-200"
            >
              Urgent Requests
            </TabsTrigger>
            <TabsTrigger 
              value="camps" 
              className="rounded-lg px-4 py-2 data-[state=active]:bg-surface data-[state=active]:shadow-sm transition-all duration-200"
            >
              Blood Camps
            </TabsTrigger>
            <TabsTrigger 
              value="guidelines" 
              className="rounded-lg px-4 py-2 data-[state=active]:bg-surface data-[state=active]:shadow-sm transition-all duration-200"
            >
              Guidelines
            </TabsTrigger>
          </TabsList>

          {/* Urgent Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedRequests.map((request) => {
                const urgencyColor = urgencyColors[request.urgency];
                const isRareBlood = ['AB-', 'B-', 'O-', 'A-'].includes(request.bloodGroup);

                return (
                  <Card key={request.id} className="card-elevated group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl ${urgencyColor.bg} flex items-center justify-center`}>
                            <Droplet className={`w-6 h-6 ${urgencyColor.text}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-text-primary group-hover:text-brand-600 transition-colors">
                              {request.hospital}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
                              <MapPin className="w-3 h-3" />
                              {request.location}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 items-end">
                          <Badge className={`${urgencyColor.bg} ${urgencyColor.text} ${urgencyColor.border} border`}>
                            {request.urgency}
                          </Badge>
                          {isRareBlood && (
                            <Badge className="bg-brand-100 text-brand-700 border-brand-200">
                              Rare Blood
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">Blood Group</span>
                          <span className="font-semibold text-text-primary">{request.bloodGroup}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">Units Needed</span>
                          <span className="font-semibold text-text-primary">{request.unitsNeeded}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">Contact</span>
                          <span className="font-medium text-text-primary">{request.contactName}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleContact(request)}
                          className="flex-1 gradient-brand text-white shadow-brand-sm hover:shadow-brand-md transition-all duration-200"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Info className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Blood Camps Tab */}
          <TabsContent value="camps" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCamps.map((camp) => (
                <Card key={camp.id} className="card-elevated group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shadow-brand-sm">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-brand-100 text-brand-700 border-brand-200">
                          Upcoming
                        </Badge>
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-text-primary">
                          {new Date(camp.date).toLocaleDateString('en-US', { day: 'numeric' })}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {new Date(camp.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold text-text-primary mb-3 group-hover:text-brand-600 transition-colors">
                      {camp.name}
                    </h3>

                    <div className="space-y-2 text-sm text-text-secondary mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{camp.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{camp.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{camp.time}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleJoinCamp(camp)}
                        className="flex-1"
                        variant="outline"
                      >
                        Join Camp
                      </Button>
                      <Button
                        onClick={() => handleReminder(camp)}
                        variant="outline"
                        size="sm"
                      >
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Guidelines Tab */}
          <TabsContent value="guidelines" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Eligibility Card */}
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <CardTitle className="text-lg">Eligibility</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Age: 18-65 years",
                      "Weight: Minimum 50kg",
                      "Hemoglobin: >12.5 g/dL",
                      "Must be healthy and fit",
                      "No recent infections"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-success/5">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-sm text-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Preparation Card */}
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                      <Droplet className="w-5 h-5 text-info" />
                    </div>
                    <CardTitle className="text-lg">Preparation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Drink plenty of water",
                      "Eat a healthy meal",
                      "Avoid alcohol 24h before",
                      "Get good sleep",
                      "Bring valid ID proof"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-info/5">
                        <Droplet className="w-4 h-4 text-info flex-shrink-0" />
                        <span className="text-sm text-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* After Care Card */}
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-warning" />
                    </div>
                    <CardTitle className="text-lg">After Care</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Rest for 10-15 minutes",
                      "Drink extra fluids",
                      "Avoid strenuous activities",
                      "Keep bandage dry 4-6h",
                      "Eat iron-rich foods"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-warning/5">
                        <Heart className="w-4 h-4 text-warning flex-shrink-0" />
                        <span className="text-sm text-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Donor Registration Dialog */}
        <Dialog open={showDonorForm} onOpenChange={setShowDonorForm}>
          <DialogContent className="max-w-xl p-0 overflow-hidden border-0 shadow-2xl bg-surface">
            <div className="gradient-brand p-6 text-white text-center relative overflow-hidden">
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
                  <Label htmlFor="name" className="text-text-primary font-medium">Full Name</Label>
                  <Input id="name" defaultValue={currentUser.name} className="bg-surface border-border-subtle" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup" className="text-text-primary font-medium">Blood Group</Label>
                  <Select defaultValue={currentUser.bloodGroup}>
                    <SelectTrigger className="bg-surface border-border-subtle">
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
                  <Label htmlFor="phone" className="text-text-primary font-medium">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-text-quaternary" />
                    <Input id="phone" defaultValue={currentUser.phone} className="pl-10 bg-surface border-border-subtle" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-text-primary font-medium">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-quaternary" />
                    <Input id="city" defaultValue={currentUser.city} className="pl-10 bg-surface border-border-subtle" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-text-primary font-medium">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 h-4 w-4 text-text-quaternary flex items-center justify-center">@</div>
                  <Input id="email" type="email" defaultValue={currentUser.email} className="pl-10 bg-surface border-border-subtle" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastDonation" className="text-text-primary font-medium">Last Donation Date</Label>
                <div className="relative">
                  <Input id="lastDonation" type="date" defaultValue={currentUser.lastDonation} className="bg-surface border-border-subtle" />
                </div>
              </div>

              <Button
                onClick={() => {
                  toast.success('Donor profile updated successfully!');
                  setShowDonorForm(false);
                }}
                className="w-full gradient-brand text-white shadow-brand-sm hover:shadow-brand-md transition-all duration-200 mt-2"
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