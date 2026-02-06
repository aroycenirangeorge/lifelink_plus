// Mock Data for LifeLink AI Platform

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  bloodGroup: string;
  lastDonation: string;
  totalDonations: number;
  available: boolean;
  totalMoneyDonated: number;
  causesSupported: number;
  eventsAttended: number;
  impactScore: number;
  badges: string[];
  joinedDate: string;
  birthday?: string;
}

export interface BloodRequest {
  id: string;
  bloodGroup: string;
  location: string;
  hospital: string;
  urgency: 'Critical' | 'High' | 'Medium';
  distance: string;
  contactName: string;
  contactPhone: string;
  datePosted: string;
  unitsNeeded: number;
}

export interface BloodCamp {
  id: string;
  name: string;
  organizer: string;
  location: string;
  date: string;
  time: string;
  image?: string;
}

export interface NGO {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  verified: boolean;
  image: string;
  totalFunds: number;
  fundsSpent: number;
  activeCampaigns: Campaign[];
  resources: string[];
  volunteerOpportunity: boolean;
}

export interface Campaign {
  id: string;
  ngoId: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  urgency: 'Critical' | 'High' | 'Medium';
  impactDescription: string;
  image?: string;
  category: string;
}

export interface DisasterEvent {
  id: string;
  type: 'Flood' | 'Earthquake' | 'Fire' | 'Cyclone' | 'Landslide';
  location: string;
  date: string;
  severity: 'Critical' | 'High' | 'Medium';
  needs: {
    blood: boolean;
    food: boolean;
    shelter: boolean;
    volunteers: boolean;
    funds: boolean;
  };
  affectedFamilies: number;
  description: string;
}

export interface Event {
  id: string;
  name: string;
  ngo: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
  image?: string;
}

export interface ThankYouMessage {
  id: string;
  from: string;
  message: string;
  date: string;
  type: 'blood' | 'money' | 'volunteer' | 'disaster';
}

// Current logged-in user
export const currentUser: User = {
  id: '1',
  name: 'User',
  email: 'user@email.com',
  phone: '+91 98765 43210',
  city: 'Mumbai',
  bloodGroup: 'O+',
  lastDonation: '2025-11-15',
  totalDonations: 8,
  available: true,
  totalMoneyDonated: 15000,
  causesSupported: 12,
  eventsAttended: 5,
  impactScore: 950,
  badges: ['Life Saver', 'Community Hero', 'Hope Giver', 'Consistent Donor'],
  joinedDate: '2023-06-10',
  birthday: '1996-03-15'
};

// Mock blood donors
export const bloodDonors = [
  {
    id: '2',
    name: 'Rahul Kumar',
    bloodGroup: 'A+',
    city: 'Mumbai',
    lastDonation: '2025-10-20',
    available: true,
    distance: '2.3 km'
  },
  {
    id: '3',
    name: 'Anita Verma',
    bloodGroup: 'B+',
    city: 'Mumbai',
    lastDonation: '2025-12-01',
    available: true,
    distance: '3.5 km'
  },
  {
    id: '4',
    name: 'Vikram Singh',
    bloodGroup: 'AB-',
    city: 'Mumbai',
    lastDonation: '2025-09-15',
    available: true,
    distance: '5.1 km'
  }
];

// Mock blood requests
export const bloodRequests: BloodRequest[] = [
  {
    id: 'br1',
    bloodGroup: 'O-',
    location: 'Andheri, Mumbai',
    hospital: 'Kokilaben Hospital',
    urgency: 'Critical',
    distance: '1.2 km',
    contactName: 'Dr. Mehta',
    contactPhone: '+91 98765 11111',
    datePosted: '2026-01-19',
    unitsNeeded: 2
  },
  {
    id: 'br2',
    bloodGroup: 'A+',
    location: 'Bandra, Mumbai',
    hospital: 'Lilavati Hospital',
    urgency: 'High',
    distance: '3.8 km',
    contactName: 'Dr. Patel',
    contactPhone: '+91 98765 22222',
    datePosted: '2026-01-19',
    unitsNeeded: 1
  },
  {
    id: 'br3',
    bloodGroup: 'B-',
    location: 'Worli, Mumbai',
    hospital: 'Breach Candy Hospital',
    urgency: 'Medium',
    distance: '6.5 km',
    contactName: 'Dr. Shah',
    contactPhone: '+91 98765 33333',
    datePosted: '2026-01-18',
    unitsNeeded: 3
  }
];

