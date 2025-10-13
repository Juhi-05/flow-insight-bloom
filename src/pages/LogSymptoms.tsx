import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText } from "lucide-react";
import { format } from "date-fns";

const LogSymptoms = () => {
  const [logDate, setLogDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [mood, setMood] = useState("");
  const [crampsSeverity, setCrampsSeverity] = useState(0);
  const [flowIntensity, setFlowIntensity] = useState("");
  const [fatigueLevel, setFatigueLevel] = useState(0);
  const [acneSeverity, setAcneSeverity] = useState(0);
  const [bloatingLevel, setBloatingLevel] = useState(0);
  const [sleepQuality, setSleepQuality] = useState(0);
  const [pcosHairGrowth, setPcosHairGrowth] = useState(false);
  const [pcosHairLoss, setPcosHairLoss] = useState(false);
  const [pcosWeightChange, setPcosWeightChange] = useState("");
  const [insulinNotes, setInsulinNotes] = useState("");
  const [otherSymptoms, setOtherSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);

    try {
      const symptomData = {
        user_id: userId,
        log_date: logDate,
        mood: mood || null,
        cramps_severity: crampsSeverity,
        flow_intensity: flowIntensity || null,
        fatigue_level: fatigueLevel,
        acne_severity: acneSeverity,
        bloating_level: bloatingLevel,
        sleep_quality: sleepQuality,
        pcos_hair_growth: pcosHairGrowth,
        pcos_hair_loss: pcosHairLoss,
        pcos_weight_change: pcosWeightChange ? parseFloat(pcosWeightChange) : null,
        insulin_notes: insulinNotes || null,
        other_symptoms: otherSymptoms || null,
      };

      const { error } = await supabase.from("symptom_logs").insert(symptomData);

      if (error) throw error;

      toast({
        title: "Symptoms logged!",
        description: "Your daily log has been saved successfully.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Log Symptoms</h1>
              <p className="text-muted-foreground">Track your daily wellness</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="rounded-2xl backdrop-blur-sm" style={{ background: "var(--gradient-card)" }}>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logDate">Date *</Label>
                <Input
                  id="logDate"
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  required
                  max={format(new Date(), "yyyy-MM-dd")}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">Mood</Label>
                <Input
                  id="mood"
                  type="text"
                  placeholder="e.g., Happy, Anxious, Tired"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flowIntensity">Flow Intensity</Label>
                <Select value={flowIntensity} onValueChange={setFlowIntensity}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="spotting">Spotting</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="heavy">Heavy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl backdrop-blur-sm" style={{ background: "var(--gradient-card)" }}>
            <CardHeader>
              <CardTitle>Symptom Severity</CardTitle>
              <CardDescription>Rate from 0 (none) to 10 (severe)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Cramps", value: crampsSeverity, setter: setCrampsSeverity },
                { label: "Fatigue", value: fatigueLevel, setter: setFatigueLevel },
                { label: "Acne", value: acneSeverity, setter: setAcneSeverity },
                { label: "Bloating", value: bloatingLevel, setter: setBloatingLevel },
                { label: "Sleep Quality", value: sleepQuality, setter: setSleepQuality },
              ].map(({ label, value, setter }) => (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{label}</Label>
                    <span className="text-sm font-medium">{value}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={value}
                    onChange={(e) => setter(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl backdrop-blur-sm" style={{ background: "var(--gradient-card)" }}>
            <CardHeader>
              <CardTitle>PCOS Related</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hairGrowth"
                  checked={pcosHairGrowth}
                  onCheckedChange={(checked) => setPcosHairGrowth(checked as boolean)}
                />
                <Label htmlFor="hairGrowth" className="cursor-pointer">
                  Excess hair growth (hirsutism)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hairLoss"
                  checked={pcosHairLoss}
                  onCheckedChange={(checked) => setPcosHairLoss(checked as boolean)}
                />
                <Label htmlFor="hairLoss" className="cursor-pointer">
                  Hair loss/thinning
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightChange">Weight Change (kg)</Label>
                <Input
                  id="weightChange"
                  type="number"
                  step="0.1"
                  placeholder="e.g., +0.5 or -1.2"
                  value={pcosWeightChange}
                  onChange={(e) => setPcosWeightChange(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insulinNotes">Insulin/Glucose Notes</Label>
                <Textarea
                  id="insulinNotes"
                  placeholder="Any notes about blood sugar, insulin resistance, etc."
                  value={insulinNotes}
                  onChange={(e) => setInsulinNotes(e.target.value)}
                  rows={3}
                  className="rounded-xl resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl backdrop-blur-sm" style={{ background: "var(--gradient-card)" }}>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="otherSymptoms"
                placeholder="Any other symptoms or notes for today..."
                value={otherSymptoms}
                onChange={(e) => setOtherSymptoms(e.target.value)}
                rows={4}
                className="rounded-xl resize-none"
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full rounded-xl"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Symptom Log"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default LogSymptoms;
