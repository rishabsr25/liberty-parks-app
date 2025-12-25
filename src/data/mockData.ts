// Mock data for Liberty Township Parks App

export interface Park {
  id: string;
  name: string;
  description: string;
  address: string;
  coordinates: { lat: number; lng: number };
  amenities: Amenity[];
  image?: string;
}

export interface Amenity {
  id: string;
  type: 'bathroom' | 'bench' | 'trail' | 'parking' | 'playground' | 'picnic' | 'dog-park' | 'sports';
  name: string;
  coordinates: { lat: number; lng: number };
}

export interface ParkEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  category: 'sports' | 'community' | 'nature' | 'fitness' | 'family' | 'seasonal';
}

export interface ReportCategory {
  id: string;
  name: string;
  icon: string;
}

export interface VotingPoll {
  id: string;
  title: string;
  description: string;
  category: 'amenity' | 'event';
  yearsUntilVote: number;
  voteStartDate: Date;
  voteEndDate: Date;
  votes: { yes: number; no: number };
  userVote?: 'yes' | 'no'; // Current user's vote if they've voted
}

export interface ParkReport {
  id: string;
  parkId: string;
  category: string;
  title: string;
  description: string;
  email?: string;
  status: 'pending' | 'acknowledged' | 'in-progress' | 'resolved';
  createdAt: Date;
  image?: string;
}

export interface ParkAttributes {
  runningTrails: number; // 0-5 scale
  dogFriendly: number; // 0-5 scale
  picnicFacilities: number; // 0-5 scale
  parking: number; // 0-5 scale
  playground: number; // 0-5 scale
  waterAccess: number; // 0-5 scale
  natureSensitivity: number; // 0-5 scale
  sportsFields: number; // 0-5 scale
  accessibility: number; // 0-5 scale
}

export interface ParkRecommendation {
  parkId: string;
  parkName: string;
  matchPercentage: number;
  description: string;
}

// Parks Data
export const parks: Park[] = [
  {
    id: 'liberty-park',
    name: 'Liberty Park',
    description: 'Our flagship community park featuring sports fields, playgrounds, and walking trails.',
    address: '2845 Home Rd, Powell, OH 43065',
    coordinates: { lat: 39.4523, lng: -84.3965 },
    amenities: [
      { id: 'lp-bathroom-1', type: 'bathroom', name: 'Main Restrooms', coordinates: { lat: 39.4525, lng: -84.3960 } },
      { id: 'lp-parking-1', type: 'parking', name: 'Main Parking Lot', coordinates: { lat: 39.4520, lng: -84.3970 } },
      { id: 'lp-playground-1', type: 'playground', name: 'Kids Playground', coordinates: { lat: 39.4528, lng: -84.3955 } },
      { id: 'lp-trail-1', type: 'trail', name: 'Nature Trail Loop', coordinates: { lat: 39.4530, lng: -84.3950 } },
      { id: 'lp-sports-1', type: 'sports', name: 'Soccer Fields', coordinates: { lat: 39.4518, lng: -84.3965 } },
    ],
  },
  {
    id: 'big-bear-park',
    name: 'Big Bear Park',
    description: 'A peaceful park perfect for picnics and family gatherings with beautiful natural scenery.',
    address: '8794 Big Bear Ave, Powell, OH 43065',
    coordinates: { lat: 39.4612, lng: -84.4023 },
    amenities: [
      { id: 'wp-bathroom-1', type: 'bathroom', name: 'Park Restrooms', coordinates: { lat: 39.4610, lng: -84.4020 } },
      { id: 'wp-picnic-1', type: 'picnic', name: 'Picnic Pavilion', coordinates: { lat: 39.4615, lng: -84.4025 } },
      { id: 'wp-bench-1', type: 'bench', name: 'Lakeside Benches', coordinates: { lat: 39.4608, lng: -84.4018 } },
      { id: 'wp-parking-1', type: 'parking', name: 'Visitor Parking', coordinates: { lat: 39.4605, lng: -84.4030 } },
    ],
  },
  {
    id: 'havener-park',
    name: 'Havener Park',
    description: 'Home to youth sports leagues with multiple soccer and baseball fields.',
    address: '4085 Liberty Rd, Delaware, OH 43015',
    coordinates: { lat: 39.4489, lng: -84.3812 },
    amenities: [
      { id: 'lef-sports-1', type: 'sports', name: 'Baseball Diamonds', coordinates: { lat: 39.4492, lng: -84.3815 } },
      { id: 'lef-sports-2', type: 'sports', name: 'Soccer Complex', coordinates: { lat: 39.4485, lng: -84.3808 } },
      { id: 'lef-bathroom-1', type: 'bathroom', name: 'Field House Restrooms', coordinates: { lat: 39.4488, lng: -84.3810 } },
      { id: 'lef-parking-1', type: 'parking', name: 'East Lot', coordinates: { lat: 39.4495, lng: -84.3820 } },
    ],
  },
  {
    id: 'hyatts-park',
    name: 'Hyatts Park',
    description: 'A dedicated off-leash dog park with separate areas for large and small dogs.',
    address: '2500 Hyatts Road, Delaware, OH 43065',
    coordinates: { lat: 39.4401, lng: -84.4156 },
    amenities: [
      { id: 'kdp-dogpark-1', type: 'dog-park', name: 'Large Dog Area', coordinates: { lat: 39.4403, lng: -84.4155 } },
      { id: 'kdp-dogpark-2', type: 'dog-park', name: 'Small Dog Area', coordinates: { lat: 39.4399, lng: -84.4158 } },
      { id: 'kdp-bench-1', type: 'bench', name: 'Shaded Seating', coordinates: { lat: 39.4400, lng: -84.4152 } },
      { id: 'kdp-parking-1', type: 'parking', name: 'Dog Park Parking', coordinates: { lat: 39.4398, lng: -84.4160 } },
    ],
  },
];

