import { Shield, Lock, Eye, Database, Mail, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Account Information',
        text: 'When you create an account, we collect your name, email address, and a securely hashed password. This information is used solely to authenticate you and personalise your experience within the app.',
      },
      {
        subtitle: 'Usage Data',
        text: 'We may collect anonymised data about how you interact with the app — such as which pages you visit and which features you use — to help us improve the service. This data is never linked to your personal identity.',
      },
      {
        subtitle: 'Location Data',
        text: 'If you use the "Find My Location" feature on the map, your device\'s GPS coordinates are used in real time to centre the map on your position. We do not store or transmit your location to our servers.',
      },
      {
        subtitle: 'User-Submitted Content',
        text: 'Any reports, votes, or comments you submit through the app are stored in order to fulfill the purpose of those features (e.g. routing a maintenance report to the appropriate team).',
      },
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      {
        subtitle: 'Service Delivery',
        text: 'Your account information is used to provide access to the app and to associate your activity (reports, votes, announcements) with your account.',
      },
      {
        subtitle: 'Communications',
        text: 'We may send you transactional emails related to your account (e.g. password reset). We will not send unsolicited marketing emails without your explicit consent.',
      },
      {
        subtitle: 'Improvement',
        text: 'Aggregated, anonymised usage data helps us understand how the community uses the app so we can prioritise features and fix issues.',
      },
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      {
        subtitle: 'Encryption',
        text: 'All data transmitted between your device and our servers is encrypted using TLS/HTTPS. Passwords are never stored in plain text — they are hashed using industry-standard algorithms.',
      },
      {
        subtitle: 'Access Control',
        text: 'Access to your personal data is restricted to authorised personnel only. We use Row Level Security (RLS) policies to ensure users can only access their own data within our database.',
      },
      {
        subtitle: 'Third-Party Services',
        text: 'We use Supabase for authentication and data storage, and Google Maps for the interactive park map. Both services operate under their own robust privacy and security frameworks. We do not sell or share your data with any other third parties.',
      },
    ],
  },
  {
    icon: Shield,
    title: 'Your Rights',
    content: [
      {
        subtitle: 'Access & Correction',
        text: 'You have the right to access the personal information we hold about you and to request corrections if any of it is inaccurate.',
      },
      {
        subtitle: 'Deletion',
        text: 'You may request deletion of your account and all associated personal data at any time by contacting us at the email address below. We will action such requests within 30 days.',
      },
      {
        subtitle: 'Data Portability',
        text: 'Upon request, we can provide you with a copy of your personal data in a machine-readable format.',
      },
    ],
  },
  {
    icon: RefreshCw,
    title: 'Changes to This Policy',
    content: [
      {
        subtitle: 'Updates',
        text: 'We may update this Privacy Policy from time to time to reflect changes in the app or applicable law. When we do, the "Last Updated" date at the bottom of this page will be revised. Continued use of the app after changes are posted constitutes acceptance of the updated policy.',
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Shield className="h-4 w-4" />
              <span>Your Privacy Matters</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Liberty Township Parks is committed to protecting your personal information and being
              transparent about how we collect, use, and safeguard your data.
            </p>
          </div>
        </div>
      </section>

      {/* Intro card */}
      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-sm text-muted-foreground leading-relaxed">
                This Privacy Policy applies to the Liberty Township Parks web application
                (the&nbsp;"App") operated by Liberty Township, in Powell, Ohio. By using the App you agree to
                the collection and use of information in accordance with this policy. If you do not
                agree, please discontinue use of the App.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-12">
            {sections.map((section) => (
              <div key={section.title}>
                {/* Section header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                </div>

                {/* Subsections */}
                <div className="space-y-5 pl-1">
                  {section.content.map((item) => (
                    <div key={item.subtitle}>
                      <h3 className="font-semibold text-foreground mb-1">{item.subtitle}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-b border-border" />
              </div>
            ))}

            {/* Contact */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                If you have any questions, concerns, or requests regarding this Privacy Policy or
                your personal data, please reach out to us:
              </p>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Parks Administration
                    </p>
                    <a href="mailto:cbuehrer@libertytwp.org" className="text-primary hover:underline text-sm">
                      cbuehrer@libertytwp.org
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      App Support
                    </p>
                    <div className="flex flex-col gap-1">
                      <a href="mailto:nelthejan@gmail.com" className="text-primary hover:underline text-sm">
                        nelthejan@gmail.com
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Office Hours
                    </p>
                    <p className="text-sm text-muted-foreground">Monday – Friday, 8:00 AM – 5:00 PM ET</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Last updated */}
            <p className="text-xs text-muted-foreground text-center pt-4">
              Last updated: April 11, 2026
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
