import { useState } from 'react';
import { AlertTriangle, MapPin, Calendar, Users, DollarSign, Droplet, UtensilsCrossed, Home, Heart, Package, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { disasters } from '@/data/mockData';
import { toast } from 'sonner';

interface DisasterPageProps {
  onNavigate: (page: string) => void;
}

export function DisasterPage({ onNavigate }: DisasterPageProps) {
  const [crisisMode, setCrisisMode] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState<typeof disasters[0] | null>(null);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [helpType, setHelpType] = useState<'funds' | 'supplies' | 'volunteer' | 'sponsor'>('funds');

  const disasterTypes = ['All', 'Flood', 'Earthquake', 'Fire', 'Cyclone', 'Landslide'];
  const [selectedType, setSelectedType] = useState('All');

  const filteredDisasters = selectedType === 'All' 
    ? disasters 
    : disasters.filter(d => d.type === selectedType);

  const criticalDisasters = disasters.filter(d => d.severity === 'Critical');

  const handleQuickHelp = (disaster: typeof disasters[0], type: string) => {
    setSelectedDisaster(disaster);
    setHelpType(type as any);
    setShowHelpDialog(true);
  };

  const handleSubmitHelp = () => {
    toast.success('Thank you for your support! 🙏', {
      description: `Your ${helpType} contribution for ${selectedDisaster?.location} has been registered.`
    });
    setShowHelpDialog(false);
  };

  const needIcons = {
    blood: Droplet,
    food: UtensilsCrossed,
    shelter: Home,
    volunteers: Users,
    funds: DollarSign
  };

  return (
    <div className={`min-h-screen transition-colors ${crisisMode ? 'bg-gradient-to-br from-red-900 via-red-800 to-orange-900' : 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className={`mb-6 border-0 shadow-xl ${crisisMode ? 'bg-red-700 text-white' : 'bg-gradient-to-r from-orange-500 to-red-600 text-white'}`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Disaster Relief</h1>
                  <p className="text-white/90">Immediate help for communities in need</p>
                </div>
              </div>
              <Button
                onClick={() => setCrisisMode(!crisisMode)}
                className={`${crisisMode ? 'bg-white text-red-700 hover:bg-gray-100' : 'bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30'}`}
              >
                {crisisMode ? '✓ Crisis Mode Active' : 'Enter Crisis Mode'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Mode Alert */}
        {crisisMode && (
          <Card className="mb-6 bg-red-600 text-white border-4 border-yellow-400 animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-12 h-12 text-yellow-300" fill="currentColor" />
                <div>
                  <h2 className="text-2xl font-bold mb-1">CRISIS MODE ACTIVE</h2>
                  <p className="text-white/90">Showing only critical and high priority needs. Every second counts!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disaster Type Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {disasterTypes.map((type) => (
              <Button
                key={type}
                onClick={() => setSelectedType(type)}
                variant={selectedType === type ? 'default' : 'outline'}
                className={selectedType === type ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' : 'border-gray-300 hover:bg-orange-50'}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Critical Needs Board */}
        {criticalDisasters.length > 0 && (
          <Card className={`mb-6 ${crisisMode ? 'bg-red-800 border-4 border-yellow-400' : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${crisisMode ? 'text-white' : 'text-red-700'}`}>
                <AlertTriangle className="w-6 h-6" fill="currentColor" />
                Critical Needs - Immediate Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {criticalDisasters.map((disaster) => {
                  const activeNeeds = Object.entries(disaster.needs).filter(([_, active]) => active);
                  
                  return (
                    <Card key={disaster.id} className={`${crisisMode ? 'bg-red-700 text-white border-2 border-yellow-300' : 'bg-white'} hover:shadow-xl transition-shadow`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className={`text-lg font-bold ${crisisMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                              {disaster.type} Emergency
                            </h3>
                            <p className={`text-sm ${crisisMode ? 'text-white/90' : 'text-gray-600'} flex items-center gap-1`}>
                              <MapPin className="w-3 h-3" />
                              {disaster.location}
                            </p>
                          </div>
                          <Badge className="bg-red-600 text-white animate-pulse">
                            CRITICAL
                          </Badge>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-3">
                          <p className={`text-sm ${crisisMode ? 'text-white/90' : 'text-gray-700'}`}>
                            {disaster.affectedFamilies} families affected
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {activeNeeds.map(([need, _]) => {
                            const Icon = needIcons[need as keyof typeof needIcons];
                            return (
                              <Badge key={need} className={`${crisisMode ? 'bg-yellow-400 text-red-900' : 'bg-red-100 text-red-700'} border-0`}>
                                <Icon className="w-3 h-3 mr-1" />
                                {need.charAt(0).toUpperCase() + need.slice(1)}
                              </Badge>
                            );
                          })}
                        </div>

                        <Button
                          onClick={() => handleQuickHelp(disaster, 'funds')}
                          className={`w-full ${crisisMode ? 'bg-yellow-400 text-red-900 hover:bg-yellow-300' : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:opacity-90'}`}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Help Now
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Disasters */}
        <div className="space-y-4">
          <h2 className={`text-2xl font-bold ${crisisMode ? 'text-white' : 'text-gray-900'}`}>
            {crisisMode ? 'High Priority Relief Efforts' : 'Active Disaster Relief Efforts'}
          </h2>

          {filteredDisasters.map((disaster) => {
            const severityColors = {
              Critical: 'from-red-600 to-red-700',
              High: 'from-orange-500 to-orange-600',
              Medium: 'from-yellow-500 to-yellow-600'
            };

            const activeNeeds = Object.entries(disaster.needs).filter(([_, active]) => active);

            return (
              <Card key={disaster.id} className={`${crisisMode ? 'bg-red-800/50 backdrop-blur-sm border-2 border-red-600' : 'bg-white'} hover:shadow-xl transition-shadow`}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Disaster Info */}
                    <div className="lg:w-1/3">
                      <div className={`bg-gradient-to-br ${severityColors[disaster.severity]} rounded-xl p-4 text-white mb-4`}>
                        <AlertTriangle className="w-8 h-8 mb-2" />
                        <div className="text-2xl font-bold mb-1">{disaster.type}</div>
                        <div className="text-sm opacity-90">{disaster.severity} Severity</div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className={`text-sm ${crisisMode ? 'text-white/70' : 'text-gray-600'} mb-1`}>Location</p>
                          <p className={`font-semibold ${crisisMode ? 'text-white' : 'text-gray-900'} flex items-center gap-1`}>
                            <MapPin className="w-4 h-4" />
                            {disaster.location}
                          </p>
                        </div>

                        <div>
                          <p className={`text-sm ${crisisMode ? 'text-white/70' : 'text-gray-600'} mb-1`}>Date</p>
                          <p className={`font-semibold ${crisisMode ? 'text-white' : 'text-gray-900'} flex items-center gap-1`}>
                            <Calendar className="w-4 h-4" />
                            {new Date(disaster.date).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <p className={`text-sm ${crisisMode ? 'text-white/70' : 'text-gray-600'} mb-1`}>Families Affected</p>
                          <p className={`font-semibold ${crisisMode ? 'text-white' : 'text-gray-900'} flex items-center gap-1`}>
                            <Users className="w-4 h-4" />
                            {disaster.affectedFamilies}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Urgent Needs & Actions */}
                    <div className="lg:w-2/3 space-y-4">
                      <div>
                        <h3 className={`text-lg font-bold ${crisisMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                          Description
                        </h3>
                        <p className={`${crisisMode ? 'text-white/90' : 'text-gray-700'} leading-relaxed`}>
                          {disaster.description}
                        </p>
                      </div>

                      <div>
                        <h3 className={`text-lg font-bold ${crisisMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                          Urgent Needs
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {activeNeeds.map(([need, _]) => {
                            const Icon = needIcons[need as keyof typeof needIcons];
                            const needLabels = {
                              blood: 'Blood Donations',
                              food: 'Food & Water',
                              shelter: 'Shelter Materials',
                              volunteers: 'Volunteers',
                              funds: 'Financial Aid'
                            };

                            return (
                              <Card key={need} className={`${crisisMode ? 'bg-red-700/50 border-red-500' : 'bg-gradient-to-br from-gray-50 to-gray-100'} hover:shadow-md transition-shadow cursor-pointer`}>
                                <CardContent className="p-4 text-center">
                                  <div className={`${crisisMode ? 'bg-yellow-400' : 'bg-gradient-to-br from-orange-500 to-red-600'} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                                    <Icon className={`w-6 h-6 ${crisisMode ? 'text-red-900' : 'text-white'}`} />
                                  </div>
                                  <p className={`text-sm font-semibold ${crisisMode ? 'text-white' : 'text-gray-900'}`}>
                                    {needLabels[need as keyof typeof needLabels]}
                                  </p>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <Button
                          onClick={() => handleQuickHelp(disaster, 'funds')}
                          className={`${crisisMode ? 'bg-yellow-400 text-red-900 hover:bg-yellow-300' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90'}`}
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Donate Funds
                        </Button>
                        <Button
                          onClick={() => handleQuickHelp(disaster, 'supplies')}
                          variant={crisisMode ? 'outline' : 'outline'}
                          className={crisisMode ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-400/10' : 'border-orange-500 text-orange-700 hover:bg-orange-50'}
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Donate Supplies
                        </Button>
                        <Button
                          onClick={() => handleQuickHelp(disaster, 'volunteer')}
                          variant={crisisMode ? 'outline' : 'outline'}
                          className={crisisMode ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-400/10' : 'border-blue-500 text-blue-700 hover:bg-blue-50'}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Volunteer
                        </Button>
                        <Button
                          onClick={() => handleQuickHelp(disaster, 'sponsor')}
                          variant={crisisMode ? 'outline' : 'outline'}
                          className={crisisMode ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-400/10' : 'border-purple-500 text-purple-700 hover:bg-purple-50'}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Sponsor Family
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Dialog */}
        <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {helpType === 'funds' && 'Donate Funds'}
                {helpType === 'supplies' && 'Donate Supplies'}
                {helpType === 'volunteer' && 'Register as Volunteer'}
                {helpType === 'sponsor' && 'Sponsor a Family'}
              </DialogTitle>
              <DialogDescription>
                {selectedDisaster?.type} Relief - {selectedDisaster?.location}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-700">
                    <AlertTriangle className="w-4 h-4 inline mr-1 text-orange-600" />
                    {selectedDisaster?.affectedFamilies} families urgently need your support
                  </p>
                </CardContent>
              </Card>

              {helpType === 'funds' && (
                <>
                  <div>
                    <Label htmlFor="amount">Donation Amount</Label>
                    <Input id="amount" type="number" placeholder="Enter amount in ₹" />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 2000, 5000].map((amt) => (
                      <Button key={amt} variant="outline" size="sm">₹{amt}</Button>
                    ))}
                  </div>
                </>
              )}

              {helpType === 'supplies' && (
                <>
                  <div>
                    <Label htmlFor="supplyType">Supply Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food & Water</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="medicine">Medicine</SelectItem>
                        <SelectItem value="blankets">Blankets & Bedding</SelectItem>
                        <SelectItem value="shelter">Shelter Materials</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity/Description</Label>
                    <Input id="quantity" placeholder="e.g., 50 blankets" />
                  </div>
                </>
              )}

              {helpType === 'volunteer' && (
                <>
                  <div>
                    <Label htmlFor="skills">Your Skills</Label>
                    <Input id="skills" placeholder="e.g., Medical, Construction, Teaching" />
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediately Available</SelectItem>
                        <SelectItem value="weekend">Weekends Only</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {helpType === 'sponsor' && (
                <>
                  <div>
                    <Label htmlFor="duration">Sponsorship Duration</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">1 Month</SelectItem>
                        <SelectItem value="3months">3 Months</SelectItem>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sponsorAmount">Monthly Amount</Label>
                    <Input id="sponsorAmount" type="number" placeholder="Enter monthly support amount" />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="contact">Contact Number</Label>
                <Input id="contact" placeholder="Your phone number" />
              </div>

              <Button
                onClick={handleSubmitHelp}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90 py-6 text-lg"
              >
                <Heart className="w-5 h-5 mr-2" fill="white" />
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
