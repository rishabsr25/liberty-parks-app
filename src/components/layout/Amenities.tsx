import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const amenities = [
  {
    emoji: '🗺️',
    title: 'Interactive Maps',
    description: 'Explore detailed maps of each park showing amenities like bathrooms, parking, trails, playgrounds, and more. Find exactly what you need for your visit.',
    href: '/map',
    buttonText: 'View Maps',
    gradient: 'from-forest-light/20 to-primary/20',
    reverse: false,
  },
  {
    emoji: '✨',
    title: 'Park Selector',
    description: "Tell us what you want to do, and our AI will recommend the perfect park! Whether you want to run with your dog, have a family picnic, or explore nature, get personalized recommendations with match percentages.",
    href: '/ai-helper',
    buttonText: 'Get Recommendations',
    gradient: 'from-accent/20 to-primary/20',
    reverse: true,
  },
  {
    emoji: '⚠️',
    title: 'Park Watch',
    description: 'Report issues like broken equipment, maintenance problems, or safety concerns. Help park rangers keep our parks safe and clean by quickly notifying them of any problems you notice.',
    href: '/report',
    buttonText: 'Report Issue',
    gradient: 'from-red/20 to-primary/20',
    reverse: false,
  },
];

const Amenities = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="space-y-12">
          {amenities.map((amenity) => (
            <div
              key={amenity.title}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              {!amenity.reverse ? (
                <>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      {amenity.emoji} {amenity.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{amenity.description}</p>
                    <Button asChild variant="outline">
                      <Link to={amenity.href}>{amenity.buttonText}</Link>
                    </Button>
                  </div>
                  <div className={`bg-gradient-to-br ${amenity.gradient} rounded-lg h-48`}></div>
                </>
              ) : (
                <>
                  <div className={`bg-gradient-to-br ${amenity.gradient} rounded-lg h-48`}></div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      {amenity.emoji} {amenity.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{amenity.description}</p>
                    <Button asChild variant="outline">
                      <Link to={amenity.href}>{amenity.buttonText}</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
