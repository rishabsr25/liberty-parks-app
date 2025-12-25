import { Link } from 'react-router-dom';
import { ArrowRight, TreePine, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { icon: TreePine, value: '9', label: 'Parks' },
  { icon: Users, value: '35K+', label: 'Residents' },
  { icon: Heart, value: '100+', label: 'Events/Year' },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-20 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <TreePine className="h-4 w-4" />
            <span>Liberty Township, Ohio</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Discover and Enjoy{' '}
            <span className="text-primary">Liberty Township's Parks</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
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
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
