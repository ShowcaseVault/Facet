import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export function FeatureSection() {
  const features = [
    {
      title: "Organize Collections",
      description: "Group related repositories into meaningful collections like 'AI Experiments' or 'Web Tools'.",
      icon: "📁",
    },
    {
      title: "Add Context",
      description: "Don't just list code. Add notes to explain *why* you built it and what you learned.",
      icon: "📝",
    },
    {
      title: "Share Your Story",
      description: "Get a clean, public profile link that recruiters can actually read and understand.",
      icon: "🚀",
    },
  ];

  return (
    <section className="bg-muted/50 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Facet?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
                GitHub profiles are chronologically ordered. Your career isn't.
            </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background border-none shadow-md">
              <CardHeader>
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
