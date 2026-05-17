// Mock data for Liberty Township Parks App
import libertyPark from "@/assets/liberty-park.jpg";
import havenerPark from "@/assets/havener-park.jpg";
import bigBearPark from "@/assets/big-bear-park.jpg";
import hyattsPark from "@/assets/hyatts-park.jpg";
import patriotPark from "@/assets/patriot-park.jpg";
import smithPark from "@/assets/smith-park.jpg";
import wedgewoodPark from "@/assets/wedgewood-park.jpg";

export interface Park {
  id: string;
  name: string;
  description: string;
  address: string;
  coordinates: { lat: number; lng: number };
  amenities: Amenity[];
  image?: string;
  zoom?: number;
  bounds?: { north: number; south: number; east: number; west: number };
}

export interface Amenity {
  id: string;
  type:
    | "bathroom"
    | "bench"
    | "trail"
    | "parking"
    | "playground"
    | "picnic"
    | "sports"
    | "baseball"
    | "basketball"
    | "volleyball"
    | "tennis"
    | "cricket"
    | "lacrosse"
    | "soccer"
    | "visitor-center"
    | "greenspace"
    | "nature"
    | "shelter"
    | "fishing"
    | "handball"
    | "picnic-area"
    | "ymca"
    | "water";
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
  category:
    | "sports"
    | "community"
    | "nature"
    | "fitness"
    | "family"
    | "seasonal";
}

