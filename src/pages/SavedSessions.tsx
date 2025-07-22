import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Activity, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SavedEntry = {
  id: string;
  date: string;
  mood: string;
  activities: string[];
  custom_activity: string | null;
  control_answer: string | null;
  not_my_job_answer: string | null;
  five_days_answer: string | null;
  next_step: string | null;
  created_at: string;
};

const SavedSessions = () => {
  const [sessions, setSessions] = useState<SavedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("mental_reset_entries")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load your sessions.",
          variant: "destructive",
        });
      } else {
        setSessions(data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your sessions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Planner
          </Button>
          <h1 className="text-3xl font-bold">Your Saved Sessions</h1>
        </div>

        {sessions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-muted-foreground mb-4">
                No saved sessions yet. Complete a mental reset session to see it here!
              </div>
              <Button onClick={() => navigate("/")}>
                Start Your First Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {sessions.map((session) => (
              <Card key={session.id} className="p-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Calendar className="h-5 w-5" />
                      {formatDate(session.date)}
                    </CardTitle>
                    <Badge variant="secondary" className="text-sm">
                      {session.mood}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {session.activities.length > 0 && (
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4" />
                        Activities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {session.activities.map((activity, index) => (
                          <Badge key={index} variant="outline">
                            {activity}
                          </Badge>
                        ))}
                        {session.custom_activity && (
                          <Badge variant="outline">
                            {session.custom_activity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {(session.control_answer || session.not_my_job_answer || session.five_days_answer || session.next_step) && (
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-3">
                        <MessageCircle className="h-4 w-4" />
                        Reflections
                      </h4>
                      <div className="space-y-3">
                        {session.control_answer && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              What can you control?
                            </p>
                            <p className="text-sm">{session.control_answer}</p>
                          </div>
                        )}
                        {session.not_my_job_answer && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              What's not your job?
                            </p>
                            <p className="text-sm">{session.not_my_job_answer}</p>
                          </div>
                        )}
                        {session.five_days_answer && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Will this matter in 5 days?
                            </p>
                            <p className="text-sm">{session.five_days_answer}</p>
                          </div>
                        )}
                        {session.next_step && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Next step
                            </p>
                            <p className="text-sm">{session.next_step}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSessions;