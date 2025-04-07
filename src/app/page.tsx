import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Modern Project Management
        </h1>
        <p className="text-xl text-muted-foreground">
          Streamline your workflow, manage tasks, and collaborate with your team
          efficiently.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/projects">View Demo</Link>
          </Button>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Kanban Boards"
            description="Visual task management with drag-and-drop kanban boards."
          />
          <FeatureCard
            title="Team Collaboration"
            description="Work together seamlessly with real-time updates."
          />
          <FeatureCard
            title="Progress Tracking"
            description="Track project progress and team productivity."
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
} 