// Parks Data
export const parks: Park[] = [
  {
    id: "liberty-park",
    name: "Liberty Park",
    description:
      "Our flagship community park featuring over 115 acres of sport fields, playgrounds, wooded and open walking trails, picnic spots, and a fishing pond.",
    address: "2845 Home Rd, Powell, OH 43065",
    coordinates: { lat: 40.192465, lng: -83.082629 },
    zoom: 16.7,
    image: libertyPark,
    amenities: [
      {
        id: "lp-bathroom-1",
        type: "bathroom",
        name: "Main Restrooms",
        coordinates: { lat: 40.192586, lng: -83.085667 },
      },
      {
        id: "lp-bathroom-2",
        type: "bathroom",
        name: "Seasonal Restrooms",
        coordinates: { lat: 40.191473, lng: -83.081392 },
      },
      {
        id: "lp-bathroom-3",
        type: "bathroom",
        name: "Seasonal Restrooms",
        coordinates: { lat: 40.193614, lng: -83.081609 },
      },
      {
        id: "lp-playground-1",
        type: "playground",
        name: "Kids Playground",
        coordinates: { lat: 40.192741, lng: -83.085913 },
      },
      {
        id: "lp-playground-2",
        type: "playground",
        name: "Kids Playground",
        coordinates: { lat: 40.193771, lng: -83.081407 },
      },
      {
        id: "lp-playground-3",
        type: "playground",
        name: "Every Kid's Playground",
        coordinates: { lat: 40.191731, lng: -83.081905 },
      },

      {
        id: "lp-sports-1",
        type: "soccer",
        name: "Soccer Fields",
        coordinates: { lat: 40.194506, lng: -83.082400 },
      },
      {
        id: "lp-sports-2",
        type: "tennis",
        name: "Tennis Courts",
        coordinates: { lat: 40.192359, lng: -83.085972 },
      },
      {
        id: "lp-sports-3",
        type: "basketball",
        name: "Basketball Courts",
        coordinates: { lat: 40.191977, lng: -83.085905 },
      },
      {
        id: "lp-sports-4",
        type: "volleyball",
        name: "Volleyball Courts",
        coordinates: { lat: 40.191595, lng: -83.085856 },
      },
      {
        id: "lp-baseball-1",
        type: "baseball",
        name: "Baseball Diamond 1",
        coordinates: { lat: 40.194102, lng: -83.081627 },
      },
      {
        id: "lp-baseball-2",
        type: "baseball",
        name: "Baseball Diamond 2",
        coordinates: { lat: 40.193917, lng: -83.080940 },
      },
      {
        id: "lp-baseball-3",
        type: "baseball",
        name: "Baseball Diamond 3",
        coordinates: { lat: 40.193172, lng: -83.081700 },
      },
      {
        id: "lp-baseball-4",
        type: "baseball",
        name: "Baseball Diamond 4",
        coordinates: { lat: 40.193313, lng: -83.081005 },
      },
      {
        id: "lp-parking-1",
        type: "parking",
        name: "Parking",
        coordinates: { lat: 40.192074, lng: -83.085319 },
      },
      {
        id: "lp-parking-2",
        type: "parking",
        name: "Parking",
        coordinates: { lat: 40.193700, lng: -83.083023 },
      },
      {
        id: "lp-parking-3",
        type: "parking",
        name: "Parking",
        coordinates: { lat: 40.190958, lng: -83.082064 },
      },

      {
        id: "lp-shelter-1",
        type: "shelter",
        name: "Reservable Shelter 1",
        coordinates: { lat: 40.193218, lng: -83.084994 },
      },
      {
        id: "lp-shelter-2",
        type: "shelter",
        name: "Reservable Shelter 2",
        coordinates: { lat: 40.193242, lng: -83.085514 },
      },
      {
        id: "lp-shelter-3",
        type: "shelter",
        name: "Reservable Shelter 3",
        coordinates: { lat: 40.193251, lng: -83.085974 },
      },
      {
        id: "lp-shelter-4",
        type: "shelter",
        name: "Reservable Shelter 4",
        coordinates: { lat: 40.191763, lng: -83.085895 },
      },
      {
        id: "lp-fishing-1",
        type: "fishing",
        name: "Fishing Pond",
        coordinates: { lat: 40.192189, lng: -83.081065 },
      },
      {
        id: "lp-handball-1",
        type: "handball",
        name: "Handball Wall",
        coordinates: { lat: 40.192023, lng: -83.086313 },
      },
    ],
    bounds: { north: 40.2010, south: 40.1900, east: -83.0720, west: -83.0960 },
  },
  {
    id: "south-liberty-park",
    name: "South Liberty Park",
    description:
      "This 51 acre soccer park also includes an open trail connecting Downtown Powell and the YMCA, which is home to the new public Blue Jackets Foundation Outdoor Street Hockey Rink.",
    address: "2845 Home Rd, Powell, OH 43065",
    coordinates: { lat: 40.187126, lng: -83.082230 },
    zoom: 17,
    image: libertyPark,
    amenities: [
      {
        id: "slp-cricket-1",
        type: "cricket",
        name: "Cricket Pitch",
        coordinates: { lat: 40.186689, lng: -83.082493 },
      },
      {
        id: "slp-soccer-1",
        type: "soccer",
        name: "Soccer Fields",
        coordinates: { lat: 40.187568, lng: -83.083093 },
      },
      {
        id: "slp-ymca-1",
        type: "ymca",
        name: "YMCA",
        coordinates: { lat: 40.186428, lng: -83.078969 },
      },
    ],
    bounds: { north: 40.1900, south: 40.1840, east: -83.0780, west: -83.0880 },
  },
  {
    id: "big-bear-park",
    name: "Big Bear Park",
    description:
      "A peaceful park with beautiful scenery, perfect for picnics, family gatherings, and home to our newest Little League ballfield.",
    address: "8794 Big Bear Ave, Powell, OH 43065",
    coordinates: { lat: 40.162772, lng: -83.084047 },
    zoom: 17,
    image: bigBearPark,
    amenities: [
      {
        id: "bb-1",
        type: "baseball",
        name: "Baseball Diamond",
        coordinates: { lat: 40.163460, lng: -83.082296 },
      },
      {
        id: "bb-2",
        type: "baseball",
        name: "Baseball Diamond",
        coordinates: { lat: 40.162335, lng: -83.081340 },
      },
      {
        id: "bb-3",
        type: "baseball",
        name: "Baseball Diamond",
        coordinates: { lat: 40.161811, lng: -83.082116 },
      },
      {
        id: "bb-4",
        type: "baseball",
        name: "Baseball Diamond",
        coordinates: { lat: 40.163761, lng: -83.085963 },
      },
      {
        id: "bb-5",
        type: "parking",
        name: "Parking",
        coordinates: { lat: 40.163036, lng: -83.087281 },
      },
    ],
    bounds: { north: 40.1680, south: 40.1565, east: -83.0760, west: -83.0900 },
  },
  {
    id: "havener-park",
    name: "Havener Park",
    description:
      "With over 94 acres of greenspace, Havener is home to youth soccer and lacrosse fields and a wooded, nature walk which connects to Deer Haven Park and the Nature Center.",
    address: "4085 Liberty Rd, Delaware, OH 43015",
    coordinates: { lat: 40.243269, lng: -83.076998 },
    zoom: 16,
    image: havenerPark,
    amenities: [
      {
        id: "lef-sports-1",
        type: "lacrosse",
        name: "Lacrosse Field",
        coordinates: { lat: 40.245381, lng: -83.081942 },
      },
      {
        id: "lef-sports-2",
        type: "soccer",
        name: "Soccer Fields",
        coordinates: { lat: 40.245232, lng: -83.080373 },
      },
      {
        id: "lef-bathroom-1",
        type: "visitor-center",
        name: "Deer Haven Park Nature Center",
        coordinates: { lat: 40.2412396, lng: -83.0761966 },
      },
      {
        id: "lef-greenspace-1",
        type: "greenspace",
        name: "Open Greenspace",
        coordinates: { lat: 40.244675, lng: -83.077376 },
      },
      {
        id: "lef-parking-1",
        type: "parking",
        name: "Parking",
        coordinates: { lat: 40.241722, lng: -83.075922 },
      },
      {
        id: "lef-parking-2",
        type: "parking",
        name: "Parking",
        coordinates: { lat: 40.245048, lng: -83.081195 },
      },
      {
        id: "lef-trail-1",
        type: "trail",
        name: "Wooded Trails",
        coordinates: { lat: 40.243617, lng: -83.075620 },
      },
    ],
    bounds: { north: 40.2720, south: 40.2155, east: -83.0480, west: -83.1100 },
  },
  {
    id: "hyatts-park",
    name: "Hyatts Park",
    description:
      "This small neighborhood park is the perfect picnic spot, with a playground, horseshoe pits and picnic area. It also hosts Little League ballgames.",
    address: "2500 Hyatts Road, Delaware, OH 43065",
    coordinates: { lat: 40.216461, lng: -83.0841297 },
    zoom: 18.7,
    image: hyattsPark,
    amenities: [
      {
        id: "hp-basketball-1",
        type: "basketball",
        name: "Basketball Court",
        coordinates: { lat: 40.216428, lng: -83.083926 },
      },
      {
        id: "hp-baseball-1",
        type: "baseball",
        name: "Baseball Field",
        coordinates: { lat: 40.216595, lng: -83.083624 },
      },
      {
        id: "hp-horseshoe-1",
        type: "sports",
        name: "Horseshoe Pit",
        coordinates: { lat: 40.216734, lng: -83.083984 },
      },
      {
        id: "hp-playground-1",
        type: "playground",
        name: "Playground",
        coordinates: { lat: 40.216205, lng: -83.083940 },
      },
      {
        id: "hp-parking-1",
        type: "parking",
        name: "Parking",
        coordinates: { lat: 40.216334, lng: -83.084526 },
      },
      {
        id: "hp-shelter-1",
        type: "shelter",
        name: "Reservable Shelter",
        coordinates: { lat: 40.216324, lng: -83.084185 },
      },
    ],
    bounds: { north: 40.2200, south: 40.2128, east: -83.0790, west: -83.0900 },
  },
  {
    id: "patriot-park",
    name: "Patriot Park - Bruce Miller Field",
    description:
      'This 5-acre community park is home to the "Bruce Miller Memorial" baseball field and open space for recreation.',
    address: "7765 Liberty Road North, Powell, OH 43065",
    coordinates: { lat: 40.187793, lng: -83.075738 }, // Estimated approx location based on address
    zoom: 17.7,
    image: patriotPark, // Placeholder
    amenities: [
      {
        id: "pp-1",
        type: "baseball",
        name: "Baseball Diamond",
        coordinates: { lat: 40.188093, lng: -83.075738 },
      },
      {
        id: "pp-2",
        type: "parking",
        name: "Parking",
        coordinates: { lat: 40.187053, lng: -83.075983 },
      },
    ],
    bounds: { north: 40.1920, south: 40.1835, east: -83.0700, west: -83.0815 },
  },
  {
    id: "smith-preserve",
    name: "Smith Preserve at Olentangy Falls",
    description:
      "This hidden park gem is 41 acres of undeveloped woodland and prairie, making it the perfect spot to view a blue heron rookery with over 50 nests. If you are lucky, you might even see our resident bald eagle working on its nest!",
    address: "Taggart Road, Powell, OH 43065",
    coordinates: { lat: 40.213053, lng: -83.057835 },
    zoom: 17,
    image: smithPark, // Placeholder
    amenities: [
      {
        id: "sp-1",
        type: "nature",
        name: "Nature Preserve Area",
        coordinates: { lat: 40.212480, lng: -83.058873 },
      },
    ],
    bounds: { north: 40.2175, south: 40.2080, east: -83.0510, west: -83.0660 },
  },
  {
    id: "wedgewood-park",
    name: "Wedgewood Park",
    description:
      "A 10-acre community park located on Sawmill Road, offering open greenspace and a short walking trail.",
    address: "10150 Sawmill Road, Powell, OH 43065",
    coordinates: { lat: 40.150601, lng: -83.094563 }, // Estimated approx location
    zoom: 17.6,
    image: wedgewoodPark, // Placeholder
    amenities: [
      {
        id: "wp-1",
        type: "picnic-area",
        name: "Picnic Area",
        coordinates: { lat: 40.150601, lng: -83.094563 },
      },
    ],
    bounds: { north: 40.1550, south: 40.1455, east: -83.0880, west: -83.1010 },
  },
];

