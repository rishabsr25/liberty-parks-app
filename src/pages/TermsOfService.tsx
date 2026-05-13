import { FileText, UserCheck, AlertTriangle, Ban, Scale, RefreshCw, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  {
    icon: UserCheck,
    title: 'Acceptance of Terms',
    content: [
      {
        subtitle: 'Agreement',
        text: 'By accessing or using the Liberty Township Parks web application (the "App"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the App.',
      },
      {
        subtitle: 'Eligibility',
        text: 'The App is intended for residents, visitors, and stakeholders of Liberty Township, in Powell, Ohio. By using the App you represent that you are at least 13 years of age. Users under the age of 18 should use the App only with the guidance of a parent or guardian.',
      },
    ],
  },
  {
    icon: FileText,
    title: 'Use of the App',
    content: [
      {
        subtitle: 'Permitted Use',
        text: 'The App is provided for informational and community-engagement purposes — including exploring park maps, viewing events, submitting maintenance reports, and participating in community votes. You may use the App only for these lawful, non-commercial purposes.',
      },
      {
        subtitle: 'Account Responsibility',
        text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Please notify us immediately if you suspect any unauthorised use of your account.',
      },
      {
        subtitle: 'User-Submitted Content',
        text: 'When you submit reports, comments, votes, or other content through the App, you grant Liberty Township a non-exclusive, royalty-free licence to use, display, and act upon that content for the purposes of operating and improving the App and managing park facilities.',
      },
    ],
  },
  {
    icon: Ban,
    title: 'Prohibited Conduct',
    content: [
      {
        subtitle: 'You agree not to:',
        text: '(1) Use the App for any unlawful purpose or in violation of any local, state, or federal laws; (2) Submit false, misleading, or fraudulent reports or content; (3) Harass, defame, or harm other users or Liberty Township staff; (4) Attempt to gain unauthorised access to any part of the App or its underlying systems; (5) Use automated means (bots, scrapers) to access or interact with the App without our prior written consent; (6) Interfere with or disrupt the integrity or performance of the App.',
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Disclaimers & Limitations',
    content: [
      {
        subtitle: 'No Warranty',
        text: 'The App is provided "as is" and "as available" without warranties of any kind, express or implied. Liberty Township does not warrant that the App will be uninterrupted, error-free, or free of viruses or other harmful components.',
      },
      {
        subtitle: 'Accuracy of Information',
        text: 'While we strive to keep park information, event listings, and map data accurate and up to date, we make no guarantees regarding the completeness or accuracy of any content within the App. Always verify critical information (e.g. facility hours, event cancellations) directly with Liberty Township.',
      },
      {
        subtitle: 'Limitation of Liability',
        text: 'To the fullest extent permitted by law, Liberty Township shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the App — even if we have been advised of the possibility of such damages.',
      },
    ],
  },
  {
    icon: Scale,
    title: 'Intellectual Property',
    content: [
      {
        subtitle: 'Ownership',
        text: 'All content, design, graphics, and software comprising the App are the property of Liberty Township or its licensors and are protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any App content without express written permission.',
      },
      {
        subtitle: 'Third-Party Services',
        text: 'The App uses Google Maps and Supabase, which are subject to their own terms of service. Your use of those embedded services is additionally governed by Google\'s Terms of Service and Supabase\'s Terms of Service respectively.',
      },
    ],
  },
  {
    icon: RefreshCw,
    title: 'Changes & Termination',
    content: [
      {
        subtitle: 'Modifications',
        text: 'We reserve the right to modify these Terms of Service at any time. We will update the "Last Updated" date below when changes are made. Your continued use of the App after any changes constitutes acceptance of the new terms.',
      },
      {
        subtitle: 'Termination',
        text: 'We reserve the right to suspend or terminate your access to the App at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.',
      },
      {
        subtitle: 'Governing Law',
        text: 'These Terms shall be governed by and construed in accordance with the laws of the State of Ohio, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Delaware County, Ohio.',
      },
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <FileText className="h-4 w-4" />
              <span>Please Read Carefully</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              These Terms of Service govern your use of the Liberty Township Parks app.
              By using the app you agree to these terms.
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
                These Terms of Service ("Terms") are a legal agreement between you and Liberty
                Township, Ohio governing your access to and use of the Liberty Township Parks
                web application. Please also review our{' '}
                <Link to="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                , which is incorporated into these Terms by reference.
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
                <h2 className="text-2xl font-bold text-foreground">Questions?</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                If you have any questions about these Terms of Service, please contact us:
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
                      <a href="mailto:rishabsr25@gmail.com" className="text-primary hover:underline text-sm">
                        rishabsr25@gmail.com
                      </a>
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
