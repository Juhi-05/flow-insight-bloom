import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Heart, TrendingUp, LogOut, User as UserIcon, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HealthChatbot } from "@/components/HealthChatbot";
import { format } from "date-fns";
import AgeBasedTips from "@/components/AgeBasedTips";
import MaleEducationContent from "@/components/MaleEducationContent";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avgCycle, setAvgCycle] = useState<number | null>(null);
  const [nextPeriod, setNextPeriod] = useState<string | null>(null);
  const [logsCount, setLogsCount] = useState<number>(0);
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [typicalCycleLength, setTypicalCycleLength] = useState<number>(28);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        } else {
          fetchDashboardData(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchDashboardData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchDashboardData = async (userId: string) => {
    try {
      // Fetch user profile for gender, age, and name
      const { data: profile } = await supabase
        .from("profiles")
        .select("gender, age, full_name, typical_cycle_length")
        .eq("id", userId)
        .single();
      
      if (profile) {
        setGender(profile.gender);
        setAge(profile.age);
        setFullName(profile.full_name || "");
        setTypicalCycleLength(profile.typical_cycle_length || 28);
        
        // Check if this is first login (no cycles logged yet)
        const { data: cycles } = await supabase
          .from("cycles")
          .select("id")
          .eq("user_id", userId)
          .limit(1);
        
        setIsFirstLogin(!cycles || cycles.length === 0);
      }

      // Fetch cycles data
      const { data: cycles, error: cyclesError } = await supabase
        .from("cycles")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: false });

      if (cyclesError) throw cyclesError;

      // Calculate average cycle length
      if (cycles && cycles.length > 0) {
        const cyclesWithLength = cycles.filter(c => c.cycle_length);
        if (cyclesWithLength.length > 0) {
          const avg = cyclesWithLength.reduce((sum, c) => sum + (c.cycle_length || 0), 0) / cyclesWithLength.length;
          setAvgCycle(Math.round(avg));
        }

      // Predict next period
      const lastCycle = cycles[0];
      if (lastCycle && lastCycle.start_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(lastCycle.start_date);
        startDate.setHours(0, 0, 0, 0);
        
        // Check if cycle is ongoing
        if (lastCycle.end_date) {
          const endDate = new Date(lastCycle.end_date);
          endDate.setHours(0, 0, 0, 0);
          
          if (today >= startDate && today <= endDate) {
            setNextPeriod("Cycle ongoing");
            return;
          }
          
          // Calculate next period from end_date using user's typical cycle length
          const avgLength = typicalCycleLength;
          const nextDate = new Date(endDate);
          nextDate.setDate(nextDate.getDate() + Math.round(avgLength));
          const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          const formattedDate = format(nextDate, "MMM dd, yyyy");
          if (daysUntil > 0) {
            setNextPeriod(`${formattedDate} (in ${daysUntil} days)`);
          } else {
            const daysOverdue = Math.abs(daysUntil);
            setNextPeriod(`${formattedDate} (overdue by ${daysOverdue} days)`);
          }
        }
      }
      }

      // Count symptom logs for this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: logs, error: logsError } = await supabase
        .from("symptom_logs")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .gte("log_date", startOfMonth.toISOString().split("T")[0]);

      if (logsError) throw logsError;
      setLogsCount(logs?.length || 0);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">TrackHer</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              className="rounded-xl"
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {gender === "male" ? (
          <>
            {isFirstLogin && fullName && (
              <Card className="rounded-2xl mb-8 backdrop-blur-sm border-primary/20" style={{ background: "var(--gradient-card)" }}>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-2">Welcome, {fullName}! 👋</h2>
                  <p className="text-muted-foreground">Let's help you understand and support the women in your life better.</p>
                </CardContent>
              </Card>
            )}
            <MaleEducationContent />
          </>
        ) : (
          <>
            {isFirstLogin && fullName && (
              <Card className="rounded-2xl mb-8 backdrop-blur-sm border-primary/20" style={{ background: "var(--gradient-card)" }}>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-2">Welcome, {fullName}! 🌸</h2>
                  <p className="text-muted-foreground">Let's personalize your experience and start tracking your wellness journey.</p>
                </CardContent>
              </Card>
            )}
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
              <p className="text-muted-foreground">Here's your health overview</p>
            </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all rounded-2xl backdrop-blur-sm"
            style={{ background: "var(--gradient-card)" }}
            onClick={() => navigate("/track-cycle")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Track Cycle</CardTitle>
              <CardDescription>Log your period and cycle data</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all rounded-2xl backdrop-blur-sm"
            style={{ background: "var(--gradient-card)" }}
            onClick={() => navigate("/log-symptoms")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Log Symptoms</CardTitle>
              <CardDescription>Track daily symptoms and wellness</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all rounded-2xl backdrop-blur-sm"
            style={{ background: "var(--gradient-card)" }}
            onClick={() => navigate("/insights")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>View Insights</CardTitle>
              <CardDescription>Discover patterns and trends</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Cycle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {avgCycle ? `${avgCycle} days` : "No data yet"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Based on your history</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Next Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {nextPeriod || "No data yet"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Predicted date</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Logs This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{logsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Symptom entries</p>
            </CardContent>
          </Card>
        </div>

        {/* Age-Based Tips */}
        <AgeBasedTips age={age} />
          </>
        )}
      </main>
      
      <HealthChatbot />
    </div>
  );
};

export default Dashboard;
