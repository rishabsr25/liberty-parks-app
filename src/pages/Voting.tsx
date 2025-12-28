import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
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
  const { user } = useAuth();
  const [polls, setPolls] = useState<PollWithData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votingForPoll, setVotingForPoll] = useState<string | null>(null);

  useEffect(() => {
    fetchPollsData();
  }, [user]);

  const fetchPollsData = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      // setIsLoading(true); // Removed to prevent flashing on refetch

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

      // Optimistic update
      const currentPolls = [...polls];
      const pollIndex = currentPolls.findIndex(p => p.id === pollId);
      if (pollIndex === -1) return;

      const poll = currentPolls[pollIndex];
      const previousUserVote = poll.userVote;

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

      // Refetch to ensure accuracy (simplest way to handle counts)
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

  // Business Logic for Status
  const getPollStatus = (poll: PollWithData) => {
    const now = new Date();
    const endDate = new Date(poll.endtime);
    const isEnded = now > endDate;

    if (!isEnded) return { label: 'In Progress', color: 'bg-blue-500/10 text-blue-500' };

    // Passed end time logic
    if (poll.type === 'multiple_choice') {
      return { label: 'Under Decision', color: 'bg-yellow-500/10 text-yellow-500' };
    }

    // Yes/No Logic
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-2">
            Community Voting
          </h1>
          <p className="text-muted-foreground">
            Have your say in shaping Liberty Township parks. Vote on proposed amenities and events.
          </p>
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
              <Card key={poll.id} className="overflow-hidden">
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
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 bg-muted/50 px-2.5 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5" />
                      Ends {endDate}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Results Visualization */}
                  <div className="space-y-4">
                    {Object.entries(poll.votes).map(([option, count]) => {
                      // For Multiple Choice, option is the choice text. For Yes/No, it's 'yes'/'no'
                      const percentage = poll.totalVotes === 0 ? 0 : Math.round((count / poll.totalVotes) * 100);
                      const isYes = option === 'yes';
                      const isNo = option === 'no';

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
      </div>
    </Layout>
  );
}
