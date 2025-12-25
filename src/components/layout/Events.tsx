import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const eventFeatures = [
  {
    emoji: '📅',
    title: 'Event Calendar',
    description: 'View daily and seasonal events happening across Liberty Township parks. Each event includes the exact location within the park, time, and description. You can also add your own organized events to the calendar!',
    href: '/calendar',
    gradient: 'from-sky/20 to-primary/20',
  },
  {
    emoji: '🗳️',
    title: 'Community Voting',
    description: 'Participate in annual voting for park improvements! Vote on proposed amenities like pickleball courts, new events, and more. Your voice matters in shaping the parks we all enjoy.',
    href: '/voting',
    gradient: 'from-earth/20 to-primary/20',
  },
];

const Events = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How It Works</h2>

        <div className="space-y-12">
          {eventFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {index % 2 === 0 ? (
                <>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      {feature.emoji} {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <Button asChild variant="outline">
                      <Link to={feature.href}>
                        {feature.title === 'Event Calendar' ? 'Explore Calendar' : 'Vote Now'}
                      </Link>
                    </Button>
                  </div>
                  <div className={`bg-gradient-to-br ${feature.gradient} rounded-lg h-48`}></div>
                </>
              ) : (
                <>
                  <div className={`bg-gradient-to-br ${feature.gradient} rounded-lg h-48`}></div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      {feature.emoji} {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <Button asChild variant="outline">
                      <Link to={feature.href}>
                        {feature.title === 'Event Calendar' ? 'Explore Calendar' : 'Vote Now'}
                      </Link>
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

export default Events;
