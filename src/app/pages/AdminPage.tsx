import { Shield, Users, DollarSign, Droplet, AlertTriangle, CheckCircle, X, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { ngos, bloodRequests, disasters, events } from '@/data/mockData';
import { toast } from 'sonner';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const handleApprove = (type: string, id: string) => {
    toast.success(`${type} approved successfully`);
  };

  const handleReject = (type: string, id: string) => {
    toast.error(`${type} rejected`);
  };

  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Total Donations', value: '₹25.4L', icon: DollarSign, color: 'from-green-500 to-green-600', change: '+18%' },
    { label: 'Blood Requests', value: '45', icon: Droplet, color: 'from-red-500 to-red-600', change: '+5%' },
    { label: 'Active NGOs', value: '50', icon: Shield, color: 'from-purple-500 to-purple-600', change: '+8%' }
  ];

  const pendingNGOs = ngos.slice(0, 2);
  const pendingRequests = bloodRequests.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-white/90">Manage and monitor LifeLink AI platform</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`bg-gradient-to-r ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-semibold">{stat.change}</span>
                    <span className="text-gray-500">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="ngos" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="ngos">NGO Approvals</TabsTrigger>
            <TabsTrigger value="requests">Blood Requests</TabsTrigger>
            <TabsTrigger value="disasters">Disasters</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* NGO Approvals */}
          <TabsContent value="ngos">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Pending NGO Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingNGOs.map((ngo) => (
                    <Card key={ngo.id} className="bg-gradient-to-br from-gray-50 to-white">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="h-32 w-full md:w-48 overflow-hidden rounded-lg flex-shrink-0">
                            <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{ngo.name}</h3>
                                <Badge variant="outline" className="mt-1">{ngo.category}</Badge>
                              </div>
                              {ngo.verified ? (
                                <Badge className="bg-green-600 text-white">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-orange-500 text-orange-700">
                                  Pending Review
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{ngo.description}</p>
                            <div className="text-sm text-gray-600 mb-4">
                              <strong>Location:</strong> {ngo.location}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApprove('NGO', ngo.id)}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleReject('NGO', ngo.id)}
                                variant="outline"
                                className="border-red-300 text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                              <Button variant="outline">View Details</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blood Requests */}
          <TabsContent value="requests">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Manage Blood Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-semibold">{request.bloodGroup}</TableCell>
                        <TableCell>{request.hospital}</TableCell>
                        <TableCell>{request.location}</TableCell>
                        <TableCell>
                          <Badge className={`
                            ${request.urgency === 'Critical' ? 'bg-red-600' : request.urgency === 'High' ? 'bg-orange-500' : 'bg-yellow-500'}
                            text-white
                          `}>
                            {request.urgency}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.unitsNeeded}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-green-500 text-green-700">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                              Close
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disasters */}
          <TabsContent value="disasters">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Active Disaster Relief Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {disasters.map((disaster) => (
                    <Card key={disaster.id} className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{disaster.type}</h3>
                            <p className="text-sm text-gray-600">{disaster.location}</p>
                          </div>
                          <Badge className={`
                            ${disaster.severity === 'Critical' ? 'bg-red-600' : disaster.severity === 'High' ? 'bg-orange-500' : 'bg-yellow-500'}
                            text-white
                          `}>
                            {disaster.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{disaster.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <span><strong>{disaster.affectedFamilies}</strong> families affected</span>
                          <span><strong>{new Date(disaster.date).toLocaleDateString()}</strong></span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                            Manage Relief
                          </Button>
                          <Button size="sm" variant="outline">View Details</Button>
                          <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                            Mark Resolved
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">New Users (This Month)</div>
                      <div className="text-2xl font-bold text-gray-900">234</div>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Total Donations (This Month)</div>
                      <div className="text-2xl font-bold text-gray-900">₹4.2L</div>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Blood Donations (This Month)</div>
                      <div className="text-2xl font-bold text-gray-900">156 units</div>
                    </div>
                    <Droplet className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events.slice(0, 4).map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{event.name}</h4>
                          <p className="text-xs text-gray-600">{event.ngo} • {new Date(event.date).toLocaleDateString()}</p>
                          <Badge variant="outline" className="mt-1 text-xs">{event.volunteersRegistered}/{event.volunteersNeeded} registered</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
