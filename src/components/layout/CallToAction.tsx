import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
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
  );
};

export default CallToAction;
