import { Link } from 'react-router-dom';
import { ArrowRight, Map, Calendar, Vote, AlertCircle, Megaphone } from 'lucide-react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { CALENDAR_ENABLED, PARK_SELECTOR_ENABLED } from '@/config/features';

const features = [
  {
    icon: Map,
    title: 'Interactive Map',
    description: 'Explore park amenities like restrooms, benches, trails, and parking with our detailed interactive map.',
    color: 'bg-forest-light/20 text-forest',
    href: '/map',
  },
  {
    icon: Calendar,
    title: 'Event Calendar',
    description: 'Stay updated on daily and seasonal park events, from yoga sessions to community festivals. Add your own events!',
    color: 'bg-sky/20 text-sky',
    href: '/calendar',
    requiresCalendar: true,
  },
  {
    icon: Megaphone,
    title: 'Announcements',
    description: 'Stay updated on official news, seasonal programs, and important notices from Liberty Township Parks.',
    color: 'bg-sky/20 text-sky',
    href: '/announcements',
    showWhenCalendarDisabled: true,
  },
  {
    icon: Vote,
    title: 'Community Voting',
    description: 'Have your say! Vote on upcoming park improvements and new activities for your community.',
    color: 'bg-earth/20 text-earth',
    href: '/voting',
  },
  {
    icon: FaMagnifyingGlass,
    title: 'Park Selector',
    description: 'Get personalized park recommendations based on your preferences and interests. Discover the perfect park for you.',
    color: 'bg-accent/20 text-accent',
    href: '/ai-helper',
    requiresParkSelector: true,
  },
  {
    icon: AlertCircle,
    title: 'Park Watch',
    description: 'Report park issues and help keep our community spaces safe and clean.',
    color: 'bg-red-200 text-red-600',
    href: '/report',
  },
].filter((feature) => {
  if (feature.requiresCalendar) return CALENDAR_ENABLED;
  if (feature.showWhenCalendarDisabled) return !CALENDAR_ENABLED;
  if (feature.requiresParkSelector) return PARK_SELECTOR_ENABLED;
  return true;
});

const FeaturedParks = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Powerful Tools for Park Lovers
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore parks with confidence, stay informed, and help shape the future of Liberty Township.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              to={feature.href}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Explore <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedParks;
