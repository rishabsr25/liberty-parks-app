import { Link } from 'react-router-dom';
import { ArrowRight, TreePine, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroPark from "@/assets/hero-park.jpg";

const stats = [
  { icon: TreePine, value: '8', label: 'Parks' },
  { icon: Users, value: '35K+', label: 'Residents' },
  { icon: Heart, value: '100+', label: 'Events/Year' },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroPark}
          alt="Aerial view of Liberty Township parks"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/50 to-foreground/70" />
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm px-4 py-1.5 text-sm text-primary-foreground">
            <TreePine className="h-4 w-4" />
            <span>Liberty Township, Ohio</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Discover and Enjoy{' '}
            <span className="text-accent-foreground">Liberty Township's Parks</span>
          </h1>

          <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
            Plan your visit, explore events, report issues, vote on improvements, and get AI-powered park recommendations.
            Your complete guide to the best outdoor experiences in our community.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/map">
                Try the Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/calendar">View Events</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                <stat.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-2xl font-bold text-primary-foreground md:text-3xl">{stat.value}</div>
              <div className="text-sm text-primary-foreground/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
