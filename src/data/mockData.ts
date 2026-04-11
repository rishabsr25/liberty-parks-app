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
    | "dog-park"
    | "sports"
    | "visitor-center"
    | "greenspace"
    | "nature"
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

export interface ReportCategory {
  id: string;
  name: string;
  icon: string;
}

// Parks Data
export const parks: Park[] = [
  {
    id: "liberty-park",
    name: "Liberty Park",
    description:
      "Our flagship community park featuring sports fields, playgrounds, and walking trails.",
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
        id: "lp-trail-1",
        type: "trail",
        name: "Nature Trail",
        coordinates: { lat: 40.190629, lng: -83.084203 },
      },
      {
        id: "lp-sports-1",
        type: "sports",
        name: "Soccer Fields",
        coordinates: { lat: 40.194506, lng: -83.082400 },
      },
      {
        id: "lp-sports-2",
        type: "sports",
        name: "Tennis Courts",
        coordinates: { lat: 40.192359, lng: -83.085972 },
      },
      {
        id: "lp-sports-3",
        type: "sports",
        name: "Basketball Courts",
        coordinates: { lat: 40.191977, lng: -83.085905 },
      },
      {
        id: "lp-sports-4",
        type: "sports",
        name: "Volleyball Courts",
        coordinates: { lat: 40.191595, lng: -83.085856 },
      },
    ],
  },
  {
    id: "big-bear-park",
    name: "Big Bear Park",
    description:
      "A peaceful park perfect for picnics and family gatherings with beautiful natural scenery.",
    address: "8794 Big Bear Ave, Powell, OH 43065",
    coordinates: { lat: 40.162772, lng: -83.082947 },
    zoom: 17,
    image: bigBearPark,
    amenities: [
      {
        id: "pp-1",
        type: "sports",
        name: "Baseball Diamond",
        coordinates: { lat: 40.163460, lng: -83.082296 },
      },
      {
        id: "pp-2",
        type: "sports",
        name: "Baseball Diamond",
        coordinates: { lat: 40.162335, lng: -83.081340 },
      },
      {
        id: "pp-3",
        type: "sports",
        name: "Baseball Diamond",
        coordinates: { lat: 40.161811, lng: -83.082116 },
      },
    ],
  },
  {
    id: "havener-park",
    name: "Havener Park",
    description:
      "Home to youth sports leagues with multiple soccer and baseball fields.",
    address: "4085 Liberty Rd, Delaware, OH 43015",
    coordinates: { lat: 40.243969, lng: -83.076998 },
    zoom: 16,
    image: havenerPark,
    amenities: [
      {
        id: "lef-sports-1",
        type: "sports",
        name: "Lacrosse Field",
        coordinates: { lat: 40.245381, lng: -83.081942 },
      },
      {
        id: "lef-sports-2",
        type: "sports",
        name: "Soccer Fields",
        coordinates: { lat: 40.245232, lng: -83.080373 },
      },
      {
        id: "lef-bathroom-1",
        type: "visitor-center",
        name: "Visitor Center",
        coordinates: { lat: 40.2412396, lng: -83.0761966 },
      },
      {
        id: "lef-parking-1",
        type: "greenspace",
        name: "Open Greenspace",
        coordinates: { lat: 40.244675, lng: -83.077376 },
      },
    ],
  },
  {
    id: "hyatts-park",
    name: "Hyatts Park",
    description:
      "A dedicated off-leash dog park with separate areas for large and small dogs.",
    address: "2500 Hyatts Road, Delaware, OH 43065",
    coordinates: { lat: 40.216461, lng: -83.0841297 },
    zoom: 18,
    image: hyattsPark,
    amenities: [
      {
        id: "kdp-dogpark-1",
        type: "sports",
        name: "Basketball Court",
        coordinates: { lat: 40.216332, lng: -83.084543 },
      },
      {
        id: "kdp-dogpark-2",
        type: "sports",
        name: "Baseball Field",
        coordinates: { lat: 40.216595, lng: -83.083624 },
      },
      {
        id: "kdp-dogpark-3",
        type: "sports",
        name: "Horseshoe Pit",
        coordinates: { lat: 40.216734, lng: -83.083984 },
      },
      {
        id: "kdp-dogpark-4",
        type: "playground",
        name: "Playground",
        coordinates: { lat: 40.216521, lng: -83.084284 },
      },
    ],
  },
  {
    id: "patriot-park",
    name: "Patriot Park - Bruce Miller Field",
    description:
      "Home to Bruce Miller Field, this 5-acre park features a baseball diamond and open space for recreation.",
    address: "7765 Liberty Road North, Powell, OH 43065",
    coordinates: { lat: 40.188093, lng: -83.075738 }, // Estimated approx location based on address
    zoom: 17,
    image: patriotPark, // Placeholder
    amenities: [
      {
        id: "pp-1",
        type: "sports",
        name: "Baseball Diamond",
        coordinates: { lat: 40.188093, lng: -83.075738 },
      },
    ],
  },
  {
    id: "smith-preserve",
    name: "Smith Preserve at Olentangy Falls",
    description:
      "A 41-acre natural park area along the scenic Olentangy River, home to an eagle's nest and an extensive rookery.",
    address: "Taggart Road, Powell, OH 43065",
    coordinates: { lat: 40.213053, lng: -83.057835 },
    zoom: 17,
    image: smithPark, // Placeholder
    amenities: [
      {
        id: "sp-1",
        type: "nature",
        name: "Smith Preserve",
        coordinates: { lat: 40.212480, lng: -83.058873 },
      },
    ],
  },
  {
    id: "wedgewood-park",
    name: "Wedgewood Park",
    description:
      "A 10-acre community park located on Sawmill Road, offering open green spaces for neighborhood enjoyment.",
    address: "10150 Sawmill Road, Powell, OH 43065",
    coordinates: { lat: 40.150601, lng: -83.094563 }, // Estimated approx location
    zoom: 17,
    image: wedgewoodPark, // Placeholder
    amenities: [
      {
        id: "wp-1",
        type: "greenspace",
        name: "Open Greenspace",
        coordinates: { lat: 40.150601, lng: -83.094563 },
      },
    ],
  },
];

// Report Categories
export const reportCategories: ReportCategory[] = [
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
  bathroom: { label: "Restrooms", icon: "Bath", color: "sky" },
  bench: { label: "Benches", icon: "Armchair", color: "earth" },
  trail: { label: "Trails", icon: "TreePine", color: "forest" },
  parking: { label: "Parking", icon: "Car", color: "bark" },
  playground: { label: "Playground", icon: "Baby", color: "accent" },
  picnic: { label: "Picnic Area", icon: "UtensilsCrossed", color: "earth" },
  "dog-park": { label: "Dog Park", icon: "Dog", color: "moss" },
  sports: { label: "Sports", icon: "Trophy", color: "primary" },
  "visitor-center": { label: "Visitor Center", icon: "Info", color: "primary" },
  greenspace: { label: "Greenspace", icon: "Leaf", color: "moss" },
  nature: { label: "Nature", icon: "TreePine", color: "forest" },
  water: { label: "Water Feature", icon: "Waves", color: "sky" },
};