// Mock blood camps
export const bloodCamps: BloodCamp[] = [
  {
    id: 'bc1',
    name: 'Community Blood Donation Drive',
    organizer: 'RedCross Mumbai',
    location: 'Phoenix Mall, Lower Parel',
    date: '2026-01-25',
    time: '10:00 AM - 6:00 PM'
  },
  {
    id: 'bc2',
    name: 'Save Lives Blood Camp',
    organizer: 'Rotary Club Mumbai',
    location: 'YMCA Hall, Andheri',
    date: '2026-02-02',
    time: '9:00 AM - 5:00 PM'
  },
  {
    id: 'bc3',
    name: 'Youth Blood Donors Meet',
    organizer: 'Think Foundation',
    location: 'Inorbit Mall, Malad',
    date: '2026-02-10',
    time: '11:00 AM - 7:00 PM'
  }
];

// Mock NGOs
export const ngos: NGO[] = [
  {
    id: 'ngo1',
    name: 'Smile Foundation',
    description: 'Working towards empowering underprivileged children through education and healthcare.',
    location: 'Mumbai, Maharashtra',
    category: 'Education',
    verified: true,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    totalFunds: 5000000,
    fundsSpent: 3500000,
    resources: ['10 Schools', '50 Teachers', '1000+ Students'],
    volunteerOpportunity: true,
    activeCampaigns: [
      {
        id: 'c1',
        ngoId: 'ngo1',
        title: 'Mid-Day Meals Program',
        description: 'Provide nutritious meals to 500 underprivileged children',
        goal: 200000,
        raised: 145000,
        urgency: 'High',
        impactDescription: '₹500 can feed 5 children for a week',
        category: 'Food'
      },
      {
        id: 'c2',
        ngoId: 'ngo1',
        title: 'Books for All',
        description: 'Distribute educational materials to rural schools',
        goal: 100000,
        raised: 78000,
        urgency: 'Medium',
        impactDescription: '₹1000 can provide books for 10 children',
        category: 'Education'
      }
    ]
  },
  {
    id: 'ngo2',
    name: 'GiveIndia',
    description: 'Largest donation platform connecting donors to verified NGOs across India.',
    location: 'Pan India',
    category: 'Multiple Causes',
    verified: true,
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',
    totalFunds: 12000000,
    fundsSpent: 10500000,
    resources: ['200+ Partner NGOs', '15 States', '50000+ Beneficiaries'],
    volunteerOpportunity: true,
    activeCampaigns: [
      {
        id: 'c3',
        ngoId: 'ngo2',
        title: 'Emergency Medical Fund',
        description: 'Support critical medical treatments for the underprivileged',
        goal: 500000,
        raised: 320000,
        urgency: 'Critical',
        impactDescription: '₹2000 can save one life',
        category: 'Healthcare'
      }
    ]
  },
  {
    id: 'ngo3',
    name: 'Akshaya Patra',
    description: 'Feeding hungry children and supporting their education across India.',
    location: 'Bangalore, Karnataka',
    category: 'Food & Nutrition',
    verified: true,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    totalFunds: 8000000,
    fundsSpent: 7200000,
    resources: ['35 Kitchens', '1.8M Children Fed Daily', '14000 Schools'],
    volunteerOpportunity: false,
    activeCampaigns: [
      {
        id: 'c4',
        ngoId: 'ngo3',
        title: 'Feed 1000 Children',
        description: 'Provide daily meals to children in government schools',
        goal: 300000,
        raised: 215000,
        urgency: 'High',
        impactDescription: '₹950 feeds one child for a full year',
        category: 'Food'
      }
    ]
  },
  {
    id: 'ngo4',
    name: 'Goonj',
    description: 'Turning urban waste into rural development resources.',
    location: 'Delhi, NCR',
    category: 'Rural Development',
    verified: true,
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
    totalFunds: 3000000,
    fundsSpent: 2400000,
    resources: ['500+ Villages', '100+ Volunteers', 'Disaster Relief Kits'],
    volunteerOpportunity: true,
    activeCampaigns: [
      {
        id: 'c5',
        ngoId: 'ngo4',
        title: 'Winter Clothing Drive',
        description: 'Provide warm clothes to families in cold regions',
        goal: 150000,
        raised: 95000,
        urgency: 'High',
        impactDescription: '₹500 provides warm clothing for one person',
        category: 'Clothing'
      }
    ]
  }
];