// Events Data
const today = new Date();
const getDate = (daysFromNow: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

export const events: ParkEvent[] = [
  {
    id: 'evt-1',
    title: 'Morning Yoga in the Park',
    description: 'Start your day with peaceful yoga sessions led by certified instructor Maria Chen.',
    date: getDate(1),
    startTime: '7:00 AM',
    endTime: '8:00 AM',
    location: 'Liberty Park - Main Lawn',
    category: 'fitness',
  },
  {
    id: 'evt-2',
    title: 'Youth Soccer Practice',
    description: 'Weekly practice session for Liberty Youth Soccer League (Ages 8-12).',
    date: getDate(1),
    startTime: '4:00 PM',
    endTime: '5:30 PM',
    location: 'Hyatts Park',
    category: 'sports',
  },
  {
    id: 'evt-3',
    title: 'Dog Walk Meetup',
    description: 'Bring your furry friends for a community dog walk around the park!',
    date: getDate(2),
    startTime: '9:00 AM',
    endTime: '10:30 AM',
    location: 'Big Bear Park',
    category: 'community',
  },
  {
    id: 'evt-4',
    title: 'Nature Photography Walk',
    description: 'Join local photographer James Wilson for tips on capturing wildlife and landscapes.',
    date: getDate(3),
    startTime: '6:00 PM',
    endTime: '7:30 PM',
    location: 'Havener Park',
    category: 'nature',
  },
  {
    id: 'evt-5',
    title: 'Summer Concert Series: Local Bands',
    description: 'Enjoy live music from talented local bands. Bring a blanket and picnic!',
    date: getDate(5),
    startTime: '6:30 PM',
    endTime: '9:00 PM',
    location: 'Liberty Park - Amphitheater',
    category: 'community',
  },
  {
    id: 'evt-6',
    title: 'Kids Fishing Derby',
    description: 'Free fishing event for kids ages 5-14. Poles and bait provided!',
    date: getDate(7),
    startTime: '8:00 AM',
    endTime: '12:00 PM',
    location: 'Havener Park - Lake',
    category: 'family',
  },
  {
    id: 'evt-7',
    title: 'Trail Running Club',
    description: 'Weekly 5K trail run for all skill levels. New members welcome!',
    date: getDate(0),
    startTime: '6:30 AM',
    endTime: '7:30 AM',
    location: 'Liberty Park - Trail Head',
    category: 'fitness',
  },
  {
    id: 'evt-8',
    title: 'Fall Festival Preparation',
    description: 'Volunteer to help decorate and set up for the annual Fall Festival.',
    date: getDate(14),
    startTime: '10:00 AM',
    endTime: '2:00 PM',
    location: 'Liberty Park',
    category: 'seasonal',
  },
  {
    id: 'evt-9',
    title: 'Outdoor Movie Night',
    description: 'Family-friendly movie under the stars. Concessions available.',
    date: getDate(6),
    startTime: '8:00 PM',
    endTime: '10:30 PM',
    location: 'Liberty Park - Main Lawn',
    category: 'family',
  },
  {
    id: 'evt-10',
    title: 'Bird Watching Tour',
    description: 'Guided bird watching with the Ohio Audubon Society. Binoculars provided.',
    date: getDate(4),
    startTime: '7:00 AM',
    endTime: '9:00 AM',
    location: 'Havener Park - Nature Trail',
    category: 'nature',
  },
];

// Report Categories
export const reportCategories: ReportCategory[] = [
  { id: 'maintenance', name: 'Maintenance Needed', icon: 'Wrench' },
  { id: 'safety', name: 'Safety Concern', icon: 'AlertTriangle' },
  { id: 'cleanliness', name: 'Cleanliness Issue', icon: 'Trash2' },
  { id: 'equipment', name: 'Broken Equipment', icon: 'XCircle' },
  { id: 'lighting', name: 'Lighting Problem', icon: 'Lightbulb' },
  { id: 'other', name: 'Other', icon: 'HelpCircle' },
];

// Amenity type labels and icons
export const amenityInfo: Record<string, { label: string; icon: string; color: string }> = {
  bathroom: { label: 'Restrooms', icon: 'Bath', color: 'sky' },
  bench: { label: 'Benches', icon: 'Armchair', color: 'earth' },
  trail: { label: 'Trails', icon: 'TreePine', color: 'forest' },
  parking: { label: 'Parking', icon: 'Car', color: 'bark' },
  playground: { label: 'Playground', icon: 'Baby', color: 'accent' },
  picnic: { label: 'Picnic Area', icon: 'UtensilsCrossed', color: 'earth' },
  'dog-park': { label: 'Dog Park', icon: 'Dog', color: 'moss' },
  sports: { label: 'Sports', icon: 'Trophy', color: 'primary' },
};

// Voting Polls Data
export const votingPolls: VotingPoll[] = [
  {
    id: 'poll-1',
    title: 'Pickleball Courts at Liberty Park',
    description: 'Should we add 4 dedicated pickleball courts at Liberty Park? This would provide a space for this rapidly growing sport in our community.',
    category: 'amenity',
    yearsUntilVote: 2025,
    voteStartDate: new Date('2025-01-01'),
    voteEndDate: new Date('2025-12-31'),
    votes: { yes: 234, no: 156 },
    userVote: undefined,
  },
  {
    id: 'poll-2',
    title: 'Dog Park Expansion at Big Bear Park',
    description: 'Expand the dog park at Big Bear Park with an additional acre for more running space. Cost: $45,000.',
    category: 'amenity',
    yearsUntilVote: 2025,
    voteStartDate: new Date('2025-01-01'),
    voteEndDate: new Date('2025-12-31'),
    votes: { yes: 312, no: 89 },
    userVote: undefined,
  },
  {
    id: 'poll-3',
    title: 'Annual Farmers Market at Havener Park',
    description: 'Host a weekly farmers market from June to October at Havener Park. Local vendors and community engagement.',
    category: 'event',
    yearsUntilVote: 2025,
    voteStartDate: new Date('2025-01-01'),
    voteEndDate: new Date('2025-12-31'),
    votes: { yes: 445, no: 67 },
    userVote: undefined,
  },
  {
    id: 'poll-4',
    title: 'Night Lights for Tennis Courts',
    description: 'Add LED lighting to tennis courts at Hyatts Park for evening play. Cost: $120,000.',
    category: 'amenity',
    yearsUntilVote: 2025,
    voteStartDate: new Date('2025-01-01'),
    voteEndDate: new Date('2025-12-31'),
    votes: { yes: 198, no: 203 },
    userVote: undefined,
  },
];

// Park Attributes (for AI recommendations)
export const parkAttributes: Record<string, ParkAttributes> = {
  'liberty-park': {
    runningTrails: 5,
    dogFriendly: 3,
    picnicFacilities: 4,
    parking: 5,
    playground: 5,
    waterAccess: 2,
    natureSensitivity: 4,
    sportsFields: 5,
    accessibility: 4,
  },
  'havener-park': {
    runningTrails: 3,
    dogFriendly: 2,
    picnicFacilities: 5,
    parking: 4,
    playground: 2,
    waterAccess: 5,
    natureSensitivity: 5,
    sportsFields: 1,
    accessibility: 3,
  },
  'hyatts-park': {
    runningTrails: 2,
    dogFriendly: 1,
    picnicFacilities: 2,
    parking: 4,
    playground: 1,
    waterAccess: 0,
    natureSensitivity: 1,
    sportsFields: 5,
    accessibility: 4,
  },
  'big-bear-park': {
    runningTrails: 1,
    dogFriendly: 5,
    picnicFacilities: 1,
    parking: 3,
    playground: 0,
    waterAccess: 0,
    natureSensitivity: 2,
    sportsFields: 0,
    accessibility: 3,
  },
};

// Park Reports (issues submitted by users)
export const parkReports: ParkReport[] = [
  {
    id: 'rpt-1',
    parkId: 'liberty-park',
    category: 'maintenance',
    title: 'Broken Fence at South Entrance',
    description: 'There is a section of the fence near the south entrance that has been damaged and is unsafe.',
    email: 'user@example.com',
    status: 'acknowledged',
    createdAt: new Date('2025-12-20'),
  },
  {
    id: 'rpt-2',
    parkId: 'havener-park',
    category: 'cleanliness',
    title: 'Overflowing Trash Near Pavilion',
    description: 'The trash can near the picnic pavilion is completely full and trash is overflowing.',
    status: 'in-progress',
    createdAt: new Date('2025-12-21'),
  },
  {
    id: 'rpt-3',
    parkId: 'big-bear-park',
    category: 'safety',
    title: 'Water Fountain Not Working',
    description: 'The water fountain in the dog park is not dispensing water.',
    status: 'pending',
    createdAt: new Date('2025-12-22'),
  },
];