// Report Categories
export const reportCategories = [
  { id: "maintenance", name: "Maintenance Needed", icon: "Wrench" },
  { id: "safety", name: "Safety Concern", icon: "AlertTriangle" },
  { id: "cleanliness", name: "Cleanliness Issue", icon: "Trash2" },
  { id: "equipment", name: "Broken Equipment", icon: "XCircle" },
  { id: "lighting", name: "Lighting Problem", icon: "Lightbulb" },
  { id: "other", name: "Other", icon: "HelpCircle" },
];

// Amenity type labels and icons
export const amenityInfo: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  bathroom: { label: "Restrooms", icon: "Toilet", color: "sky" },
  bench: { label: "Benches", icon: "Armchair", color: "earth" },
  trail: { label: "Trails", icon: "TreePine", color: "forest" },
  parking: { label: "Parking", icon: "Car", color: "black" },
  playground: { label: "Playground", icon: "Baby", color: "accent" },
  picnic: { label: "Picnic Area", icon: "UtensilsCrossed", color: "earth" },
  "picnic-area": { label: "Picnic Area", icon: "TbPicnicTable", color: "yellow" },
  ymca: { label: "YMCA", icon: "Dumbbell", color: "ymca-blue" },
  sports: { label: "Sports", icon: "Trophy", color: "primary" },
  baseball: {
    label: "Baseball Diamond",
    icon: "CiBaseball",
    color: "baseball",
  },
  basketball: {
    label: "Basketball Court",
    icon: "IoIosBasketball",
    color: "orange",
  },
  volleyball: {
    label: "Volleyball Court",
    icon: "Volleyball",
    color: "sand",
  },
  tennis: {
    label: "Tennis Court",
    icon: "MdOutlineSportsTennis",
    color: "lime",
  },
  cricket: {
    label: "Cricket Pitch",
    icon: "MdOutlineSportsCricket",
    color: "white",
  },
  lacrosse: {
    label: "Lacrosse Field",
    icon: "GiFishingNet",
    color: "purple",
  },
  soccer: {
    label: "Soccer Field",
    icon: "GiSoccerBall",
    color: "black",
  },
  "visitor-center": {
    label: "Deer Haven Park Nature Center",
    icon: "Info",
    color: "primary",
  },
  greenspace: { label: "Greenspace", icon: "Leaf", color: "moss" },
  nature: { label: "Nature", icon: "TreePine", color: "forest" },
  shelter: { label: "Shelter", icon: "FaPersonShelter", color: "shelter" },
  fishing: {
    label: "Fishing Pond",
    icon: "GiFishingPole",
    color: "ocean-blue",
  },
  handball: { label: "Handball Wall", icon: "TbPlayHandball", color: "red" },
  water: { label: "Water Feature", icon: "Waves", color: "sky" },
};
