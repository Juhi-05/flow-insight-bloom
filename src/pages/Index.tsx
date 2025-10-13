import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, TrendingUp, FileText, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
      }
    });
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 animate-fade-in">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Welcome to <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>TrackHer</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Your personal companion for menstrual health and PCOS wellness
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="rounded-xl text-lg px-8"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
            </Button>
            {!isAuthenticated && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/auth")}
                className="rounded-xl text-lg px-8"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: Calendar,
              title: "Cycle Tracking",
              description: "Log and predict your menstrual cycles with ease",
              color: "primary",
            },
            {
              icon: FileText,
              title: "Symptom Logs",
              description: "Track daily symptoms and PCOS indicators",
              color: "secondary",
            },
            {
              icon: TrendingUp,
              title: "Smart Insights",
              description: "Discover patterns and get personalized tips",
              color: "accent",
            },
            {
              icon: Sparkles,
              title: "Privacy First",
              description: "Your health data is secure and private",
              color: "primary",
            },
          ].map((feature, index) => (
            <Card 
              key={index}
              className="rounded-2xl backdrop-blur-sm animate-fade-in hover:shadow-lg transition-all"
              style={{ 
                background: "var(--gradient-card)",
                animationDelay: `${0.4 + index * 0.1}s`
              }}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-14 h-14 rounded-full bg-${feature.color}/10 flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mt-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Simple, Supportive, Yours
          </h2>
          
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Create Your Account",
                description: "Sign up in seconds with just your email. Your data stays private and secure.",
              },
              {
                step: "2",
                title: "Track Your Wellness",
                description: "Log periods, symptoms, and PCOS indicators. It takes less than a minute each day.",
              },
              {
                step: "3",
                title: "Unlock Insights",
                description: "Get personalized predictions, patterns, and recommendations based on your unique data.",
              },
            ].map((item, index) => (
              <div 
                key={index}
                className="flex gap-6 items-start animate-fade-in"
                style={{ animationDelay: `${1 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-24">
          <Card className="max-w-2xl mx-auto rounded-2xl backdrop-blur-sm" style={{ background: "var(--gradient-card)" }}>
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to take control of your health?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join TrackHer today and start your wellness journey
              </p>
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="rounded-xl text-lg px-12"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Tracking Now"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