// Mock disaster events
export const disasters: DisasterEvent[] = [
  {
    id: 'd1',
    type: 'Flood',
    location: 'Kerala, Kochi',
    date: '2026-01-15',
    severity: 'Critical',
    needs: {
      blood: false,
      food: true,
      shelter: true,
      volunteers: true,
      funds: true
    },
    affectedFamilies: 350,
    description: 'Severe flooding has displaced hundreds of families. Immediate relief needed.'
  },
  {
    id: 'd2',
    type: 'Earthquake',
    location: 'Uttarakhand, Dehradun',
    date: '2026-01-10',
    severity: 'High',
    needs: {
      blood: true,
      food: true,
      shelter: true,
      volunteers: true,
      funds: true
    },
    affectedFamilies: 150,
    description: '5.8 magnitude earthquake caused structural damage and injuries.'
  },
  {
    id: 'd3',
    type: 'Cyclone',
    location: 'Odisha, Puri',
    date: '2026-01-05',
    severity: 'Medium',
    needs: {
      blood: false,
      food: true,
      shelter: false,
      volunteers: true,
      funds: false
    },
    affectedFamilies: 80,
    description: 'Post-cyclone recovery support needed for coastal villages.'
  }
];

// Mock events
export const events: Event[] = [
  {
    id: 'e1',
    name: 'Beach Cleanup Drive',
    ngo: 'Smile Foundation',
    date: '2026-01-26',
    time: '7:00 AM',
    location: 'Juhu Beach, Mumbai',
    category: 'Environment',
    description: 'Join us for a morning beach cleanup and make our beaches cleaner!',
    volunteersNeeded: 50,
    volunteersRegistered: 32
  },
  {
    id: 'e2',
    name: 'Teaching Workshop',
    ngo: 'Teach For India',
    date: '2026-02-01',
    time: '2:00 PM',
    location: 'Andheri Community Center',
    category: 'Education',
    description: 'Volunteer to teach underprivileged children basic skills.',
    volunteersNeeded: 20,
    volunteersRegistered: 15
  },
  {
    id: 'e3',
    name: 'Food Distribution',
    ngo: 'Akshaya Patra',
    date: '2026-01-28',
    time: '6:00 PM',
    location: 'Dharavi, Mumbai',
    category: 'Food',
    description: 'Help us distribute evening meals to the homeless.',
    volunteersNeeded: 30,
    volunteersRegistered: 25
  },
  {
    id: 'e4',
    name: 'Health Checkup Camp',
    ngo: 'GiveIndia',
    date: '2026-02-05',
    time: '10:00 AM',
    location: 'Malad Community Hall',
    category: 'Healthcare',
    description: 'Free health screening for underprivileged communities.',
    volunteersNeeded: 15,
    volunteersRegistered: 8
  },
  {
    id: 'e5',
    name: 'Tree Plantation Drive',
    ngo: 'Green Mumbai',
    date: '2026-02-08',
    time: '8:00 AM',
    location: 'Aarey Forest, Mumbai',
    category: 'Environment',
    description: 'Plant 500 trees and contribute to a greener Mumbai.',
    volunteersNeeded: 100,
    volunteersRegistered: 67
  }
];

// Mock thank you messages
export const thankYouMessages: ThankYouMessage[] = [
  {
    id: 't1',
    from: 'Kokilaben Hospital',
    message: 'Thank you User! Your blood donation saved a young mother\'s life during emergency surgery. 🙏',
    date: '2025-11-16',
    type: 'blood'
  },
  {
    id: 't2',
    from: 'Smile Foundation',
    message: 'Your generous donation of ₹2000 helped provide meals to 20 children for a week. They send their love! ❤️',
    date: '2025-12-05',
    type: 'money'
  },
  {
    id: 't3',
    from: 'Teach For India',
    message: 'Thanks to volunteers like you, 15 children learned to read this month. You\'re making a difference!',
    date: '2025-12-20',
    type: 'volunteer'
  },
  {
    id: 't4',
    from: 'Kerala Flood Relief',
    message: 'Your contribution helped rebuild 2 homes for families affected by floods. Forever grateful! 🏠',
    date: '2026-01-10',
    type: 'disaster'
  },
  {
    id: 't5',
    from: 'Akshaya Patra',
    message: 'With your support, we served 500 nutritious meals yesterday. Thank you for being a hope giver! 🍛',
    date: '2026-01-15',
    type: 'money'
  }
];

// Helper function to get time-based greeting
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Helper function to check if today is birthday
export const isBirthday = (birthday?: string): boolean => {
  if (!birthday) return false;
  const today = new Date();
  const bday = new Date(birthday);
  return today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate();
};
