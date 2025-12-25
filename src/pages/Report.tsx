import { useState } from 'react';
import { Send, CheckCircle, Wrench, AlertTriangle, Trash2, XCircle, Lightbulb, HelpCircle, Clock } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { parks, reportCategories, parkReports, ParkReport } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  AlertTriangle,
  Trash2,
  XCircle,
  Lightbulb,
  HelpCircle,
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  acknowledged: 'bg-blue-100 text-blue-800 border-blue-300',
  'in-progress': 'bg-orange-100 text-orange-800 border-orange-300',
  resolved: 'bg-green-100 text-green-800 border-green-300',
};

export default function ReportPage() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [reports, setReports] = useState<ParkReport[]>(parkReports);
  const [formData, setFormData] = useState({
    park: '',
    category: '',
    title: '',
    description: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.park || !formData.category || !formData.title || !formData.description) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newReport: ParkReport = {
      id: `rpt-${Date.now()}`,
      parkId: formData.park,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      email: formData.email,
      status: 'pending',
      createdAt: new Date(),
    };

    setReports([newReport, ...reports]);
    setIsSubmitted(true);
    
    toast({
      title: 'Report Submitted',
      description: 'Thank you for helping improve our parks!',
    });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedCategory('');
    setFormData({
      park: '',
      category: '',
      title: '',
      description: '',
      email: '',
    });
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-foreground">
              Report Submitted!
            </h1>
            <p className="mb-8 text-muted-foreground">
              Thank you for helping us maintain Liberty Township parks. Our team will review your report and take appropriate action.
            </p>
            <Button onClick={handleReset}>Submit Another Report</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getParkName = (parkId: string) => parks.find(p => p.id === parkId)?.name || 'Unknown Park';

  return (
    <Layout>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-2">
            Report an Issue
          </h1>
          <p className="text-muted-foreground">
            Help us keep our parks safe and beautiful by reporting maintenance issues.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Category Selection */}
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              What type of issue?
            </h2>
            <div className="grid gap-2">
              {reportCategories.map((category) => {
                const Icon = iconMap[category.icon] || HelpCircle;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setFormData((prev) => ({ ...prev, category: category.id }));
                    }}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border transition-all text-left',
                      selectedCategory === category.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-primary/30'
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Report Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
                <CardDescription>
                  Please provide as much detail as possible to help us address the issue.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Park Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="park">Which park?</Label>
                    <Select
                      value={formData.park}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, park: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a park" />
                      </SelectTrigger>
                      <SelectContent>
                        {parks.map((park) => (
                          <SelectItem key={park.id} value={park.id}>
                            {park.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Issue Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Brief description</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Broken swing on playground"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Detailed Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed description</Label>
                    <Textarea
                      id="description"
                      placeholder="Please describe the issue in detail, including the exact location if possible..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Email (optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide your email if you'd like updates on your report.
                    </p>
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={!selectedCategory || !formData.park}>
                    <Send className="h-4 w-4" />
                    Submit Report
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Reports Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Reports</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => {
              const categoryInfo = reportCategories.find(c => c.id === report.category);
              const Icon = categoryInfo ? iconMap[categoryInfo.icon] : HelpCircle;
              
              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{report.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{getParkName(report.parkId)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge className={cn('text-xs', statusColors[report.status])}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{format(report.createdAt, 'MMM d')}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
