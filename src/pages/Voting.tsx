import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle2, AlertCircle, Clock, Plus, Pencil, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


// Types matching Supabase schema
interface Poll {
  id: string; // uuid
  title: string;
  description: string;
  category: 'amenity' | 'event';
  tier: 'small' | 'medium' | 'big';
  type: 'yes_no' | 'multiple_choice';
  endtime: string; // ISO string
  approved: boolean | null; // null = under decision
}

interface PollChoice {
  id: string; // uuid
  poll_id: string;
  choice: string;
}

interface UserVote {
  poll_id: string;
  vote_option: string; // 'yes', 'no', or choice_id
}

interface PollWithData extends Poll {
  choices: PollChoice[];
  votes: Record<string, number>; // map option -> count
  totalVotes: number;
  userVote?: string; // current user's vote option
}

export default function VotingPage() {
  const { toast } = useToast();
  const { user, role } = useAuth();
  const [polls, setPolls] = useState<PollWithData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votingForPoll, setVotingForPoll] = useState<string | null>(null);

  // Admin State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPoll, setEditingPoll] = useState<PollWithData | null>(null);
  // Form State
  const [formData, setFormData] = useState<Partial<Poll>>({
    title: '', description: '', category: 'amenity', tier: 'small', type: 'yes_no', endtime: ''
  });
  const [choicesInput, setChoicesInput] = useState<string>(''); // Line separated

  useEffect(() => {
    fetchPollsData();
  }, [user]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isDialogOpen) {
      setEditingPoll(null);
      setFormData({ title: '', description: '', category: 'amenity', tier: 'small', type: 'yes_no', endtime: '' });
      setChoicesInput('');
    } else if (editingPoll) {
      setFormData({
        title: editingPoll.title,
        description: editingPoll.description,
        category: editingPoll.category,
        tier: editingPoll.tier,
        type: editingPoll.type,
        endtime: new Date(editingPoll.endtime).toISOString().slice(0, 16) // Format for datetime-local
      });
      setChoicesInput(editingPoll.choices.map(c => c.choice).join('\n'));
    }
  }, [isDialogOpen, editingPoll]);

  const fetchPollsData = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      // Don't set loading on refresh to avoid flash
      if (polls.length === 0) setIsLoading(true);

      // 1. Fetch Polls
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .order('endtime', { ascending: true });

      if (pollsError) throw pollsError;

      // 2. Fetch Choices
      const { data: choicesData, error: choicesError } = await supabase
        .from('choices')
        .select('*');

      if (choicesError) throw choicesError;

      // 3. Fetch Votes
      const { data: votesData, error: votesError } = await supabase
        .from('voting')
        .select('*');

      if (votesError) throw votesError;

      // Process Data
      const processedPolls = (pollsData as Poll[]).map(poll => {
        const pollChoices = (choicesData as PollChoice[]).filter(c => c.poll_id === poll.id);

        // Count votes
        const pollVotes = (votesData as any[]).filter(v => v.poll_id === poll.id);
        const voteCounts: Record<string, number> = {};

        // Initialize counts
        if (poll.type === 'yes_no') {
          voteCounts['yes'] = 0;
          voteCounts['no'] = 0;
        } else {
          pollChoices.forEach(c => voteCounts[c.choice] = 0);
        }

        let userVote: string | undefined = undefined;

        pollVotes.forEach(v => {
          // Count vote
          const option = v.vote_option;
          if (option) {
            voteCounts[option] = (voteCounts[option] || 0) + 1;
          }

          // Check if it's user's vote
          if (user && v.user_id === user.id) {
            userVote = v.vote_option;
          }
        });

        return {
          ...poll,
          choices: pollChoices,
          votes: voteCounts,
          totalVotes: pollVotes.length,
          userVote
        };
      });

      setPolls(processedPolls);
    } catch (error) {
      console.error('Error fetching voting data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load polls. Please refresh.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (pollId: string, option: string) => {
    if (!user) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to vote.',
        variant: 'destructive',
      });
      return;
    }

    if (!supabase) return;

    try {
      setVotingForPoll(pollId);

      // Database update
      const { error } = await supabase
        .from('voting')
        .upsert(
          {
            user_id: user.id,
            poll_id: pollId,
            vote_option: option,
          },
          { onConflict: 'user_id,poll_id' }
        );

      if (error) throw error;

      toast({
        title: 'Vote Recorded',
        description: 'Your vote has been saved.',
      });

      await fetchPollsData();

    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit vote. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setVotingForPoll(null);
    }
  };

  // Admin Actions
  const handleSavePoll = async () => {
    if (!supabase || !formData.title || !formData.endtime) return;

    try {
      const pollPayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tier: formData.tier,
        type: formData.type,
        endtime: new Date(formData.endtime).toISOString(),
      };

      let pollId = editingPoll?.id;

      if (editingPoll) {
        // Update
        const { error } = await supabase
          .from('polls')
          .update(pollPayload)
          .eq('id', editingPoll.id);
        if (error) throw error;
      } else {
        // Create
        const { data, error } = await supabase
          .from('polls')
          .insert(pollPayload)
          .select()
          .single();
        if (error) throw error;
        pollId = data.id;
      }

      // Handle Choices for Multiple Choice
      if (formData.type === 'multiple_choice' && pollId) {
        const choices = choicesInput.split('\n').filter(c => c.trim() !== '');

        // Delete old choices if editing (simplest strategy)
        if (editingPoll) {
          await supabase.from('choices').delete().eq('poll_id', pollId);
        }

        if (choices.length > 0) {
          const choicesPayload = choices.map(c => ({
            poll_id: pollId,
            choice: c.trim()
          }));
          const { error: choicesError } = await supabase.from('choices').insert(choicesPayload);
          if (choicesError) throw choicesError;
        }
      }

      toast({ title: 'Success', description: 'Poll saved successfully.' });
      setIsDialogOpen(false);
      fetchPollsData();

    } catch (error: any) {
      console.error('Error saving poll:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save poll.',
        variant: 'destructive'
      });
    }
  };

  const handleDeletePoll = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('polls').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Poll deleted successfully.' });
      fetchPollsData();
    } catch (error) {
      console.error('Error deleting poll:', error);
      toast({ title: 'Error', description: 'Failed to delete poll.', variant: 'destructive' });
    }
  };

  // Business Logic for Status
  const getPollStatus = (poll: PollWithData) => {
    const now = new Date();
    const endDate = new Date(poll.endtime);
    const isEnded = now > endDate;

    if (!isEnded) return { label: 'In Progress', color: 'bg-blue-500/10 text-blue-500' };

    if (poll.type === 'multiple_choice') {
      return { label: 'Under Decision', color: 'bg-yellow-500/10 text-yellow-500' };
    }

    const yesVotes = poll.votes['yes'] || 0;
    const approvalRate = poll.totalVotes > 0 ? (yesVotes / poll.totalVotes) : 0;
    const isHighApproval = approvalRate >= 0.67;

    let threshold = 0;
    if (poll.tier === 'small') threshold = 100;
    else if (poll.tier === 'medium') threshold = 250;
    else if (poll.tier === 'big') threshold = 500;

    const meetsThreshold = poll.totalVotes >= threshold;

    if (meetsThreshold && isHighApproval) {
      return { label: 'Approved', color: 'bg-green-500/10 text-green-500' };
    } else {
      return { label: 'Under Decision', color: 'bg-yellow-500/10 text-yellow-500' };
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12 text-center text-muted-foreground">
          Loading polls...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-2">
              Community Voting
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Have your say in shaping Liberty Township parks.
            </p>
          </div>

          {role === 'admin' && (
            <Button onClick={() => { setEditingPoll(null); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {polls.length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No active polls at the moment.</p>
            </div>
          )}

          {polls.map((poll) => {
            const status = getPollStatus(poll);
            const endDate = new Date(poll.endtime).toLocaleDateString();

            return (
              <Card key={poll.id} className="overflow-hidden relative group">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">
                          {poll.category}
                        </Badge>
                        <Badge variant="secondary" className={status.color}>
                          {status.label}
                        </Badge>
                        {poll.tier && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            {poll.tier} Tier
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="mb-2">{poll.title}</CardTitle>
                      <CardDescription>{poll.description}</CardDescription>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        Ends {endDate}
                      </div>

                      {/* Admin Actions */}
                      {role === 'admin' && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => { setEditingPoll(poll); setIsDialogOpen(true); }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the poll "{poll.title}" and all its votes.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePoll(poll.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Results Visualization */}
                  <div className="space-y-4">
                    {Object.entries(poll.votes).map(([option, count]) => {
                      const percentage = poll.totalVotes === 0 ? 0 : Math.round((count / poll.totalVotes) * 100);
                      const isYes = option === 'yes';

                      let label = option;
                      let colorClass = "bg-primary";

                      if (poll.type === 'yes_no') {
                        label = isYes ? 'Yes' : 'No';
                        colorClass = isYes ? 'bg-green-500' : 'bg-red-500';
                      }

                      return (
                        <div key={option} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium capitalize">{label}</span>
                            <span className="text-muted-foreground">
                              {percentage}% ({count} votes)
                            </span>
                          </div>
                          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn("h-full transition-all", colorClass)}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                    <div className="text-xs text-center text-muted-foreground pt-1">
                      Total Votes: {poll.totalVotes}
                    </div>
                  </div>

                  {/* Voting Input */}
                  <div className="pt-2">
                    {poll.type === 'yes_no' ? (
                      <div className="flex gap-3">
                        <Button
                          variant={poll.userVote === 'yes' ? 'default' : 'outline'}
                          className={cn("flex-1 gap-2", poll.userVote === 'yes' && "bg-green-600 hover:bg-green-700")}
                          onClick={() => handleVote(poll.id, 'yes')}
                          disabled={!!votingForPoll}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          Yes
                        </Button>
                        <Button
                          variant={poll.userVote === 'no' ? 'default' : 'outline'}
                          className={cn("flex-1 gap-2", poll.userVote === 'no' && "bg-red-600 hover:bg-red-700")}
                          onClick={() => handleVote(poll.id, 'no')}
                          disabled={!!votingForPoll}
                        >
                          <ThumbsDown className="h-4 w-4" />
                          No
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <RadioGroup
                          value={poll.userVote}
                          onValueChange={(val) => handleVote(poll.id, val)}
                          disabled={!!votingForPoll}
                        >
                          {poll.choices.map((choice) => (
                            <div key={choice.id} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <RadioGroupItem value={choice.choice} id={`${poll.id}-${choice.id}`} />
                              <Label htmlFor={`${poll.id}-${choice.id}`} className="flex-1 cursor-pointer font-normal">
                                {choice.choice}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Edit/Create Poll Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPoll ? 'Edit Poll' : 'Create Poll'}</DialogTitle>
              <DialogDescription>
                Add a new poll for the community to vote on.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. New Playground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the proposal..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(val: any) => setFormData({ ...formData, category: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amenity">Amenity</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Tier</Label>
                  <Select value={formData.tier} onValueChange={(val: any) => setFormData({ ...formData, tier: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (100 votes)</SelectItem>
                      <SelectItem value="medium">Medium (250 votes)</SelectItem>
                      <SelectItem value="big">Big (500 votes)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Poll Type</Label>
                <Select value={formData.type} onValueChange={(val: any) => setFormData({ ...formData, type: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes_no">Yes / No</SelectItem>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.type === 'multiple_choice' && (
                <div className="grid gap-2">
                  <Label>Choices (One per line)</Label>
                  <Textarea
                    rows={4}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    value={choicesInput}
                    onChange={(e) => setChoicesInput(e.target.value)}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="endtime">End Date & Time</Label>
                <Input
                  id="endtime"
                  type="datetime-local"
                  value={formData.endtime}
                  onChange={(e) => setFormData({ ...formData, endtime: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSavePoll}>Save Poll</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
