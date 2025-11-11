import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, Users } from "lucide-react";

const MaleEducationContent = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Supporting Women's Health</h2>
        <p className="text-muted-foreground">Learn how to understand and support women during their menstrual cycle</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl" style={{ background: "var(--gradient-card)" }}>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Understanding Periods</CardTitle>
            <CardDescription>Basic knowledge about menstrual cycles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">What is a menstrual cycle?</h4>
              <p className="text-sm text-muted-foreground">
                A natural process that occurs roughly every 28 days, preparing the body for potential pregnancy.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Typical duration</h4>
              <p className="text-sm text-muted-foreground">
                Periods usually last 3-7 days, with the cycle length varying between 21-35 days.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl" style={{ background: "var(--gradient-card)" }}>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <CardTitle>Common Symptoms</CardTitle>
            <CardDescription>What women may experience</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-muted-foreground">Cramps and abdominal pain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-muted-foreground">Fatigue and low energy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-muted-foreground">Mood changes and irritability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-muted-foreground">Bloating and headaches</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl col-span-full" style={{ background: "var(--gradient-card)" }}>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <CardTitle>How to Be Supportive</CardTitle>
            <CardDescription>Practical ways to help and show empathy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">💡 Be Understanding</h4>
                <p className="text-sm text-muted-foreground">
                  Recognize that period pain and symptoms are real. Show empathy and patience during this time.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🍵 Helpful Actions</h4>
                <p className="text-sm text-muted-foreground">
                  Offer comfort items like heating pads, prepare warm beverages, or help with household tasks.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🥗 Nutritional Support</h4>
                <p className="text-sm text-muted-foreground">
                  Foods rich in iron (spinach, red meat), magnesium (bananas, nuts), and omega-3s can help reduce pain.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🗣️ Open Communication</h4>
                <p className="text-sm text-muted-foreground">
                  Ask how you can help rather than assuming. Everyone's experience is different.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaleEducationContent;