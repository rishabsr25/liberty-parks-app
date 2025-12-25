import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Trees, ArrowRight } from "lucide-react";
import libertyPark from "@/assets/liberty-park.jpg";
import havenerPark from "@/assets/havener-park.jpg";
import bigBearPark from "@/assets/big-bear-park.jpg";

const parks = [
  {
    name: "Liberty Park",
    description: "The largest park in Liberty Township with over 2 miles of wooded and open trails, 3 playgrounds (one fully accessible), and restroom facilities. Features 12 soccer fields, 4 baseball/softball fields, basketball courts, tennis courts, handball courts, sand volleyball courts, a stocked fishing pond, and a Tranquility Garden for quiet relaxation.",
    image: libertyPark,
    acres: 118,
    features: ["12 Soccer Fields", "3 Playgrounds", "Fishing Pond", "Tennis Courts", "Basketball Courts", "Tranquility Garden"]
  },
  {
    name: "Havener Park",
    description: "Located approximately 3.5 miles north of Liberty Park at the intersection of Liberty Road and Ford Road. Features 6 athletic fields including 1 lacrosse field and open greenspace. A 1.5 mile trail connects with the Deer Haven Preserve trail system and Visitor's Center.",
    image: havenerPark,
    acres: 93,
    features: ["6 Athletic Fields", "Lacrosse Field", "1.5 Mile Trail", "Open Greenspace"]
  },
  {
    name: "Big Bear Park",
    description: "Located east of Sawmill Parkway next to Press Church Powell Campus. Features a trail that connects to the City of Powell trail system, with plans for a cricket pitch.",
    image: bigBearPark,
    acres: 5,
    features: ["Powell Trail Connection", "Cricket Pitch (TBD)", "Green Space"]
  }
];

const FeaturedParks = () => {
  return (
    <section id="parks" className="py-20 md:py-28 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Trees className="w-4 h-4" />
            Featured Parks
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Discover Our Green Spaces
          </h2>
          <p className="text-muted-foreground text-lg">
            From peaceful nature trails to vibrant community gathering spots, 
            Liberty Township offers parks for every adventure.
          </p>
        </div>

        {/* Parks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parks.map((park, index) => (
            <Card
              key={park.name}
              className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={park.image}
                  alt={`${park.name} - ${park.acres} acres`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{park.acres} Acres</span>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-6">
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                  {park.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {park.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {park.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {park.features.length > 3 && (
                    <span className="px-3 py-1 text-xs font-medium bg-secondary/50 text-secondary-foreground rounded-full">
                      +{park.features.length - 3} more
                    </span>
                  )}
                </div>

                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 group/btn">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Parks
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
export default FeaturedParks;