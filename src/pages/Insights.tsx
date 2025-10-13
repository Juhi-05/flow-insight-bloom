import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Info } from "lucide-react";

const Insights = () => {
  const navigate = useNavigate();

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
                  <h3 className="font-medium mb-1">PCOS Management</h3>
                  <p className="text-sm text-muted-foreground">
                    If you're tracking PCOS symptoms, we'll provide insights on hormonal patterns and lifestyle recommendations based on your data.
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
    </div>
  );
};

export default Insights;
