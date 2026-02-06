import { useState, useEffect } from 'react';
import { Heart, Droplet, DollarSign, Calendar, Award, TrendingUp, MapPin, Users, Megaphone, AlertCircle, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { toast } from 'sonner';
import { currentUser, thankYouMessages, events, bloodRequests, getGreeting, isBirthday } from '@/data/mockData';

// Local CSV Helper
class LocalCSV {
  private campFileName = 'lifelink_camp_posts.csv';
  private requirementFileName = 'lifelink_requirement_posts.csv';
  private ngoFileName = 'lifelink_ngo_posts.csv';

  // Convert post object to CSV row
  postToCSVRow(post: any): string {
    const row = [
      post.id || '',
      post.type || '',
      post.title || '',
      post.location || '',
      post.date || '',
      post.time || '',
      post.organizer || '',
      post.contact || '',
      post.bloodGroup || '',
      post.units || '',
      post.urgency || '',
      post.description || '',
      post.timestamp ? new Date(post.timestamp).toISOString() : ''
    ];
    return row.map(cell => `"${cell}"`).join(',') + '\n';
  }

  // Convert CSV row back to post object
  csvRowToPost(row: string[], type: string): any {
    return {
      id: parseInt(row[0]) || Date.now(),
      type: type,
      title: row[2] || '',
      location: row[3] || '',
      date: row[4] || '',
      time: row[5] || '',
      organizer: row[6] || '',
      contact: row[7] || '',
      bloodGroup: row[8] || '',
      units: parseInt(row[9]) || 0,
      urgency: row[10] || '',
      description: row[11] || '',
      timestamp: row[12] ? new Date(row[12]) : new Date()
    };
  }

  // Download posts as separate CSV files by type
  downloadCSVByType(posts: any[]): void {
    const headers = ['ID', 'Type', 'Title', 'Location', 'Date', 'Time', 'Organizer', 'Contact', 'Blood Group', 'Units', 'Urgency', 'Description', 'Timestamp'];
    
    // Separate posts by type
    const campPosts = posts.filter(p => p.type === 'camp');
    const requirementPosts = posts.filter(p => p.type === 'requirement');
    const ngoPosts = posts.filter(p => p.type === 'ngo');
    
    // Download camp posts
    if (campPosts.length > 0) {
      const campCSV = headers.join(',') + '\n' + campPosts.map(post => this.postToCSVRow(post)).join('');
      this.downloadFile(campCSV, this.campFileName);
    }
    
    // Download requirement posts
    if (requirementPosts.length > 0) {
      const requirementCSV = headers.join(',') + '\n' + requirementPosts.map(post => this.postToCSVRow(post)).join('');
      this.downloadFile(requirementCSV, this.requirementFileName);
    }
    
    // Download NGO posts
    if (ngoPosts.length > 0) {
      const ngoCSV = headers.join(',') + '\n' + ngoPosts.map(post => this.postToCSVRow(post)).join('');
      this.downloadFile(ngoCSV, this.ngoFileName);
    }
    
    if (campPosts.length === 0 && requirementPosts.length === 0 && ngoPosts.length === 0) {
      toast.error('No posts to download');
    } else {
      toast.success(`Downloaded ${campPosts.length} camp, ${requirementPosts.length} requirement, ${ngoPosts.length} NGO posts`);
    }
  }

  // Generic file download helper
  private downloadFile(content: string, fileName: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Parse CSV file content by type
  parseCSVByType(csvContent: string, type: string): any[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const posts: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const row = this.parseCSVLine(lines[i]);
      if (row.length >= 13) {
        posts.push(this.csvRowToPost(row, type));
      }
    }
    return posts;
  }

  // Parse CSV line handling quoted commas
  parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  // Save to localStorage as separate backups
  saveToLocalStorageByType(posts: any[]): void {
    const campPosts = posts.filter(p => p.type === 'camp');
    const requirementPosts = posts.filter(p => p.type === 'requirement');
    const ngoPosts = posts.filter(p => p.type === 'ngo');
    
    localStorage.setItem('lifelink_camp_posts_backup', JSON.stringify(campPosts));
    localStorage.setItem('lifelink_requirement_posts_backup', JSON.stringify(requirementPosts));
    localStorage.setItem('lifelink_ngo_posts_backup', JSON.stringify(ngoPosts));
  }

  // Load from localStorage backups
  loadFromLocalStorageByType(): any[] {
    const campPosts = JSON.parse(localStorage.getItem('lifelink_camp_posts_backup') || '[]');
    const requirementPosts = JSON.parse(localStorage.getItem('lifelink_requirement_posts_backup') || '[]');
    const ngoPosts = JSON.parse(localStorage.getItem('lifelink_ngo_posts_backup') || '[]');
    
    return [...campPosts, ...requirementPosts, ...ngoPosts];
  }

  // Clear all CSV data
  clearAllCSVData(): void {
    localStorage.removeItem('lifelink_camp_posts_backup');
    localStorage.removeItem('lifelink_requirement_posts_backup');
    localStorage.removeItem('lifelink_ngo_posts_backup');
  }
}

const localCSV = new LocalCSV();

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [userRole, setUserRole] = useState<string>('user');

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'user';
    setUserRole(role);
  }, []);

  if (userRole === 'client') {
    return <ClientDashboard />;
  }

  const greeting = getGreeting();
  const isUserBirthday = isBirthday(currentUser.birthday);

  const stats = [
    {
      label: 'Blood Donated',
      value: `${currentUser.totalDonations} times`,
      subtext: 'Last: Nov 15, 2025',
      icon: Droplet,
      gradient: 'from-red-500 to-red-600',
      iconBg: 'bg-red-100'
    },
    {
      label: 'Money Donated',
      value: `₹${currentUser.totalMoneyDonated.toLocaleString()}`,
      subtext: `${currentUser.causesSupported} causes supported`,
      icon: DollarSign,
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100'
    },
    {
      label: 'People Helped',
      value: '150+',
      subtext: 'Direct impact',
      icon: Heart,
      gradient: 'from-pink-500 to-pink-600',
      iconBg: 'bg-pink-100'
    },
    {
      label: 'Events Attended',
      value: `${currentUser.eventsAttended}`,
      subtext: 'Volunteer activities',
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      label: 'Impact Score',
      value: `${currentUser.impactScore}`,
      subtext: 'Top 5% contributor',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Greeting Section */}
        <Card className="mb-6 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {greeting}, {currentUser.name}! 👋
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-3 py-1">
                    ⭐ You saved {currentUser.totalDonations > 3 ? '3' : currentUser.totalDonations} lives
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-3 py-1">
                    🏆 Community Hero
                  </Badge>
                  {currentUser.totalDonations >= 5 && (
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-3 py-1">
                      💪 Consistent Donor
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => onNavigate('blood')}
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                >
                  <Droplet className="w-4 h-4 mr-2" />
                  Donate Now
                </Button>
              </div>
            </div>

            {/* Birthday Reminder */}
            {isUserBirthday && (
              <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🎂</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Happy Birthday, {currentUser.name}! 🎉</h3>
                    <p className="text-white/90 text-sm mb-3">
                      Celebrate by making someone else's day special! Consider donating blood or supporting a cause close to your heart.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => onNavigate('donations')}
                      className="bg-white text-pink-600 hover:bg-white/90"
                    >
                      Make a Birthday Impact
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Horizontal Stats Cards */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Impact Dashboard</h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max md:grid md:grid-cols-5 md:min-w-0">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="min-w-[200px] md:min-w-0 hover:shadow-lg transition-shadow bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`${stat.iconBg} p-3 rounded-xl`}>
                          <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} style={{ fill: 'currentColor' }} />
                        </div>
                      </div>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                      <div className="text-xs text-gray-500">{stat.subtext}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <Card className="mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Your Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {currentUser.badges.map((badge) => (
                <div
                  key={badge}
                  className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-shadow"
                >
                  🏆 {badge}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vertical Split View - Thank You Messages & Upcoming Opportunities */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Thank You Messages & Impact Stories */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
              Your Impact Stories
            </h2>

            <ScrollArea className="h-[600px]">
              <div className="space-y-4 pr-4">
                {thankYouMessages.map((message) => {
                  const typeColors = {
                    blood: 'from-red-500 to-red-600',
                    money: 'from-green-500 to-green-600',
                    volunteer: 'from-blue-500 to-blue-600',
                    disaster: 'from-orange-500 to-orange-600'
                  };

                  const typeLabels = {
                    blood: 'Blood Donation',
                    money: 'Money Donation',
                    volunteer: 'Volunteering',
                    disaster: 'Disaster Relief'
                  };

                  return (
                    <Card key={message.id} className="hover:shadow-md transition-shadow bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`bg-gradient-to-br ${typeColors[message.type]} p-2 rounded-lg`}>
                            <Heart className="w-5 h-5 text-white" fill="white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900">{message.from}</h3>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {typeLabels[message.type]}
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-500">{new Date(message.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{message.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right Column - Nearby Events & Opportunities */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-500" />
              Opportunities Near You
            </h2>

            <ScrollArea className="h-[600px]">
              <div className="space-y-4 pr-4">
                {/* Critical Blood Needs */}
                <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-700 flex items-center gap-2 text-lg">
                      <Droplet className="w-5 h-5" />
                      Critical Blood Needs Nearby
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {bloodRequests.slice(0, 2).map((request) => (
                      <div key={request.id} className="bg-white rounded-lg p-3 border border-red-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{request.hospital}</h4>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {request.location} • {request.distance}
                            </p>
                          </div>
                          <Badge className={`
                            ${request.urgency === 'Critical' ? 'bg-red-600' : request.urgency === 'High' ? 'bg-orange-500' : 'bg-yellow-500'}
                            text-white
                          `}>
                            {request.urgency}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="border-red-300 text-red-700">
                            {request.bloodGroup}
                          </Badge>
                          <span className="text-xs text-gray-600">{request.unitsNeeded} units needed</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onNavigate('blood')}
                          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white hover:opacity-90"
                        >
                          Help Now
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                {events.slice(0, 3).map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{event.name}</h3>
                              <p className="text-xs text-gray-600 mt-1">by {event.ngo}</p>
                            </div>
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                          <div className="space-y-1 mb-3">
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(event.date).toLocaleDateString()} at {event.time}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onNavigate('events')}
                            className="w-full hover:bg-blue-50 hover:border-blue-300"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* See All Events */}
                <Button
                  onClick={() => onNavigate('events')}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90"
                >
                  See All Events & Opportunities
                </Button>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('camp');
  const [csvPosts, setCsvPosts] = useState<any[]>([]);

  // Create Post States (initial demo posts)
  const [posts, setPosts] = useState<any[]>([
    {
      id: 1,
      type: 'camp',
      title: 'Mega Blood Donation Camp',
      location: 'Central Community Hall, Mumbai',
      date: '2023-10-25',
      time: '10:00 AM - 04:00 PM',
      organizer: 'Red Cross Society',
      contact: '+91 9876543210',
      description: 'Join us for a mega donation camp. Refreshments provided.',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      type: 'requirement',
      bloodGroup: 'O-',
      units: 2,
      location: 'City Hospital, Emergency Ward',
      urgency: 'Critical',
      contact: '+91 9123456780',
      timestamp: new Date(Date.now() - 7200000)
    }
  ]);

  // Load posts from localStorage backup on component mount
  useEffect(() => {
    const storedPosts = localCSV.loadFromLocalStorageByType();
    if (storedPosts.length > 0) {
      setCsvPosts(storedPosts);
      setPosts([...storedPosts, ...posts]);
    }
  }, []);

  // Camp form state
  const [campData, setCampData] = useState({
    location: '',
    date: '',
    time: '',
    contact: '',
    organizer: ''
  });

  // Requirement form state
  const [requirementData, setRequirementData] = useState({
    bloodGroup: '',
    units: '',
    urgency: '',
    location: '',
    contact: ''
  });

  // NGO form state
  const [ngoData, setNgoData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    contact: ''
  });

  const clearCSVData = () => {
    setCsvPosts([]);
    localCSV.clearAllCSVData();
    // Reset to initial posts
    setPosts([
      {
        id: 1,
        type: 'camp',
        title: 'Mega Blood Donation Camp',
        location: 'Central Community Hall, Mumbai',
        date: '2023-10-25',
        time: '10:00 AM - 04:00 PM',
        organizer: 'Red Cross Society',
        contact: '+91 9876543210',
        description: 'Join us for a mega donation camp. Refreshments provided.',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 2,
        type: 'requirement',
        bloodGroup: 'O-',
        units: 2,
        location: 'City Hospital, Emergency Ward',
        urgency: 'Critical',
        contact: '+91 9123456780',
        timestamp: new Date(Date.now() - 7200000)
      }
    ]);
    toast.success('All CSV data cleared!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        
        // Determine file type based on filename
        let postType = 'camp';
        if (file.name.includes('requirement')) postType = 'requirement';
        else if (file.name.includes('ngo')) postType = 'ngo';
        
        const importedPosts = localCSV.parseCSVByType(csvContent, postType);
        const updatedCsvPosts = [...importedPosts, ...csvPosts];
        setCsvPosts(updatedCsvPosts);
        localCSV.saveToLocalStorageByType(updatedCsvPosts);
        setPosts([...updatedCsvPosts, ...posts.filter(p => p.id <= 2)]);
        toast.success(`Imported ${importedPosts.length} ${postType} posts from CSV!`);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast.error('Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let newPost;
      
      if (activeTab === 'camp') {
        // Create camp post
        newPost = {
          id: Date.now(),
          type: 'camp',
          title: `Blood Donation Camp - ${campData.location}`,
          location: campData.location,
          date: campData.date,
          time: campData.time,
          organizer: campData.organizer,
          contact: campData.contact,
          description: `Join us for a blood donation camp at ${campData.location}. Organized by ${campData.organizer}.`,
          timestamp: new Date()
        };
        
        // Send to backend
        await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost)
        });
        
        // Reset camp form
        setCampData({
          location: '',
          date: '',
          time: '',
          contact: '',
          organizer: ''
        });
        
      } else if (activeTab === 'requirement') {
        // Create requirement post
        newPost = {
          id: Date.now(),
          type: 'requirement',
          bloodGroup: requirementData.bloodGroup,
          units: parseInt(requirementData.units),
          location: requirementData.location,
          urgency: requirementData.urgency,
          contact: requirementData.contact,
          timestamp: new Date()
        };
        
        // Send to backend
        await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost)
        });
        
        // Reset requirement form
        setRequirementData({
          bloodGroup: '',
          units: '',
          urgency: '',
          location: '',
          contact: ''
        });
        
      } else if (activeTab === 'ngo') {
        // Create NGO post
        newPost = {
          id: Date.now(),
          type: 'ngo',
          title: ngoData.title,
          description: ngoData.description,
          date: ngoData.date,
          time: ngoData.time,
          location: ngoData.location,
          contact: ngoData.contact,
          timestamp: new Date()
        };
        
        // Send to backend
        await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost)
        });
        
        // Reset NGO form
        setNgoData({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          contact: ''
        });
      }
      
      // Add to local state and CSV
      if (newPost) {
        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        
        // Save to CSV data
        const updatedCsvPosts = [newPost, ...csvPosts];
        setCsvPosts(updatedCsvPosts);
        localCSV.saveToLocalStorageByType(updatedCsvPosts);
        
        toast.success('Post created successfully!');
      }
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
            <p className="text-gray-600">Manage your posts and blood donation activities</p>
          </div>
          <div className="flex gap-2">
            {/* Exit Client View button moved to Navbar */}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Post Section - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>Select the type of post you want to create</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="camp" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full mb-6">
                    <TabsTrigger value="camp" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                      Blood Camp
                    </TabsTrigger>
                    <TabsTrigger value="requirement" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                      Requirement
                    </TabsTrigger>
                    <TabsTrigger value="ngo" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      NGO Activity
                    </TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <TabsContent value="camp" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input 
                            placeholder="e.g. City Hall" 
                            required 
                            value={campData.location}
                            onChange={(e) => setCampData({...campData, location: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input 
                            type="date" 
                            required 
                            value={campData.date}
                            onChange={(e) => setCampData({...campData, date: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Input 
                            type="time" 
                            required 
                            value={campData.time}
                            onChange={(e) => setCampData({...campData, time: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Contact Info</Label>
                          <Input 
                            placeholder="+91..." 
                            required 
                            value={campData.contact}
                            onChange={(e) => setCampData({...campData, contact: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Organizer Details</Label>
                        <Input 
                          placeholder="Organization Name" 
                          required 
                          value={campData.organizer}
                          onChange={(e) => setCampData({...campData, organizer: e.target.value})}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="requirement" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Blood Group Needed</Label>
                          <Select value={requirementData.bloodGroup} onValueChange={(value) => setRequirementData({...requirementData, bloodGroup: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Group" />
                            </SelectTrigger>
                            <SelectContent>
                              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Units Required</Label>
                          <Input 
                            type="number" 
                            min="1" 
                            placeholder="1" 
                            required 
                            value={requirementData.units}
                            onChange={(e) => setRequirementData({...requirementData, units: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Urgency Level</Label>
                          <Select value={requirementData.urgency} onValueChange={(value) => setRequirementData({...requirementData, urgency: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input 
                            placeholder="Hospital/Center" 
                            required 
                            value={requirementData.location}
                            onChange={(e) => setRequirementData({...requirementData, location: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Details</Label>
                        <Input 
                          placeholder="Emergency Contact Number" 
                          required 
                          value={requirementData.contact}
                          onChange={(e) => setRequirementData({...requirementData, contact: e.target.value})}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="ngo" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                      <div className="space-y-2">
                        <Label>Event Title</Label>
                        <Input 
                          placeholder="e.g. Charity Run" 
                          required 
                          value={ngoData.title}
                          onChange={(e) => setNgoData({...ngoData, title: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                          placeholder="Describe the event..." 
                          className="min-h-[100px]" 
                          required 
                          value={ngoData.description}
                          onChange={(e) => setNgoData({...ngoData, description: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input 
                            type="date" 
                            required 
                            value={ngoData.date}
                            onChange={(e) => setNgoData({...ngoData, date: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Input 
                            type="time" 
                            required 
                            value={ngoData.time}
                            onChange={(e) => setNgoData({...ngoData, time: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input 
                            placeholder="Venue" 
                            required 
                            value={ngoData.location}
                            onChange={(e) => setNgoData({...ngoData, location: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Contact Details</Label>
                          <Input 
                            placeholder="Coordinator Number" 
                            required 
                            value={ngoData.contact}
                            onChange={(e) => setNgoData({...ngoData, contact: e.target.value})}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 mt-4">
                      Create Post
                    </Button>
                  </form>
                </Tabs>
              </CardContent>
            </Card>

            {/* Unified Feed */}
            <h2 className="text-xl font-bold text-gray-900 pt-4">Recent Activity Feed</h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                  <div className={`h-1 w-full ${post.type === 'camp' ? 'bg-red-500' :
                    post.type === 'requirement' ? 'bg-orange-500' : 'bg-blue-600'
                    }`} />
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full shrink-0 ${post.type === 'camp' ? 'bg-red-50 text-red-600' :
                        post.type === 'requirement' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                        {post.type === 'camp' && <Droplet className="w-5 h-5" />}
                        {post.type === 'requirement' && <AlertCircle className="w-5 h-5" />}
                        {post.type === 'ngo' && <Megaphone className="w-5 h-5" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={`
                                ${post.type === 'camp' ? 'border-red-200 text-red-700' :
                                  post.type === 'requirement' ? 'border-orange-200 text-orange-700' : 'border-blue-200 text-blue-700'}
                              `}>
                                {post.type === 'camp' ? 'Blood Camp' :
                                  post.type === 'requirement' ? 'Blood Needed' : 'NGO Event'}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {new Date(post.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {post.title || `Blood Requirement: ${post.bloodGroup} (${post.units} Units)`}
                            </h3>
                          </div>
                          {post.type === 'requirement' && (
                            <Badge className={`${post.urgency === 'Critical' ? 'bg-red-600' : 'bg-yellow-500'
                              } text-white`}>
                              {post.urgency}
                            </Badge>
                          )}
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
                          {post.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {post.location}
                            </div>
                          )}
                          {post.date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {post.date}
                            </div>
                          )}
                          {post.contact && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              {post.contact}
                            </div>
                          )}
                        </div>

                        {post.description && (
                          <p className="mt-3 text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                            {post.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Stats */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Your Impact
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-slate-300">Total Posts</span>
                    <span className="font-bold text-xl">{posts.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-slate-300">Camp Posts</span>
                    <span className="font-bold text-xl">{posts.filter(p => p.type === 'camp').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-slate-300">Requirements</span>
                    <span className="font-bold text-xl">{posts.filter(p => p.type === 'requirement').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-slate-300">NGO Events</span>
                    <span className="font-bold text-xl">{posts.filter(p => p.type === 'ngo').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Local CSV Storage
                </CardTitle>
                <CardDescription className="text-xs">
                  {csvPosts.length > 0 ? `${csvPosts.length} total posts` : 'No CSV data'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Camp Posts: {csvPosts.filter(p => p.type === 'camp').length}</p>
                  <p className="mb-2">Requirements: {csvPosts.filter(p => p.type === 'requirement').length}</p>
                  <p className="mb-2">NGO Events: {csvPosts.filter(p => p.type === 'ngo').length}</p>
                  <p className="text-xs text-gray-500">Separate CSV files by type</p>
                </div>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => localCSV.downloadCSVByType(csvPosts)}
                    className="w-full"
                    disabled={csvPosts.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All CSVs
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import CSV
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearCSVData}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Clear CSV Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <p>Verify all details before posting an emergency requirement.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <p>Include clear location and valid contact numbers.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                  <p>Mark posts as 'Closed' once the requirement is met.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
