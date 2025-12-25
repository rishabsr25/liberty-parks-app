import { Link } from 'react-router-dom';
import { TreePine, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <TreePine className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-semibold text-foreground">
                Liberty Township Parks
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Discover, explore, and enjoy the beautiful parks of Liberty Township, Ohio.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/map" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Interactive Map
              </Link>
              <Link to="/calendar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Event Calendar
              </Link>
              <Link to="/report" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Report an Issue
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Contact</h3>
            <div className="space-y-2">
              <a
                href="mailto:rishabsr25@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                rishabsr25@gmail.com
              </a>
              <a
                href="mailto:nelthejan@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                nelthejan@gmail.com
              </a>
            </div>
            <div className="flex gap-4 pt-2">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Liberty Township Parks. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
