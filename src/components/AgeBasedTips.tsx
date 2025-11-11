import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface AgeBasedTipsProps {
  age: number | null;
}

const AgeBasedTips = ({ age }: AgeBasedTipsProps) => {
  const getTipsForAge = () => {
    if (!age) return null;

    if (age >= 13 && age <= 19) {
      return {
        category: "Teen (13-19)",
        tips: [
          "Learn and understand your menstrual cycle patterns",
          "Maintain a balanced diet rich in iron and vitamins",
          "Avoid excessive stress through relaxation techniques",
          "Stay physically active with regular exercise",
          "Keep track of your periods to understand your body better"
        ]
      };
    } else if (age >= 20 && age <= 35) {
      return {
        category: "Adult (20-35)",
        tips: [
          "Track your cycle regularly for fertility awareness",
          "Stay well-hydrated throughout the day",
          "Maintain healthy iron levels through diet or supplements",
          "Monitor cycle regularity and consult a doctor if irregular",
          "Practice stress management for hormonal balance"
        ]
      };
    } else if (age >= 36 && age <= 50) {
      return {
        category: "Mature (36-50)",
        tips: [
          "Exercise regularly for hormonal balance",
          "Be aware of PCOS symptoms and irregular cycles",
          "Consult a healthcare provider for any irregularities",
          "Maintain a healthy weight through balanced nutrition",
          "Consider hormone level checks if experiencing changes"
        ]
      };
    } else if (age >= 51) {
      return {
        category: "Menopause (51+)",
        tips: [
          "Focus on calcium-rich foods for bone health",
          "Schedule regular health checkups",
          "Manage menopause symptoms with proper care",
          "Stay active to maintain overall wellness",
          "Discuss hormone therapy options with your doctor if needed"
        ]
      };
    }
    
    return null;
  };

  const tipsData = getTipsForAge();

  if (!tipsData) return null;

  return (
    <Card className="rounded-2xl" style={{ background: "var(--gradient-card)" }}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Personalized Health Tips</CardTitle>
            <CardDescription>{tipsData.category}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tipsData.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span className="text-sm text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AgeBasedTips;