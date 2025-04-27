"use client";

import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartBarIcon,
  DocumentCheckIcon,
  BriefcaseIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Skeleton } from "@/components/ui/skeleton";

const stats = [
  {
    name: "Applications Sent",
    value: "24",
    change: "+4.75%",
    changeType: "positive",
    icon: DocumentCheckIcon,
  },
  {
    name: "Success Rate",
    value: "12.5%",
    change: "+2.1%",
    changeType: "positive",
    icon: ChartBarIcon,
  },
  {
    name: "Active Jobs",
    value: "8",
    change: "-3",
    changeType: "negative",
    icon: BriefcaseIcon,
  },
  {
    name: "Avg. Response Time",
    value: "2.4 days",
    change: "-0.5 days",
    changeType: "positive",
    icon: ClockIcon,
  },
];

const recentActivity = [
  {
    company: "TechCorp Inc.",
    position: "Senior Software Engineer",
    status: "Applied",
    date: "2h ago",
  },
  {
    company: "InnovateLabs",
    position: "Full Stack Developer",
    status: "Interview",
    date: "1d ago",
  },
  {
    company: "DataSys Solutions",
    position: "Backend Engineer",
    status: "Rejected",
    date: "2d ago",
  },
];

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-24" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-4 text-center">
        <h1 className="text-3xl font-bold">Welcome to Talik Auto Apply</h1>
        <p className="text-muted-foreground max-w-md">
          Sign in to start managing your job applications and track your progress.
        </p>
        <Button asChild>
          <a href="/sign-in">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p
                    className={`ml-2 text-sm ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div>
                <p className="font-medium">{activity.company}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.position}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    activity.status === "Applied"
                      ? "bg-blue-100 text-blue-800"
                      : activity.status === "Interview"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {activity.status}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
