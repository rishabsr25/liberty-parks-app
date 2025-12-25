import { Link } from 'react-router-dom';
import { ArrowRight, Map, Calendar, Vote, Sparkles, TreePine, Users, Heart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout';

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
  },
  {
    icon: Vote,
    title: 'Community Voting',
    description: 'Have your say! Vote on upcoming park improvements and new activities for your community.',
    color: 'bg-earth/20 text-earth',
    href: '/voting',
  },
  {
    icon: Sparkles,
    title: 'AI Park Helper',
    description: 'Get personalized park recommendations based on your preferences and interests. Discover the perfect park for you.',
    color: 'bg-accent/20 text-accent',
    href: '/ai-helper',
  },
  {
    icon: AlertCircle,
    title: 'Park Watch',
    description: 'Report park issues and help keep our community spaces safe and clean.',
    color: 'bg-red/20 text-red-600',
    href: '/report',
  },
];

const stats = [
  { icon: TreePine, value: '8', label: 'Parks' },
  { icon: Users, value: '35K+', label: 'Residents' },
  { icon: Heart, value: '100+', label: 'Events/Year' },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
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

      {/* Features Section */}
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {features.map((feature, index) => (
              <Link
                key={feature.title}
                to={feature.href}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:scale-105"
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

      {/* Features Detailed Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How It Works</h2>
          
          <div className="space-y-12">
            {/* Feature 1: Calendar */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">📅 Event Calendar</h3>
                <p className="text-muted-foreground mb-4">
                  View daily and seasonal events happening across Liberty Township parks. Each event includes the exact location within the park, time, and description. 
                  You can also add your own organized events to the calendar!
                </p>
                <Button asChild variant="outline">
                  <Link to="/calendar">Explore Calendar</Link>
                </Button>
              </div>
              <div className="bg-gradient-to-br from-sky/20 to-primary/20 rounded-lg h-48"></div>
            </div>

            {/* Feature 2: Voting */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-gradient-to-br from-earth/20 to-primary/20 rounded-lg h-48"></div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">🗳️ Community Voting</h3>
                <p className="text-muted-foreground mb-4">
                  Participate in annual voting for park improvements! Vote on proposed amenities like pickleball courts, 
                  new events, and more. Your voice matters in shaping the parks we all enjoy.
                </p>
                <Button asChild variant="outline">
                  <Link to="/voting">Vote Now</Link>
                </Button>
              </div>
            </div>

            {/* Feature 3: Map */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">🗺️ Interactive Maps</h3>
                <p className="text-muted-foreground mb-4">
                  Explore detailed maps of each park showing amenities like bathrooms, parking, trails, playgrounds, and more. 
                  Find exactly what you need for your visit.
                </p>
                <Button asChild variant="outline">
                  <Link to="/map">View Maps</Link>
                </Button>
              </div>
              <div className="bg-gradient-to-br from-forest-light/20 to-primary/20 rounded-lg h-48"></div>
            </div>

            {/* Feature 4: AI Helper */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg h-48"></div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">✨ AI Park Helper</h3>
                <p className="text-muted-foreground mb-4">
                  Tell us what you want to do, and our AI will recommend the perfect park! Whether you want to run with your dog, 
                  have a family picnic, or explore nature, get personalized recommendations with match percentages.
                </p>
                <Button asChild variant="outline">
                  <Link to="/ai-helper">Get Recommendations</Link>
                </Button>
              </div>
            </div>

            {/* Feature 5: Report */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">⚠️ Park Watch</h3>
                <p className="text-muted-foreground mb-4">
                  Report issues like broken equipment, maintenance problems, or safety concerns. Help park rangers keep 
                  our parks safe and clean by quickly notifying them of any problems you notice.
                </p>
                <Button asChild variant="outline">
                  <Link to="/report">Report Issue</Link>
                </Button>
              </div>
              <div className="bg-gradient-to-br from-red/20 to-primary/20 rounded-lg h-48"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Ready to Explore?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Start discovering the beautiful parks in your community today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/map">
                  Open Interactive Map
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/ai-helper">Get AI Recommendations</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
