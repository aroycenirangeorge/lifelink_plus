import { useState } from 'react';
import { DollarSign, Heart, CheckCircle, Users, MapPin, ArrowLeft, Target, Award } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';

import { currentUser, ngos, Campaign } from '@/data/mockData';
import { toast } from 'sonner';

interface DonationsPageProps {
  onNavigate: (page: string) => void;
}

export function DonationsPage({ onNavigate }: DonationsPageProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleDonate = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    toast.success('Donation successful! 🎉', {
      description: `Thank you for donating ₹${donationAmount} to ${selectedCampaign?.title || 'this cause'}`
    });
    setShowDonationDialog(false);
    setDonationAmount('');
  };

  const openDonationDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowDonationDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Profile Stats */}
        <Card className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <DollarSign className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Monetary Donations</h1>
                  <p className="text-white/90">Support verified causes and make lasting impact</p>
                </div>
              </div>
            </div>

            {/* Horizontal Profile + Donation Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-white/80 mb-1">Total Donated</div>
                <div className="text-2xl font-bold">₹{currentUser.totalMoneyDonated.toLocaleString()}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-white/80 mb-1">Causes Supported</div>
                <div className="text-2xl font-bold">{currentUser.causesSupported}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-white/80 mb-1">Monthly Streak</div>
                <div className="text-2xl font-bold">6 months</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-white/80 mb-1">Impact Badges</div>
                <div className="text-2xl font-bold">{currentUser.badges.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedCampaign ? (
          /* Campaign Detail View */
          <div className="space-y-6">
            <Button
              onClick={() => setSelectedCampaign(null)}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Campaigns
            </Button>

            <Card className="bg-white shadow-xl">
              <CardContent className="p-0">
                {/* Campaign Image */}
                {selectedCampaign.image && (
                  <div className="h-80 overflow-hidden rounded-t-xl">
                    <img
                      src={selectedCampaign.image}
                      alt={selectedCampaign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 space-y-6">
                  {/* Campaign Header */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedCampaign.title}</h2>
                        <p className="text-gray-600">
                          by {ngos.find(n => n.id === selectedCampaign.ngoId)?.name}
                        </p>
                      </div>
                      <Badge className={`
                        ${selectedCampaign.urgency === 'Critical' ? 'bg-red-600' : selectedCampaign.urgency === 'High' ? 'bg-orange-500' : 'bg-yellow-500'}
                        text-white
                      `}>
                        {selectedCampaign.urgency}
                      </Badge>
                    </div>

                    <p className="text-gray-700 leading-relaxed">{selectedCampaign.description}</p>
                  </div>

                  {/* Progress */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{selectedCampaign.raised.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-600">
                        of ₹{selectedCampaign.goal.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(selectedCampaign.raised / selectedCampaign.goal) * 100} className="h-3 mb-2" />
                    <p className="text-sm text-gray-600">
                      {Math.round((selectedCampaign.raised / selectedCampaign.goal) * 100)}% funded
                    </p>
                  </div>

                  {/* Impact */}
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-500 p-2 rounded-lg">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-1">Impact</h3>
                          <p className="text-blue-800">{selectedCampaign.impactDescription}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Donation Button */}
                  <Button
                    onClick={() => openDonationDialog(selectedCampaign)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 py-6 text-lg"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Donate Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* NGO Cards Grid */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Verified NGOs & Campaigns</h2>
              <Badge className="bg-green-600 text-white">
                {ngos.filter(n => n.verified).length} Verified
              </Badge>
            </div>

            <div className="space-y-6">
              {ngos.map((ngo) => (
                <Card key={ngo.id} className="hover:shadow-xl transition-shadow bg-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* NGO Image & Basic Info */}
                      <div className="lg:w-1/3">
                        <div className="h-48 overflow-hidden rounded-xl mb-4">
                          <img
                            src={ngo.image}
                            alt={ngo.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-start gap-3 mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{ngo.name}</h3>
                            {ngo.verified && (
                              <Badge className="bg-green-600 text-white mb-2">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {ngo.location}
                            </p>
                            <Badge variant="outline">{ngo.category}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-4">{ngo.description}</p>

                        {ngo.volunteerOpportunity && (
                          <Button
                            onClick={() => onNavigate('events')}
                            variant="outline"
                            className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Volunteer Here
                          </Button>
                        )}
                      </div>

                      {/* NGO Details */}
                      <div className="lg:w-2/3 space-y-4">
                        {/* Funds Breakdown */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Fund Utilization
                          </h4>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Total Funds</div>
                              <div className="text-lg font-bold text-gray-900">₹{(ngo.totalFunds / 100000).toFixed(1)}L</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Funds Spent</div>
                              <div className="text-lg font-bold text-green-600">₹{(ngo.fundsSpent / 100000).toFixed(1)}L</div>
                            </div>
                          </div>
                          <Progress value={(ngo.fundsSpent / ngo.totalFunds) * 100} className="h-2" />
                          <p className="text-xs text-gray-600 mt-1">
                            {Math.round((ngo.fundsSpent / ngo.totalFunds) * 100)}% utilized
                          </p>
                        </div>

                        {/* Resources */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Existing Resources
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {ngo.resources.map((resource, idx) => (
                              <Badge key={idx} variant="outline" className="border-gray-300">
                                {resource}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Active Campaigns */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Active Campaigns ({ngo.activeCampaigns.length})
                          </h4>
                          <div className="space-y-3">
                            {ngo.activeCampaigns.map((campaign) => (
                              <Card
                                key={campaign.id}
                                className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-white to-green-50"
                                onClick={() => setSelectedCampaign(campaign)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <h5 className="font-semibold text-gray-900 mb-1">{campaign.title}</h5>
                                      <p className="text-sm text-gray-600 mb-2">{campaign.description}</p>
                                    </div>
                                    <Badge className={`
                                      ml-2 ${campaign.urgency === 'Critical' ? 'bg-red-600' : campaign.urgency === 'High' ? 'bg-orange-500' : 'bg-yellow-500'}
                                      text-white
                                    `}>
                                      {campaign.urgency}
                                    </Badge>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="font-semibold text-gray-900">₹{campaign.raised.toLocaleString()}</span>
                                      <span className="text-gray-600">of ₹{campaign.goal.toLocaleString()}</span>
                                    </div>
                                    <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                                    <div className="flex items-center justify-between">
                                      <p className="text-xs text-gray-600">
                                        {Math.round((campaign.raised / campaign.goal) * 100)}% funded
                                      </p>
                                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                                        💡 {campaign.impactDescription}
                                      </Badge>
                                    </div>
                                  </div>

                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDonationDialog(campaign);
                                    }}
                                    className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90"
                                  >
                                    <Heart className="w-4 h-4 mr-2" />
                                    Donate to This Campaign
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Donation Dialog */}
        <Dialog open={showDonationDialog} onOpenChange={setShowDonationDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Make a Donation</DialogTitle>
              <DialogDescription>
                {selectedCampaign?.title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Impact Message */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      {selectedCampaign?.impactDescription}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Amount Selection */}
              <div>
                <Label className="mb-2 block">Quick Select</Label>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setDonationAmount(amount.toString())}
                      className={`${donationAmount === amount.toString() ? 'border-green-500 bg-green-50' : ''}`}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <Label htmlFor="amount">Enter Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter custom amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Payment Method (Mock) */}
              <div>
                <Label>Payment Method</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button variant="outline" className="border-gray-300">
                    UPI
                  </Button>
                  <Button variant="outline" className="border-gray-300">
                    Card
                  </Button>
                  <Button variant="outline" className="border-gray-300">
                    Wallet
                  </Button>
                </div>
              </div>

              {/* Donate Button */}
              <Button
                onClick={handleDonate}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 py-6 text-lg"
              >
                <Heart className="w-5 h-5 mr-2" fill="white" />
                Donate {donationAmount ? `₹${donationAmount}` : 'Now'}
              </Button>

              <p className="text-xs text-center text-gray-500">
                100% of your donation goes to the cause. Tax exemption certificate will be sent to your email.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
