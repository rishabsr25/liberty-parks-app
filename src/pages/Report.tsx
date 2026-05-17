import { useState, useEffect } from 'react';
import { Send, CheckCircle, Wrench, AlertTriangle, Trash2, XCircle, Lightbulb, HelpCircle, Camera, Image as ImageIcon } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { reportCategories } from '@/data/parkData';
import { supabase } from '@/supabase-client';
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


interface Report {
  id: string;
  created_at: string;
  brief_description: string;
  detailed_description: string;
  type_of_issue: 'maintenance' | 'safety' | 'cleanliness' | 'equipment' | 'lighting' | 'other';
  park_id: string;
  email: string | null;
  image_url?: string | null;
  status: 'pending' | 'dismissed' | 'in_progress' | 'resolved';
}

const statusColors: Record<Report['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  dismissed: 'bg-red-100 text-red-800 border-red-300',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-300',
  resolved: 'bg-green-100 text-green-800 border-green-300',
};

export default function ReportPage() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [parksMap, setParksMap] = useState<Record<string, string>>({});
  const [parksList, setParksList] = useState<{ id: string; park_name: string }[]>([]);
  const [formData, setFormData] = useState({
    park: '',
    category: '',
    title: '',
    description: '',
    email: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchReports = async () => {
    if (!supabase) return;
    console.time('fetchReports'); // Start timer

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .in('status', ['in_progress', 'resolved'])
      .order('created_at', { ascending: false });

    console.timeEnd('fetchReports'); // End timer

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load reports.',
        variant: 'destructive',
      });
      console.error('Error fetching reports:', error);
      return;
    }

    console.log('Fetched reports:', data?.length || 0, 'records');
    setReports(data as Report[]);
    setIsLoading(false);
  };


  const fetchParks = async () => {
    console.time('fetchParks'); // Start timer
    const { data, error } = await supabase
      .from('parks')
      .select('id, park_name');

    if (error || !data) {
      console.timeEnd('fetchParks'); // End timer even on error
      console.error('Error fetching parks:', error);
      return;
    }

    console.timeEnd('fetchParks'); // End timer
    console.log('Fetched parks:', data.length, 'records');

    // Store live array for Select dropdown
    setParksList(data);

    // Map UUID -> park_name for handleSubmit & getParkName
    const map: Record<string, string> = {};
    data.forEach((park) => {
      map[park.id] = park.park_name;
    });
    setParksMap(map);
  };


  useEffect(() => {
  fetchParks();
  fetchReports();
}, []);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!supabase) return;

  if (!formData.park || !formData.category || !formData.title || !formData.description) {
    toast({
      title: 'Missing Information',
      description: `Please fill in all required fields. Current park value: "${formData.park}"`,
      variant: 'destructive',
    });
    return;
  }

  // Find the UUID for the selected park
  const selectedParkId = Object.entries(parksMap).find(
    ([id, name]) => name === formData.park
  )?.[0];

  if (!selectedParkId) {
    toast({
      title: 'Selected Park Not Found',
      description: `The park you selected ("${formData.park}") could not be found in the database.`,
      variant: 'destructive',
    });
    return;
  }

  try {
    setIsUploading(true);
    let imageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('report-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        toast({
          title: 'Image Upload Failed',
          description: uploadError.message,
          variant: 'destructive',
        });
        setIsUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('report-images')
        .getPublicUrl(fileName);
        
      imageUrl = publicUrlData.publicUrl;
    }

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-report`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        park_id: selectedParkId,
        type_of_issue: formData.category,
        brief_description: formData.title,
        detailed_description: formData.description,
        email: formData.email || null,
        image_url: imageUrl,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Submit report failed:", data);
    toast({
      title: "Error",
      description: data.error || "Failed to submit report",
      variant: "destructive",
    });
    return;
  }
  } catch (err) {
    console.error("Submit report error:", err);
    toast({
      title: "Error",
      description: "Failed to submit report",
      variant: "destructive",
    });
  } finally {
    setIsUploading(false);
  }

  toast({
    title: 'Report Submitted',
    description: 'Thank you for helping improve our parks.',
  });

  setIsSubmitted(true);
  setImageFile(null);
  fetchReports();
};



  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedCategory('');
    setImageFile(null);
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


  const getParkName = (parkId: string) =>
    parksMap[parkId] ?? 'Unknown Park';


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
                        <SelectValue placeholder={parksList.length ? 'Select a park' : 'Loading...'} />
                      </SelectTrigger>
                      <SelectContent>
                        {parksList.map((park) => (
                          <SelectItem key={park.id} value={park.park_name}>
                            {park.park_name}
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


                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label>Attach a Photo (optional)</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full flex-1 gap-2"
                        onClick={() => document.getElementById('photo-upload')?.click()}
                      >
                        <Camera className="h-4 w-4" />
                        {imageFile ? 'Change Photo' : 'Take or Upload Photo'}
                      </Button>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                    {imageFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <ImageIcon className="h-4 w-4" />
                        <span className="truncate">{imageFile.name}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto p-1 ml-auto text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => setImageFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
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


                  <Button type="submit" className="w-full gap-2" disabled={!selectedCategory || !formData.park || isUploading}>
                    <Send className="h-4 w-4" />
                    {isUploading ? 'Uploading & Submitting...' : 'Submit Report'}
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
              const Icon = (() => {
                const category = reportCategories.find(c => c.id === report.type_of_issue);
                return category ? iconMap[category.icon] : HelpCircle;
              })();



              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{report.brief_description}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{getParkName(report.park_id)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{report.detailed_description}</p>
                    {report.image_url && (
                      <div className="mb-3 relative h-32 w-full overflow-hidden rounded-md border">
                        <img 
                          src={report.image_url} 
                          alt="Report attachment" 
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge className={cn('text-xs', statusColors[report.status])}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(report.created_at), 'MMM d')}
                      </span>
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

