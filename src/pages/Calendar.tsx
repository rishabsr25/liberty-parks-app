import { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { events, ParkEvent, parks } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const categoryColors: Record<string, string> = {
  sports: 'bg-sky/20 text-sky border-sky/30',
  community: 'bg-primary/20 text-primary border-primary/30',
  nature: 'bg-forest-light/20 text-forest border-forest-light/30',
  fitness: 'bg-accent/20 text-accent border-accent/30',
  family: 'bg-earth/20 text-earth border-earth/30',
  seasonal: 'bg-moss/20 text-moss border-moss/30',
};

const categories = ['all', 'sports', 'community', 'nature', 'fitness', 'family', 'seasonal'];

export default function CalendarPage() {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedParkId, setSelectedParkId] = useState<string>('all');
  const [eventList, setEventList] = useState<ParkEvent[]>(events);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    category: 'sports' as const,
    startTime: '10:00 AM',
    endTime: '11:00 AM',
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array(startDayOfWeek).fill(null);

  const filteredEvents = eventList.filter((event) => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesDate = !selectedDate || isSameDay(event.date, selectedDate);

    let matchesPark = true;
    if (selectedParkId !== 'all') {
      const selectedPark = parks.find(p => p.id === selectedParkId);
      if (selectedPark) {
        // Check if event location contains park name (case insensitive for safety, though data matches)
        matchesPark = event.location.toLowerCase().includes(selectedPark.name.toLowerCase());
      }
    }

    return matchesCategory && matchesDate && matchesPark;
  });

  const getEventsForDay = (day: Date) => {
    return eventList.filter((event) => isSameDay(event.date, day));
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.location) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const eventDate = selectedDate || new Date();
    const event: ParkEvent = {
      id: `evt-${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description,
      date: eventDate,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      location: newEvent.location,
      category: newEvent.category,
    };

    setEventList([...eventList, event]);
    setIsDialogOpen(false);
    setNewEvent({
      title: '',
      description: '',
      location: '',
      category: 'sports',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
    });

    toast({
      title: 'Success',
      description: 'Event added to calendar!',
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-2">
              Event Calendar
            </h1>
            <p className="text-muted-foreground">
              Discover upcoming events and activities at Liberty Township parks. Click on a date and add your own event!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <Select value={selectedParkId} onValueChange={setSelectedParkId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Parks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parks</SelectItem>
                {parks.map((park) => (
                  <SelectItem key={park.id} value={park.id}>
                    {park.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Event to {selectedDate ? format(selectedDate, 'MMMM d') : 'Calendar'}</DialogTitle>
                  <DialogDescription>
                    Create a new event for Liberty Township parks.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Community Volleyball Tournament"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the event..."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Liberty Park - Sports Field A"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newEvent.startTime}
                        onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newEvent.endTime}
                        onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newEvent.category} onValueChange={(value: any) => setNewEvent({ ...newEvent, category: value })}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="nature">Nature</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddEvent}>Add Event</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl">
                  {format(currentMonth, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {paddingDays.map((_, index) => (
                    <div key={`padding-${index}`} className="aspect-square" />
                  ))}
                  {daysInMonth.map((day) => {
                    const dayEvents = getEventsForDay(day);
                    const isToday = isSameDay(day, new Date());
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(isSelected ? null : day)}
                        className={cn(
                          'aspect-square p-1 rounded-lg transition-colors relative',
                          isToday && 'bg-primary/10',
                          isSelected && 'bg-primary text-primary-foreground',
                          !isSelected && 'hover:bg-muted'
                        )}
                      >
                        <span className={cn(
                          'text-sm font-medium',
                          !isSameMonth(day, currentMonth) && 'text-muted-foreground/50'
                        )}>
                          {format(day, 'd')}
                        </span>
                        {dayEvents.length > 0 && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                            {dayEvents.slice(0, 3).map((event, i) => (
                              <div
                                key={event.id}
                                className={cn(
                                  'h-1.5 w-1.5 rounded-full',
                                  isSelected ? 'bg-primary-foreground' : 'bg-primary'
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex flex-col gap-4 mt-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Filter by Category</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category === 'all' ? 'All Events' : category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {selectedDate ? `Events on ${format(selectedDate, 'MMM d')}` : 'Upcoming Events'}
            </h2>
            <div className="space-y-3">
              {filteredEvents.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
              {filteredEvents.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No events found for the selected filters.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function EventCard({ event }: { event: ParkEvent }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-foreground leading-tight">{event.title}</h3>
          <Badge className={cn('shrink-0 capitalize', categoryColors[event.category])}>
            {event.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {event.description}
        </p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{format(event.date, 'EEEE, MMM d')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
