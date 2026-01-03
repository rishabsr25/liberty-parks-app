// Import necessary libraries and components
import { useState } from 'react';
import { Sparkles, MapPin, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

/* -------------------------------------------------------------------------- */
/*                           SCORING CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

const SCORING_CONFIG = {
  // Attribute scoring
  MAX_ATTRIBUTE_VALUE: 5,              // Park attributes are rated 0-5
  
  // Phrase detection
  PHRASE_BONUS_MULTIPLIER: 1.2,        // Extra weight for multi-word phrases
  
  // Fallback scoring weights (when no keywords match)
  FALLBACK_DIVERSITY_WEIGHT: 40,       // Points for amenity variety
  FALLBACK_QUALITY_WEIGHT: 40,         // Points for facility quality
  FALLBACK_SIZE_WEIGHT: 20,            // Points for total amenities
  MAX_AMENITY_TYPES: 6,                // Max unique amenity types in dataset
  MAX_AMENITIES_FOR_SIZE: 8,           // Threshold for size scoring
  
  // Match reason display
  MAX_FEATURES_IN_REASON: 2,           // How many activities to show in match reason
  MIN_CONTRIBUTION_THRESHOLD: 0.3,     // Minimum score ratio to count as "contributing" (60%)
  
  // Keyword specificity defaults
  DEFAULT_SPECIFICITY: 10,              // Default specificity for unscored keywords
  GENERIC_KEYWORD_SPECIFICITY: 5,       // Specificity for generic terms like "exercise"
  
  // UI
  SEARCH_SIMULATION_DELAY: 1000,       // ms to show loading state
} as const;

/* -------------------------------------------------------------------------- */
/*                               TYPE DEFINITIONS                              */
/* -------------------------------------------------------------------------- */

// Represents a park and its public-facing information

interface Park {
  id: string;                 // Unique identifier (used for lookup)
  name: string;               // Display name
  description: string;        // Short summary shown to users
  address: string;            // Physical address
  amenities: Array<{ type: string; name: string }>; // List of amenities offered
}

// Numerical scoring dimensions used by the AI matcher
// Each value is normalized from 0–5

interface ParkAttributes {
  runningTrails: number;      // Quality/length of running trails
  dogFriendly: number;         // Dog-friendly amenities and policies
  picnicFacilities: number;    // Tables, grills, and picnic areas
  playground: number;          // Children's play equipment
  sportsFields: number;        // Sports courts and fields
  natureSensitivity: number;   // Natural beauty and wildlife
  waterAccess: number;         // Lakes, streams, water features
  parking: number;             // Parking availability and convenience
  accessibility: number;       // ADA compliance and ease of access
  bikingTrails: number;        // Biking paths and trails
  openSpace: number;           // Open fields and spacious areas
  shelters: number;            // Covered pavilions and shelters
}

/* -------------------------------------------------------------------------- */
/*                               DATA: PARK INFORMATION                        */
/* -------------------------------------------------------------------------- */

/**
 * Complete list of parks in Liberty Township with their basic information
 */

const parks: Park[] = [
  {
    id: 'liberty',
    name: 'Liberty Park',
    description: 'Main community park with extensive trails and facilities',
    address: '2845 Home Rd, Powell, OH',
    amenities: [
      { type: 'trail', name: 'Running Trail' },
      { type: 'playground', name: 'Playground' },
      { type: 'picnic', name: 'Picnic Area' },
      { type: 'sports', name: 'Sports Fields' },
      { type: 'restroom', name: 'Restrooms' },
      { type: 'parking', name: 'Parking Lot' }
    ]
  },
  {
    id: 'havener',
    name: 'Havener Park',
    description: 'Quiet neighborhood park perfect for families',
    address: '4085 Liberty Rd, Delaware, OH',
    amenities: [
      { type: 'playground', name: 'Playground' },
      { type: 'picnic', name: 'Picnic Tables' },
      { type: 'parking', name: 'Parking' }
    ]
  },
  {
    id: 'big-bear',
    name: 'Big Bear Park',
    description: 'Large park with sports facilities and open spaces',
    address: '9351 Big Bear Avenue, Powell, OH',
    amenities: [
      { type: 'sports', name: 'Sports Fields' },
      { type: 'playground', name: 'Playground' },
      { type: 'trail', name: 'Walking Trail' },
      { type: 'parking', name: 'Parking' }
    ]
  },
  {
    id: 'hyatts',
    name: 'Hyatts Park',
    description: 'Community park with shelters and recreation areas',
    address: '2500 Hyatts Rd, Powell, OH',
    amenities: [
      { type: 'shelter', name: 'Picnic Shelter' },
      { type: 'playground', name: 'Playground' },
      { type: 'sports', name: 'Ball Field' },
      { type: 'parking', name: 'Parking' }
    ]
  },
  {
    id: 'patriot',
    name: 'Patriot Park',
    description: 'Compact local park with a baseball diamond and surrounding open space',
    address: '7765 Liberty Road North, Powell, OH',
    amenities: [
      { type: 'trail', name: 'Nature Trail' },
      { type: 'parking', name: 'Parking' },
      { type: 'picnic', name: 'Picnic Area' }
    ]
  },
  {
    id: 'wedgewood',
    name: 'Wedgewood Park',
    description: 'Neighborhood park with playground and open areas',
    address: '10150 Sawmill Pkwy, Powell, OH',
    amenities: [
      { type: 'playground', name: 'Playground' },
      { type: 'sports', name: 'Open Field' },
      { type: 'parking', name: 'Parking' }
    ]
  },
  {
    id: 'smith-preserve',
    name: 'Smith Preserve',
    description: 'Natural preserve with hiking trails and wildlife',
    address: '6000 Farmstead Ln, Delaware, OH',
    amenities: [
      { type: 'trail', name: 'Hiking Trails' },
      { type: 'nature', name: 'Wildlife Viewing' },
      { type: 'parking', name: 'Parking' }
    ]
  }
];

// Quantitative scoring attributes for each park 
// WE NEED TO UPDATE THIS DATA BASED ON REAL INFO
const parkAttributes: Record<string, ParkAttributes> = {
  liberty: { runningTrails: 7, dogFriendly: 7, picnicFacilities: 5, playground: 4, sportsFields: 5, natureSensitivity: 2, waterAccess: 2, parking: 5, accessibility: 5, bikingTrails: 4, openSpace: 5, shelters: 4 },
  havener: { runningTrails: 2, dogFriendly: 4, picnicFacilities: 4, playground: 5, sportsFields: 1, natureSensitivity: 3, waterAccess: 0, parking: 4, accessibility: 5, bikingTrails: 2, openSpace: 3, shelters: 2 },
  'big-bear': { runningTrails: 3, dogFriendly: 4, picnicFacilities: 3, playground: 4, sportsFields: 5, natureSensitivity: 2, waterAccess: 0, parking: 5, accessibility: 4, bikingTrails: 3, openSpace: 5, shelters: 3 },
  hyatts: { runningTrails: 2, dogFriendly: 4, picnicFacilities: 5, playground: 4, sportsFields: 4, natureSensitivity: 2, waterAccess: 0, parking: 4, accessibility: 4, bikingTrails: 2, openSpace: 4, shelters: 5 },
  patriot: { runningTrails: 4, dogFriendly: 5, picnicFacilities: 3, playground: 1, sportsFields: 6, natureSensitivity: 0, waterAccess: 1, parking: 3, accessibility: 3, bikingTrails: 0, openSpace: 4, shelters: 2 },
  wedgewood: { runningTrails: 2, dogFriendly: 4, picnicFacilities: 2, playground: 5, sportsFields: 3, natureSensitivity: 2, waterAccess: 0, parking: 3, accessibility: 4, bikingTrails: 2, openSpace: 4, shelters: 1 },
  'smith-preserve': { runningTrails: 5, dogFriendly: 4, picnicFacilities: 1, playground: 0, sportsFields: 0, natureSensitivity: 5, waterAccess: 3, parking: 3, accessibility: 2, bikingTrails: 4, openSpace: 3, shelters: 0 }
};

/* -------------------------------------------------------------------------- */
/*                         RECOMMENDATION RESULT TYPE                          */
/* -------------------------------------------------------------------------- */

// Represents a scored recommendation returned to the UI
interface MatchScore {
  parkId: string;
  parkName: string;
  score: number;
  matchReason: string;
  matchedFeatures: string[];
}

/* -------------------------------------------------------------------------- */
/*                     NATURAL LANGUAGE ACTIVITY ENGINE                        */
/* -------------------------------------------------------------------------- */

// Maps activities to:
// - weighted park attributes
// - extensive synonym lists for NLP-style matching
const ACTIVITY_KEYWORDS: Record<string, { weights: Record<string, number>; synonyms: string[] }> = {
  run: {
    weights: { runningTrails: 5, parking: 2, accessibility: 3, dogFriendly: 1 },
    synonyms: ['running', 'jog', 'jogging', 'exercise', 'workout', 'cardio', 'trail', 'runner', 'jogs', 'sprint', 'sprinting', 'distance', 'marathon', 'training', 'pace', 'mile', 'miles', '5k', '10k']
  },
  dog: {
    weights: { dogFriendly: 5, runningTrails: 3, parking: 3, playground: -1, openSpace: 3 },
    synonyms: ['dogs', 'puppy', 'puppies', 'pet', 'pets', 'canine', 'walk dog', 'dog walk', 'pup', 'doggy', 'doggie', 'fur baby', 'pooch', 'hound', 'retriever', 'labrador', 'german shepherd', 'poodle', 'terrier', 'bulldog']
  },
  picnic: {
    weights: { picnicFacilities: 5, parking: 3, playground: 2, accessibility: 2, shelters: 4, openSpace: 3 },
    synonyms: ['lunch', 'eat', 'food', 'meal', 'outdoor dining', 'bbq', 'grill', 'dining', 'snack', 'breakfast', 'dinner', 'feast', 'cookout', 'barbecue', 'blanket', 'basket', 'table', 'pavilion', 'covered']
  },
  family: {
    weights: { playground: 5, picnicFacilities: 4, parking: 4, accessibility: 4, sportsFields: 2, shelters: 3 },
    synonyms: ['families', 'kids', 'children', 'kid', 'child', 'toddler', 'baby', 'family-friendly', 'youngster', 'infant', 'preschool', 'kindergarten', 'elementary', 'little ones', 'youth', 'juvenile', 'son', 'daughter', 'grandkids', 'nephew']
  },
  sports: {
    weights: { sportsFields: 5, parking: 3, accessibility: 3, openSpace: 4 },
    synonyms: ['sport', 'soccer', 'football', 'basketball', 'baseball', 'athletic', 'game', 'play', 'tennis', 'volleyball', 'lacrosse', 'frisbee', 'disc', 'kickball', 'softball', 'field', 'court', 'practice', 'team', 'league']
  },
  nature: {
    weights: { natureSensitivity: 5, runningTrails: 3, waterAccess: 2, accessibility: 1 },
    synonyms: ['natural', 'wildlife', 'wilderness', 'flora', 'fauna', 'birds', 'birdwatching', 'trees', 'forest', 'woods', 'preserve', 'conservation', 'eco', 'environment']
  },
  water: {
    weights: { waterAccess: 5, natureSensitivity: 3, parking: 3, picnicFacilities: 2 },
    synonyms: ['lake', 'pond', 'creek', 'stream', 'fish', 'fishing', 'waterfront', 'swim', 'swimming', 'river', 'wade', 'wading', 'splash', 'kayak', 'boat', 'boating', 'shore', 'beach', 'aquatic', 'angling']
  },
  hike: {
    weights: { runningTrails: 5, natureSensitivity: 4, accessibility: 1, parking: 2, bikingTrails: 2 },
    synonyms: ['hiking', 'walk', 'walking', 'stroll', 'trek', 'trekking', 'explore', 'wander', 'ramble', 'trail walk', 'nature walk', 'backpack', 'backpacking', 'expedition', 'adventure', 'pathway', 'footpath', 'traverse', 'roam', 'meander']
  },
  playground: {
    weights: { playground: 5, parking: 3, picnicFacilities: 3, accessibility: 4 },
    synonyms: ['play', 'swing', 'swings', 'slide', 'slides', 'playarea', 'playset', 'jungle gym', 'monkey bars', 'seesaw', 'merry-go-round', 'sandbox', 'climber', 'playstructure', 'equipment', 'toy', 'climbing', 'playing', 'recess', 'playdate']
  },
  relax: {
    weights: { picnicFacilities: 4, natureSensitivity: 4, parking: 3, accessibility: 3, shelters: 3 },
    synonyms: ['relaxing', 'chill', 'unwind', 'rest', 'leisure', 'lounge', 'sit', 'meditate', 'meditation', 'yoga', 'zen', 'destress', 'decompress', 'recharge', 'peace', 'serenity', 'solitude', 'contemplation']
  },
  bike: {
    weights: { bikingTrails: 5, runningTrails: 3, parking: 3, accessibility: 2, openSpace: 2 },
    synonyms: ['biking', 'bicycle', 'cycling', 'cycle', 'ride', 'riding', 'pedal', 'pedaling', 'cyclist', 'mountain bike', 'road bike', 'bmx', 'bike ride', 'bike trail', 'two wheels', 'wheeling', 'cruising', 'spin', 'velocipede', 'tandem']
  },
  event: {
    weights: { openSpace: 5, parking: 4, accessibility: 4, shelters: 3, sportsFields: 3 },
    synonyms: ['events', 'gathering', 'party', 'celebration', 'festival', 'reunion', 'meetup', 'get-together', 'assembly', 'function', 'occasion', 'ceremony', 'program', 'activity', 'social', 'community', 'group', 'organization', 'club', 'meeting']
  },
  exercise: {
    weights: { runningTrails: 4, sportsFields: 4, openSpace: 3, parking: 2, accessibility: 3, bikingTrails: 3 },
    synonyms: ['exercising', 'fitness', 'training', 'physical activity', 'active', 'conditioning', 'movement', 'health', 'wellness', 'gym', 'outdoor gym', 'calisthenics', 'aerobics', 'stretching', 'warmup', 'cooldown', 'bodyweight', 'strength']
  },
  photography: {
    weights: { natureSensitivity: 5, waterAccess: 3, runningTrails: 2, parking: 3 },
    synonyms: ['photo', 'photos', 'photograph', 'picture', 'pictures', 'camera', 'shoot', 'photoshoot', 'scenic photos', 'landscape', 'portrait', 'snapshot', 'capture', 'imaging', 'lens', 'instagram', 'selfie', 'pics', 'photography', 'photographer']
  },
  shelter: {
    weights: { shelters: 5, picnicFacilities: 4, parking: 3, accessibility: 3 },
    synonyms: ['shelters', 'pavilion', 'pavilions', 'covered area', 'shade', 'covered', 'roof', 'canopy', 'gazebo', 'pergola', 'awning', 'cover', 'rain protection', 'sun protection', 'reserved space', 'rental', 'booking', 'reservation', 'indoor-outdoor', 'structure']
  },
  accessible: {
    weights: { accessibility: 5, parking: 4, picnicFacilities: 3, playground: 3 },
    synonyms: ['accessibility', 'wheelchair', 'handicap', 'ada', 'disability', 'disabled', 'mobility', 'paved', 'flat', 'easy access', 'ramp', 'ramped', 'barrier-free', 'universal design', 'inclusive', 'stroller', 'walker', 'cane', 'elderly', 'senior']
  },
  scenic: {
    weights: { natureSensitivity: 5, waterAccess: 3, runningTrails: 2, openSpace: 3 },
    synonyms: ['scenery', 'view', 'views', 'vista', 'panorama', 'landscape', 'picturesque', 'beautiful', 'pretty', 'gorgeous', 'breathtaking', 'stunning', 'photogenic', 'aesthetic', 'overlook', 'lookout', 'vantage', 'sightseeing', 'natural beauty', 'pristine']
  },
  open: {
    weights: { openSpace: 5, sportsFields: 3, parking: 2, accessibility: 3 },
    synonyms: ['open space', 'spacious', 'field', 'fields', 'lawn', 'grass', 'meadow', 'clearing', 'expanse', 'wide open', 'roomy', 'uncrowded', 'spread out', 'large area', 'big', 'vast', 'expansive', 'room', 'space', 'area']
  },
  parking: {
    weights: { parking: 5, accessibility: 3 },
    synonyms: ['park', 'lot', 'parking lot', 'car', 'vehicle', 'parking space', 'parking area', 'easy parking', 'ample parking', 'good parking', 'convenient', 'close parking', 'nearby parking', 'accessible parking', 'drive', 'driving', 'automobile', 'transportation', 'access', 'entrance']
  },
  quiet: {
    weights: { natureSensitivity: 5, waterAccess: 2, openSpace: -2, sportsFields: -2 },
    synonyms: ['quietness', 'silent', 'silence', 'tranquil', 'tranquility', 'peaceful', 'calm', 'still', 'hushed', 'secluded', 'isolated', 'private', 'remote', 'away', 'hidden', 'undisturbed', 'solitary', 'retreat', 'sanctuary', 'escape', 'serene']
  }
};

const ACTIVITY_REGEX_MAP = Object.fromEntries(
  Object.entries(ACTIVITY_KEYWORDS).map(([key, config]) => {
    const allTerms = [key, ...config.synonyms];
    return [key, new RegExp(`\\b(${allTerms.join('|')})\\b`, 'gi')];
  })
);

  // ============================================================================
  // SCORING ALGORITHM
  // ============================================================================
  
  /**
   * Calculate match scores for all parks based on user query
   * 
   * Algorithm:
   * 1. Parse query for activity keywords and their synonyms
   * 2. For each park, calculate weighted scores based on matched activities
   * 3. Apply synergy bonus for multiple matched activities
   * 4. Sort parks by score and return top matches
   * 
   * @param query - User's natural language search query
   * @returns Array of parks with match scores, sorted by relevance
   */

/**
 * Calculate match scores for all parks based on user query
 */
const calculateParkScore = (query: string): MatchScore[] => {
  const lowerQuery = query.toLowerCase();
  
  // First pass: collect all matches with their counts
  const allMatches = new Map<string, number>();

  for (const [keyword, regex] of Object.entries(ACTIVITY_REGEX_MAP)) {
    regex.lastIndex = 0;
    const matches = lowerQuery.match(regex);
    if (matches) {
      allMatches.set(keyword, matches.length);
    }
  }

  // Second pass: Deduplicate overlapping keywords by keeping the more specific one
  const matchedActivities = new Map<string, number>();

  // Define keyword specificity (more specific = higher priority)
  const specificityMap: Record<string, number> = {
    run: 10,
    bike: 10,
    hike: 10,
    dog: 10,
    picnic: 10,
    family: 10,
    sports: 10,
    water: 10,
    playground: 10,
    shelter: 10,
    accessible: 10,
    scenic: 10,
    open: 10,
    parking: 10,
    photography: 10,
    
    exercise: 5,     // Less specific than 'run'
    nature: 8,       // Less specific than 'scenic'
    relax: 8,        // Medium specificity
    quiet: 9,        // More specific
    event: 7,        // Medium specificity
  };

  // Group overlapping keywords
  const overlappingGroups = [
    ['run', 'exercise', 'hike'],   // All share 'trail', 'workout'
    ['bike', 'exercise'],           // Both share 'workout'
    ['nature', 'quiet', 'relax', 'scenic'],  // All share 'peaceful', 'tranquil', 'beautiful'
    ['picnic', 'shelter'],          // Both share 'pavilion', 'covered'
    ['family', 'playground'],       // Both share 'kids', 'children'
    ['parking', 'accessible'],      // Both share 'easy parking', 'convenient'
    ['sports', 'event'],          // Both share 'field', 'game'
    ['water', 'nature']           // Both share 'outdoors', 'natural'
  ];

  const used = new Set<string>();

  for (const group of overlappingGroups) {
    const matchedInGroup = group.filter(k => allMatches.has(k));
    if (matchedInGroup.length > 1) {
      // Multiple keywords in this group matched - keep most specific
      const best = matchedInGroup.sort((a, b) => 
        (specificityMap[b] || SCORING_CONFIG.DEFAULT_SPECIFICITY) - (specificityMap[a] || SCORING_CONFIG.DEFAULT_SPECIFICITY)
      )[0];
      matchedActivities.set(best, allMatches.get(best)!);
      used.add(best);
    } else if (matchedInGroup.length === 1) {
      const k = matchedInGroup[0];
      matchedActivities.set(k, allMatches.get(k)!);
      used.add(k);
    }
  }

  // Add non-overlapping keywords
  for (const [keyword, count] of allMatches.entries()) {
    if (!used.has(keyword)) {
      matchedActivities.set(keyword, count);
    }
  }

  // Score each park
  const scores = parks.map(park => {
    const attrs = parkAttributes[park.id];
    if (!attrs) return null;

    let score = 0;
    let maxScore = 0;
    const matched: string[] = [];

    if (matchedActivities.size > 0) {
      // Calculate weighted score for matched activities
      for (const [activity, frequency] of matchedActivities.entries()) {
        const config = ACTIVITY_KEYWORDS[activity];
        let activityScore = 0;
        let activityMax = 0;
        
        for (const [attr, weight] of Object.entries(config.weights)) {
          const value = attrs[attr as keyof ParkAttributes] || 0;
          if (weight > 0) {
            activityScore += (value / SCORING_CONFIG.MAX_ATTRIBUTE_VALUE) * weight * frequency;
            activityMax += weight * frequency;
          } else {
            // Negative weight: penalize high values
            activityScore += ((SCORING_CONFIG.MAX_ATTRIBUTE_VALUE - value) / SCORING_CONFIG.MAX_ATTRIBUTE_VALUE) * Math.abs(weight) * frequency;
            activityMax += Math.abs(weight) * frequency;
          }
        }
        
        // Always count the activity score toward the total
        score += activityScore;
        maxScore += activityMax;

        // Only show in "matched" list if it significantly contributed
        if (activityScore > SCORING_CONFIG.MIN_CONTRIBUTION_THRESHOLD * activityMax) {
          matched.push(activity);
        }
      }
      
      // Convert to percentage (0-100)
      score = maxScore > 0 ? (score / maxScore) * 100 : 0;
    } else {
      // Fallback for vague queries: Use a balanced "general appeal" formula
      
      // Amenity diversity score
      const uniqueAmenityTypes = new Set(park.amenities.map(a => a.type)).size;
      const diversityScore = (uniqueAmenityTypes / SCORING_CONFIG.MAX_AMENITY_TYPES) * SCORING_CONFIG.FALLBACK_DIVERSITY_WEIGHT;
      
      // Facility quality score - sum of top attributes
      const topAttributes: (keyof ParkAttributes)[] = [
        'parking', 'accessibility', 'playground', 'picnicFacilities', 'runningTrails'
      ];
      const qualityScore = topAttributes.reduce((sum, attr) => 
        sum + (attrs[attr] || 0), 0
      ) / (SCORING_CONFIG.MAX_ATTRIBUTE_VALUE * topAttributes.length) * SCORING_CONFIG.FALLBACK_QUALITY_WEIGHT;
      
      // Size/versatility bonus - total amenity count
      const sizeScore = Math.min(park.amenities.length / SCORING_CONFIG.MAX_AMENITIES_FOR_SIZE, 1) * SCORING_CONFIG.FALLBACK_SIZE_WEIGHT;
      
      score = diversityScore + qualityScore + sizeScore;
    }

    return {
      parkId: park.id,
      parkName: park.name,
      score: Math.round(score),
      matchReason: matched.length > 0 
        ? `Good for ${matched.slice(0, SCORING_CONFIG.MAX_FEATURES_IN_REASON).join(' and ')}`
        : 'General-purpose park',
      matchedFeatures: matched
    };
  }).filter((s): s is MatchScore => s !== null);

  // Normalize scores if any exceed 100
  const maxScore = Math.max(...scores.map(s => s.score));
  if (maxScore > 100) {
    const scaleFactor = maxScore / 100;
    scores.forEach(s => {
      s.score = Math.round(s.score / scaleFactor);
    });
  }

  // Sort by score, then by name for stability
  return scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.parkName.localeCompare(b.parkName);
  });
};

