import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase, type MentalResetEntry } from "@/lib/supabase";

interface MoodState {
  calm: boolean;
  irritated: boolean;
  angry: boolean;
  overwhelmed: boolean;
}

interface ResetActivities {
  breathe: boolean;
  water: boolean;
  stretch: boolean;
  outside: boolean;
  tidy: boolean;
  affirmation: boolean;
  music: boolean;
  move: boolean;
  custom: boolean;
}

const MentalResetPlanner = () => {
  const { toast } = useToast();
  const [mood, setMood] = useState<MoodState>({
    calm: false,
    irritated: false,
    angry: false,
    overwhelmed: false,
  });

  const [activities, setActivities] = useState<ResetActivities>({
    breathe: false,
    water: false,
    stretch: false,
    outside: false,
    tidy: false,
    affirmation: false,
    music: false,
    move: false,
    custom: false,
  });

  const [customActivity, setCustomActivity] = useState("");
  const [controlAnswer, setControlAnswer] = useState("");
  const [notMyJobAnswer, setNotMyJobAnswer] = useState("");
  const [fiveDaysAnswer, setFiveDaysAnswer] = useState("");
  const [nextStep, setNextStep] = useState("");

  const handleMoodChange = (moodType: keyof MoodState) => {
    setMood(prev => ({
      calm: false,
      irritated: false,
      angry: false,
      overwhelmed: false,
      [moodType]: true,
    }));
  };

  const handleActivityChange = (activity: keyof ResetActivities) => {
    setActivities(prev => ({
      ...prev,
      [activity]: !prev[activity],
    }));
  };

  const getSelectedActivitiesCount = () => {
    return Object.values(activities).filter(Boolean).length;
  };

  const handleSave = async () => {
    if (!supabase) {
      toast({
        title: "Supabase Not Connected",
        description: "Please ensure Supabase is properly connected by clicking the green Supabase button in the top right.",
        variant: "destructive",
      });
      return;
    }

    const selectedMood = Object.entries(mood).find(([_, selected]) => selected)?.[0] || '';
    const selectedActivities = Object.entries(activities)
      .filter(([_, selected]) => selected)
      .map(([activity, _]) => activity);
    
    const entry: MentalResetEntry = {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      mood: selectedMood,
      activities: selectedActivities,
      custom_activity: customActivity || undefined,
      control_answer: controlAnswer || undefined,
      not_my_job_answer: notMyJobAnswer || undefined,
      five_days_answer: fiveDaysAnswer || undefined,
      next_step: nextStep || undefined,
    };

    try {
      const { error } = await supabase
        .from('mental_reset_entries')
        .insert([entry]);

      if (error) throw error;

      toast({
        title: "Saved Successfully",
        description: `Your mental reset session for ${new Date().toLocaleDateString()} has been saved.`,
      });
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setMood({
      calm: false,
      irritated: false,
      angry: false,
      overwhelmed: false,
    });
    setActivities({
      breathe: false,
      water: false,
      stretch: false,
      outside: false,
      tidy: false,
      affirmation: false,
      music: false,
      move: false,
      custom: false,
    });
    setCustomActivity("");
    setControlAnswer("");
    setNotMyJobAnswer("");
    setFiveDaysAnswer("");
    setNextStep("");
    
    toast({
      title: "Reset Complete",
      description: "Your planner has been cleared. Take a moment and start fresh.",
    });
  };

  const moodEmojis = {
    calm: { emoji: "😌", color: "bg-calm" },
    irritated: { emoji: "😔", color: "bg-warm" },
    angry: { emoji: "😠", color: "bg-red-200" },
    overwhelmed: { emoji: "😰", color: "bg-yellow-200" },
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-light text-focus tracking-wide uppercase">
            Mental Reset Planner
          </h1>
          <p className="text-muted-foreground text-lg tracking-wider uppercase">
            Calm Down & Refocus
          </p>
        </div>

        <Card className="border-gentle shadow-sm">
          <CardContent className="p-6 space-y-8">
            {/* Mood Check-in */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-foreground">CHECK IN WITH YOURSELF</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(moodEmojis).map(([key, { emoji, color }]) => (
                  <div key={key} className="text-center space-y-2">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full ${color} flex items-center justify-center text-2xl cursor-pointer transition-all hover:scale-105 ${
                        mood[key as keyof MoodState] ? "ring-2 ring-focus" : ""
                      }`}
                      onClick={() => handleMoodChange(key as keyof MoodState)}
                    >
                      {emoji}
                    </div>
                    <p className="text-sm font-medium capitalize">{key}</p>
                    <Checkbox
                      checked={mood[key as keyof MoodState]}
                      onCheckedChange={() => handleMoodChange(key as keyof MoodState)}
                      className="mx-auto"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Activities */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-foreground">DO 3 OF THESE TO RESET</h2>
                <span className="text-sm text-muted-foreground">
                  {getSelectedActivitiesCount()}/3 selected
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { key: "breathe", label: "Take 3 slow breaths" },
                  { key: "water", label: "Drink water" },
                  { key: "stretch", label: "Stretch for 30 seconds" },
                  { key: "outside", label: "Step outside briefly" },
                  { key: "tidy", label: "Tidy one small thing" },
                  { key: "affirmation", label: 'Say: "I\'m safe. I can do this."' },
                  { key: "music", label: "Put on calming music or silence" },
                  { key: "move", label: "Move your body" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-3">
                    <Checkbox
                      id={key}
                      checked={activities[key as keyof ResetActivities]}
                      onCheckedChange={() => handleActivityChange(key as keyof ResetActivities)}
                    />
                    <label htmlFor={key} className="text-sm font-medium cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="custom"
                    checked={activities.custom}
                    onCheckedChange={() => handleActivityChange("custom")}
                  />
                  <label htmlFor="custom" className="text-sm font-medium">
                    Write your own:
                  </label>
                  <Input
                    placeholder="Custom activity..."
                    value={customActivity}
                    onChange={(e) => setCustomActivity(e.target.value)}
                    className="flex-1 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Zoom Out Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-foreground">ZOOM OUT</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    What can I control right now?
                  </label>
                  <Input
                    placeholder="Write your thoughts..."
                    value={controlAnswer}
                    onChange={(e) => setControlAnswer(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">
                    What is not my job to fix?
                  </label>
                  <Input
                    placeholder="Write your thoughts..."
                    value={notMyJobAnswer}
                    onChange={(e) => setNotMyJobAnswer(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Will this still matter in 5 days?
                  </label>
                  <Input
                    placeholder="Write your thoughts..."
                    value={fiveDaysAnswer}
                    onChange={(e) => setFiveDaysAnswer(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* One Small Action */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-foreground">ONE SMALL ACTION</h2>
              <div>
                <label className="text-sm font-medium block mb-2">
                  My next right step is:
                </label>
                <Input
                  placeholder="What's one small thing you can do right now?"
                  value={nextStep}
                  onChange={(e) => setNextStep(e.target.value)}
                  className="mb-4"
                />
              </div>
              <div className="text-center space-y-4">
                <p className="text-lg font-medium text-focus">Let's go!</p>
                <p className="text-sm italic text-muted-foreground">
                  You've done hard things before — you can do this too.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={handleSave} className="px-8">
                Save Session
              </Button>
              <Button onClick={handleReset} variant="outline" className="px-8">
                Reset Planner
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentalResetPlanner;