import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User } from "lucide-react";

const Profile = () => {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [typicalCycleLength, setTypicalCycleLength] = useState("28");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setFullName(data.full_name || "");
        setAge(data.age?.toString() || "");
        setTypicalCycleLength(data.typical_cycle_length?.toString() || "28");
        setMedicalNotes(data.medical_notes || "");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          age: age ? parseInt(age) : null,
          typical_cycle_length: parseInt(typicalCycleLength),
          medical_notes: medicalNotes || null,
        })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully.",
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
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Your Profile</h1>
              <p className="text-muted-foreground">Manage your personal information</p>
            </div>
          </div>
        </div>

        <Card className="rounded-2xl backdrop-blur-sm" style={{ background: "var(--gradient-card)" }}>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal and health details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  min="13"
                  max="120"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycleLength">Typical Cycle Length (days)</Label>
                <Input
                  id="cycleLength"
                  type="number"
                  value={typicalCycleLength}
                  onChange={(e) => setTypicalCycleLength(e.target.value)}
                  placeholder="28"
                  min="21"
                  max="45"
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground">
                  Average number of days between periods (typically 21-35 days)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalNotes">Medical Notes</Label>
                <Textarea
                  id="medicalNotes"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  placeholder="Any relevant medical information, diagnoses (e.g., PCOS), medications, etc."
                  rows={6}
                  className="rounded-xl resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