/* -------------------------------------------------------------------------- */
/*                             MAIN COMPONENT                                  */
/* -------------------------------------------------------------------------- */

export default function AIParkHelperPage() {
  // Toast notification hook for user feedback
  const { toast } = useToast();
  
  // Component state management
  const [query, setQuery] = useState('');                              // User's search query
  const [recommendations, setRecommendations] = useState<MatchScore[]>([]); // Park match results
  const [isSearching, setIsSearching] = useState(false);               // Loading state
  const [hasSearched, setHasSearched] = useState(false);               // Whether user has performed a search

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle search button click
   * Validates input, performs scoring, and displays results
   */
  const handleSearch = () => {
    // Validate that user entered something
    if (!query.trim()) {
      toast({
        title: 'Please enter your interests',
        description: 'Tell us what you like to do at parks!',
        variant: 'destructive',
      });
      return;
    }

     // Show loading state
    setIsSearching(true);
    setHasSearched(true);

    // If you are reading this then don't remove the timeout :)
    // Simulates processing delay for better UX
    setTimeout(() => {
      const results = calculateParkScore(query);
      setRecommendations(results);
      setIsSearching(false);

      // Show success notification
      toast({
        title: 'Analysis Complete',
        description: 'Here are your personalized park recommendations!',
      });
    }, 1000);
  };

  // Handle Enter key press in input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Layout>
      <div className="container py-8 max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            Park Selector
          </h1>
          <p className="text-muted-foreground">
            Discover the perfect park for your needs. Tell us what you want to do, and we'll recommend the best parks in Liberty Township.
          </p>
        </div>

        <Card className="mb-8 border-2">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  What would you like to do? (e.g., "run with my dog and have a picnic")
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tell me about your ideal park visit..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isSearching ? 'Analyzing...' : 'Find Parks'}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'I want to run with my dog',
                    'Family day with kids',
                    'Peaceful nature walk',
                    'Sports and recreation',
                    'Picnic and relaxation',
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => {
                        setQuery(example);
                        const results = calculateParkScore(example);
                        setRecommendations(results);
                        setHasSearched(true);
                      }}
                      className="px-3 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasSearched && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Your Personalized Recommendations</h2>

            {recommendations.length > 0 ? (
              <div className="grid gap-4">
                {recommendations.map((rec, index) => {
                  const park = parks.find((p) => p.id === rec.parkId);
                  if (!park) return null;

                  return (
                    <div
                      key={rec.parkId}
                      className={`overflow-hidden transition-all hover:shadow-lg rounded-lg border bg-card ${index === 0 ? 'border-2 border-primary bg-primary/5' : ''
                        }`}
                    >
                      <div className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold text-foreground">
                                  {rec.parkName}
                                </h3>
                                {index === 0 && (
                                  <Badge className="bg-primary">Top Match</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{park.description}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-4xl font-bold text-primary">{rec.score}%</div>
                              <p className="text-xs text-muted-foreground mt-1">Match</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-700 font-medium">{rec.matchReason}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                                style={{ width: `${rec.score}%` }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div>
                              <p className="text-xs text-muted-foreground">Location</p>
                              <p className="text-sm font-medium flex items-start gap-1 mt-1">
                                <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                                {park.address}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Amenities</p>
                              <p className="text-sm font-medium mt-1">{park.amenities.length} available</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {Array.from(new Set(park.amenities.map((a) => a.type)))
                              .slice(0, 4)
                              .map((amenityType) => (
                                <Badge key={amenityType} variant="secondary" className="text-xs">
                                  {amenityType.replace('-', ' ')}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-12 text-center">
                <p className="text-muted-foreground">No parks found for your search. Try different keywords!</p>
              </div>
            )}

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Why These Recommendations?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Our Park Selector analyzes your interests and matches them against Liberty Township's 7 parks. Each park is scored based on its amenities and suitability for your activities.
                </p>
                <p>
                  We consider factors like running trails, dog-friendliness, picnic areas, sports fields, water access, and more to give you personalized recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {!hasSearched && (
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Personalized',
                description: 'Get tailored recommendations based on your specific interests and preferences.',
              },
              {
                title: 'Comprehensive',
                description: 'We analyze all 7 parks in Liberty Township to find the best match for you.',
              },
              {
                title: 'Detailed',
                description: 'Each recommendation includes match percentage, amenities, and location details.',
              },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}