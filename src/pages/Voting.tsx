import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { votingPolls, VotingPoll } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

export default function VotingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [polls, setPolls] = useState<VotingPoll[]>(votingPolls);
  const [userVotes, setUserVotes] = useState<Record<string, 'yes' | 'no'>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [votingForPoll, setVotingForPoll] = useState<string | null>(null);

  // Fetch vote counts and user's votes from Supabase on component mount
  useEffect(() => {
    const fetchVoteCounts = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch all votes from the database
        const { data: votes, error } = await supabase
          .from('voting')
          .select('poll_id, vote, user_id');

        if (error) {
          console.error('Error fetching votes:', error);
          setIsLoading(false);
          return;
        }

        // Group votes by poll_id and count yes/no for each poll
        const voteCountsByPoll: Record<string, { yes: number; no: number }> = {};
        const currentUserVotes: Record<string, 'yes' | 'no'> = {};

        votes?.forEach(v => {
          const pollId = String(v.poll_id); // Convert integer poll_id to string

          // Count all votes
          if (!voteCountsByPoll[pollId]) {
            voteCountsByPoll[pollId] = { yes: 0, no: 0 };
          }
          if (v.vote === true) {
            voteCountsByPoll[pollId].yes++;
          } else {
            voteCountsByPoll[pollId].no++;
          }

          // Track current user's votes
          if (user && v.user_id === user.id) {
            currentUserVotes[pollId] = v.vote ? 'yes' : 'no';
          }
        });

        // Update each poll with its specific vote counts
        setPolls(prevPolls =>
          prevPolls.map(poll => ({
            ...poll,
            votes: voteCountsByPoll[poll.id] || { yes: 0, no: 0 }
          }))
        );

        // Update user's votes
        setUserVotes(currentUserVotes);

        setIsLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching votes:', err);
        setIsLoading(false);
      }
    };

    fetchVoteCounts();
  }, [user]);

  const handleVote = async (pollId: string, vote: 'yes' | 'no') => {
    try {
      // Check if user is logged in
      if (!user) {
        toast({
          title: 'Sign In Required',
          description: 'Please sign in to vote on polls.',
          variant: 'destructive',
        });
        return;
      }

      // Check if Supabase client is available
      if (!supabase) {
        toast({
          title: 'Configuration Error',
          description: 'Voting is currently unavailable. Please contact support.',
          variant: 'destructive',
        });
        return;
      }

      setVotingForPoll(pollId);
      const isChangingVote = !!userVotes[pollId];

      // Use upsert to insert or update the vote
      // This ensures one vote per user per poll
      const { error } = await supabase
        .from('voting')
        .upsert(
          {
            user_id: user.id,
            poll_id: parseInt(pollId),
            vote: vote === 'yes',
          },
          {
            onConflict: 'user_id,poll_id', // Unique constraint on these columns
          }
        );

      if (error) {
        console.error('Error saving vote:', error);
        toast({
          title: 'Error',
          description: 'Failed to save your vote. Please try again.',
          variant: 'destructive',
        });
        setVotingForPoll(null);
        return;
      }

      // Update local state for user's vote
      toast({
        title: isChangingVote ? 'Vote Updated' : 'Vote Recorded',
        description: isChangingVote
          ? 'Your vote has been updated successfully.'
          : 'Thank you for voting!',
      });

      setUserVotes((prev) => ({ ...prev, [pollId]: vote }));

      // Refetch vote counts from database to update UI
      const { data: votes, error: fetchError } = await supabase
        .from('voting')
        .select('poll_id, vote, user_id');

      if (!fetchError && votes) {
        // Group votes by poll_id
        const voteCountsByPoll: Record<string, { yes: number; no: number }> = {};

        votes.forEach(v => {
          const pid = String(v.poll_id);
          if (!voteCountsByPoll[pid]) {
            voteCountsByPoll[pid] = { yes: 0, no: 0 };
          }
          if (v.vote === true) {
            voteCountsByPoll[pid].yes++;
          } else {
            voteCountsByPoll[pid].no++;
          }
        });

        setPolls(prevPolls =>
          prevPolls.map(poll => ({
            ...poll,
            votes: voteCountsByPoll[poll.id] || { yes: 0, no: 0 }
          }))
        );
      }
      setVotingForPoll(null);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      setVotingForPoll(null);
    }
  };

  const getTotalVotes = (poll: VotingPoll) => poll.votes.yes + poll.votes.no;
  const getYesPercentage = (poll: VotingPoll) => {
    const total = getTotalVotes(poll);
    return total === 0 ? 0 : Math.round((poll.votes.yes / total) * 100);
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-2">
            Community Voting
          </h1>
          <p className="text-muted-foreground">
            Have your say in shaping Liberty Township parks. Vote on proposed amenities and events for 2025.
          </p>
        </div>

        {/* Voting Polls */}
        <div className="grid gap-6">
          {polls.map((poll) => {
            const userVote = userVotes[poll.id];
            const yesPercentage = getYesPercentage(poll);
            const noPercentage = 100 - yesPercentage;
            const totalVotes = getTotalVotes(poll);

            return (
              <Card key={poll.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="mb-2">{poll.title}</CardTitle>
                      <CardDescription>{poll.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {poll.category === 'amenity' ? 'Amenity' : 'Event'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Vote Results */}
                  <div className="space-y-4">
                    {/* Yes Results */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-700">Yes</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg">{yesPercentage}%</span>
                          <span className="text-sm text-muted-foreground ml-2">({poll.votes.yes} votes)</span>
                        </div>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${yesPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* No Results */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-700">No</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg">{noPercentage}%</span>
                          <span className="text-sm text-muted-foreground ml-2">({poll.votes.no} votes)</span>
                        </div>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-red-500 transition-all"
                          style={{ width: `${noPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Total Votes */}
                    <div className="text-sm text-muted-foreground text-center">
                      Total votes: {totalVotes}
                    </div>
                  </div>

                  {/* Vote Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant={userVote === 'yes' ? 'default' : 'outline'}
                      className="flex-1 gap-2"
                      onClick={() => handleVote(poll.id, 'yes')}
                      disabled={votingForPoll === poll.id}
                    >
                      <ThumbsUp className={cn("h-4 w-4", votingForPoll === poll.id && "animate-pulse")} />
                      {userVote === 'yes' && <CheckCircle2 className="h-4 w-4" />}
                      {votingForPoll === poll.id ? 'Voting...' : 'Yes'}
                    </Button>
                    <Button
                      variant={userVote === 'no' ? 'default' : 'outline'}
                      className="flex-1 gap-2"
                      onClick={() => handleVote(poll.id, 'no')}
                      disabled={votingForPoll === poll.id}
                    >
                      <ThumbsDown className={cn("h-4 w-4", votingForPoll === poll.id && "animate-pulse")} />
                      {userVote === 'no' && <CheckCircle2 className="h-4 w-4" />}
                      {votingForPoll === poll.id ? 'Voting...' : 'No'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 rounded-lg bg-muted/50 border">
          <h3 className="font-semibold mb-3">About Community Voting</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Every year, Liberty Township gathers input from residents on potential park improvements and new events.
            Your vote helps shape the future of our parks and ensures that community priorities guide park development.
          </p>
          <p className="text-sm text-muted-foreground">
            Voting occurs annually from January 1st through December 31st. Results are compiled and presented to the Parks and Recreation Board for consideration.
          </p>
        </div>
      </div>
    </Layout>
  );
}
