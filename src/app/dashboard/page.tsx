import { DashboardHeader } from "@/components/dashboard/header";
import { ProjectList } from "@/components/dashboard/project-list";
import { DashboardStats } from "@/components/dashboard/stats";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <DashboardStats />
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">My Projects</h2>
          <ProjectList />
        </div>
      </main>
    </div>
  );
} 