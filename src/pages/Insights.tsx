import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { HealthChatbot } from "@/components/HealthChatbot";

interface AgeBasedTips {
  category: string;
  icon: string;
  tips: string[];
}

const getAgeBasedTips = (age: number | null): AgeBasedTips[] => {
  if (!age) return [];

  if (age >= 13 && age <= 19) {
    // Teens
    return [
      {
        category: "Understanding Your Cycle",
        icon: "📚",
        tips: [
          "Track your period to understand your cycle pattern",
          "Learn about the phases of menstruation",
          "It's normal for cycles to be irregular in the first 2-3 years",
        ],
      },
      {
        category: "Nutrition & Wellness",
        icon: "🥗",
        tips: [
          "Eat iron-rich foods like leafy greens and lean proteins",
          "Stay hydrated throughout the day",
          "Maintain a balanced diet with whole grains and fruits",
        ],
      },
      {
        category: "Stress Management",
        icon: "🧘‍♀️",
        tips: [
          "Practice relaxation techniques like deep breathing",
          "Get 8-10 hours of sleep each night",
          "Stay physically active with activities you enjoy",
        ],
      },
    ];
  } else if (age >= 20 && age <= 35) {
    // Adults
    return [
      {
        category: "Fertility Awareness",
        icon: "🌸",
        tips: [
          "Track ovulation if planning pregnancy",
          "Understand fertile window (typically days 11-21 of cycle)",
          "Consider basal body temperature tracking",
        ],
      },
      {
        category: "Healthy Habits",
        icon: "💪",
        tips: [
          "Maintain a healthy BMI for regular cycles",
          "Exercise moderately 30 minutes daily",
          "Limit alcohol and caffeine intake",
        ],
      },
      {
        category: "Cycle Optimization",
        icon: "⚡",
        tips: [
          "Note patterns between stress and cycle irregularities",
          "Eat anti-inflammatory foods like omega-3s",
          "Consider supplements like vitamin D and magnesium",
        ],
      },
    ];
  } else if (age >= 36 && age <= 50) {
    // Mature
    return [
      {
        category: "PCOS Management",
        icon: "🩺",
        tips: [
          "Monitor blood sugar levels regularly",
          "Focus on low-glycemic index foods",
          "Consider inositol supplementation (consult doctor)",
        ],
      },
      {
        category: "Hormonal Balance",
        icon: "⚖️",
        tips: [
          "Watch for changes in cycle length or flow",
          "Manage stress with yoga or meditation",
          "Support liver health with cruciferous vegetables",
        ],
      },
      {
        category: "Nutrition Focus",
        icon: "🍎",
        tips: [
          "Increase fiber intake for hormone regulation",
          "Choose organic produce when possible",
          "Limit processed foods and refined sugars",
        ],
      },
    ];
  } else {
    // Menopause (50+)
    return [
      {
        category: "Managing Symptoms",
        icon: "🌡️",
        tips: [
          "Track hot flashes and night sweats patterns",
          "Dress in layers for temperature changes",
          "Keep bedroom cool for better sleep",
        ],
      },
      {
        category: "Bone Health",
        icon: "🦴",
        tips: [
          "Increase calcium intake (1200mg daily)",
          "Get adequate vitamin D through sunlight or supplements",
          "Weight-bearing exercises strengthen bones",
        ],
      },
      {
        category: "Regular Checkups",
        icon: "👩‍⚕️",
        tips: [
          "Annual gynecological exams are essential",
          "Monitor bone density every 1-2 years",
          "Discuss HRT options with your doctor if needed",
        ],
      },
    ];
  }
};

const Insights = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("age")
            .eq("id", user.id)
            .single();
          
          if (data?.age) {
            setAge(data.age);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const ageBasedTips = getAgeBasedTips(age);

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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Health Insights</h1>
              <p className="text-muted-foreground">Discover patterns and get personalized tips</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <Card className="rounded-2xl backdrop-blur-sm" style={{ background: "var(--gradient-card)" }}>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">Loading your personalized tips...</div>
              </CardContent>
            </Card>
          ) : age && ageBasedTips.length > 0 ? (
            <>
              <Card className="rounded-2xl backdrop-blur-sm" style={{ background: "var(--gradient-card)" }}>
                <CardHeader>
                  <CardTitle>Personalized Tips for You</CardTitle>
                  <CardDescription>
                    Based on your age group, here are recommendations tailored to your health needs
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {ageBasedTips.map((section, idx) => (
                  <Card key={idx} className="rounded-2xl">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{section.icon}</span>
                        <CardTitle className="text-lg">{section.category}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.tips.map((tip, tipIdx) => (
                          <li key={tipIdx} className="text-sm flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-muted-foreground">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card className="rounded-2xl backdrop-blur-sm" style={{ background: "var(--gradient-card)" }}>
              <CardHeader>
                <CardTitle>Get Personalized Tips</CardTitle>
                <CardDescription>
                  Add your age in your profile to receive customized health recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/profile")} className="rounded-xl">
                  Complete Your Profile
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl backdrop-blur-sm" style={{ background: "var(--gradient-card)" }}>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Start logging your cycles and symptoms to unlock personalized insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Track Consistently</h3>
                  <p className="text-sm text-muted-foreground">
                    Log your cycles and symptoms regularly for at least 2-3 months to get accurate insights and predictions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                <Info className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Cycle Patterns</h3>
                  <p className="text-sm text-muted-foreground">
                    Once you have enough data, we'll show you trends in cycle length, symptom severity, and help predict your next period.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">AI Health Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the chat assistant to ask questions about menstrual health, PCOS, and wellness. Click the chat icon in the bottom right!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Wellness Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium mb-1">🥗 Nutrition</p>
                  <p className="text-muted-foreground">
                    Focus on low-GI foods, lean proteins, and healthy fats to help manage PCOS symptoms.
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-1">🏃‍♀️ Exercise</p>
                  <p className="text-muted-foreground">
                    Regular moderate exercise can help regulate cycles and improve insulin sensitivity.
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-1">😴 Sleep</p>
                  <p className="text-muted-foreground">
                    Aim for 7-9 hours of quality sleep to support hormonal balance.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm text-muted-foreground">Cycles Logged</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm text-muted-foreground">Symptom Entries</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm text-muted-foreground">Average Cycle</span>
                  <span className="font-medium">28 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tracking Since</span>
                  <span className="font-medium">Today</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <HealthChatbot />
    </div>
  );
};

export default Insights;
