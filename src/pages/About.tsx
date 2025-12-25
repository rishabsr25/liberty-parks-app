import { TreePine, Users, Calendar, Award, Heart, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { icon: TreePine, value: '12', label: 'Community Parks' },
  { icon: Users, value: '35,000+', label: 'Residents Served' },
  { icon: Calendar, value: '100+', label: 'Annual Events' },
  { icon: Award, value: '15+', label: 'Years of Service' },
];

const parkHighlights = [
  {
    name: 'Liberty Park',
    description: 'Our flagship community park with sports fields, playgrounds, and a beautiful amphitheater.',
    features: ['Soccer Fields', 'Playground', 'Walking Trails', 'Amphitheater'],
  },
  {
    name: 'Havener Park',
    description: 'A serene natural escape perfect for picnics, fishing, and enjoying wildlife.',
    features: ['Lake Access', 'Picnic Areas', 'Nature Trails', 'Bird Watching'],
  },
  {
    name: 'Big Bear Park',
    description: 'Dedicated off-leash areas for dogs of all sizes to play and socialize.',
    features: ['Large Dog Area', 'Small Dog Area', 'Water Stations', 'Shaded Seating'],
  },
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Heart className="h-4 w-4" />
              <span>Serving Our Community</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              About Liberty Township Parks
            </h1>
            <p className="text-lg text-muted-foreground">
              For over 15 years, we've been dedicated to providing beautiful, safe, and accessible 
              parks for the residents of Liberty Township, Ohio. Our mission is to enhance the 
              quality of life in our community through exceptional outdoor spaces.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Our Mission
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Liberty Township Parks is committed to creating and maintaining vibrant outdoor 
                  spaces that bring our community together. We believe every resident deserves 
                  access to quality parks, trails, and recreational facilities.
                </p>
                <p>
                  Our team works year-round to ensure our parks are safe, clean, and welcoming 
                  for families, athletes, nature enthusiasts, and everyone in between.
                </p>
                <p>
                  Through community engagement and thoughtful planning, we continuously improve 
                  our parks based on resident feedback and evolving needs.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl bg-primary/10 flex items-center justify-center">
                  <TreePine className="h-16 w-16 text-primary/50" />
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-accent/50" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] rounded-2xl bg-earth/10 flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-earth/50" />
                </div>
                <div className="aspect-square rounded-2xl bg-forest-light/10 flex items-center justify-center">
                  <MapPin className="h-16 w-16 text-forest-light/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Get in Touch
            </h2>
            <p className="mb-8 text-muted-foreground">
              Have questions, suggestions, or feedback? We'd love to hear from you!
            </p>
            <Card className="text-left">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <a 
                      href="mailto:rishabsr25@gmail.com" 
                      className="text-primary hover:underline"
                    >
                      rishabsr25@gmail.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <a
                      href="mailto:nelthejan@gmail.com"
                      className="text-primary hover:underline"
                    >
                      nelthejan@gmail.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
