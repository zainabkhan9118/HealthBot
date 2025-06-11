// Resources.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const resources = [
  {
    title: "Mindfulness Meditation",
    description: "A guided meditation to help you relax and focus.",
    link: "https://www.mindful.org/meditation/mindfulness-getting-started/"
  },
  {
    title: "Breathing Exercise",
    description: "Simple breathing techniques for stress relief.",
    link: "https://www.healthline.com/health/breathing-exercise"
  },
  {
    title: "Crisis Helpline",
    description: "If you need urgent help, call a helpline.",
    link: "https://www.opencounseling.com/suicide-hotlines"
  },
  {
    title: "Mental Health Articles",
    description: "Read articles on anxiety, depression, and self-care.",
    link: "https://www.mentalhealth.org.uk/explore-mental-health/publications"
  },
  {
    title: "Recommended Books",
    description: "Curated list of books for mental wellness.",
    link: "https://www.goodreads.com/shelf/show/mental-health"
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6E6FA]/30 to-white dark:from-[#1A1A1A] dark:to-black">
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-6 border-b border-[#E6E6FA] sticky top-0 z-10">
        <h1 className="text-2xl font-bold mb-6 text-[#7C5DC7]">Resources</h1>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 p-6">
        {resources.map((res, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{res.title}</CardTitle>
              <CardDescription>{res.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-[#9B7EDC] underline hover:text-[#7C5DC7]">Visit Resource</a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
