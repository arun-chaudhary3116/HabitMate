/* eslint-disable @typescript-eslint/no-explicit-any */
import AddHabitModal from "@/components/dashboard/AddHabitModal";
import CalendarView from "@/components/dashboard/CalendarView";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HabitCard from "@/components/dashboard/HabitCard";
import NotesJournal from "@/components/dashboard/NoteaJournal";
import ProgressStats from "@/components/dashboard/ProgressStats";
import StreakDisplay from "@/components/dashboard/StreakDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  Plus,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";

export interface HabitHistory {
  date: Date;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  goal: string;
  completed: boolean;
  streak: number;
  category: string;
  color: string;
  lastCompleted: Date | null;
  history?: HabitHistory[];
}

type ViewType = "habits" | "calendar" | "stats" | "journal";

const Dashboard = () => {
  const { user, loading: authLoading, loginWithOAuth } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>("habits");

  const todayString = new Date().toDateString();

  // Fetch habits once user is authenticated
  useEffect(() => {
    if (!authLoading && user) fetchUserHabits();
    else if (!authLoading) setLoading(false);
  }, [user, authLoading]);

  // OAuth callback handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userDataParam = urlParams.get("user");
    if (userDataParam && !user) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataParam));
        loginWithOAuth(userData);
      } catch (err) {
        console.error("Failed to parse OAuth user data:", err);
      }
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [user, loginWithOAuth]);

  // Fetch habits from backend
  const fetchUserHabits = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v2/habits", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch habits");
      const data: any[] = await res.json();

      setHabits(
        data.map((h, index) => {
          // Convert backend history
          const habitHistory: HabitHistory[] = h.history
            ? h.history.map((item: any) => ({
                date: new Date(item.date),
                completed: item.completed,
              }))
            : [];

          // Include lastCheckedDate in history
          if (h.lastCheckedDate) {
            const lastDate = new Date(h.lastCheckedDate);
            habitHistory.push({ date: lastDate, completed: true });
          }

          return {
            id: h._id || h.id || `habit-${index}`,
            name: h.title || h.name || "Untitled Habit",
            goal: h.description || h.goal || "Daily goal",
            completed:
              h.lastCheckedDate &&
              new Date(h.lastCheckedDate).toDateString() === todayString
                ? h.completedToday
                : false,
            streak: h.streak ?? 0,
            category: h.category || "General",
            color: h.color || "bg-primary",
            lastCompleted: h.lastCheckedDate
              ? new Date(h.lastCheckedDate)
              : null,
            history: habitHistory, // pass all past completions
          };
        })
      );
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch habits");
    } finally {
      setLoading(false);
    }
  };

  // Toggle habit completion
  const toggleHabit = async (id: string) => {
    try {
      const habitToToggle = habits.find((habit) => habit.id === id);
      if (!habitToToggle) return;

      if (
        habitToToggle.lastCompleted?.toDateString() === todayString &&
        habitToToggle.completed
      ) {
        return alert("Habit already completed today");
      }

      const response = await fetch(
        `http://localhost:8000/api/v2/habits/${id}/check`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ completed: true }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to toggle habit");
      }

      const updatedHabit = await response.json();

      setHabits((prev) =>
        prev.map((h) =>
          h.id === id
            ? {
                ...h,
                completed: true,
                streak: updatedHabit.streak,
                lastCompleted: updatedHabit.lastCompleted
                  ? new Date(updatedHabit.lastCompleted)
                  : new Date(),
                history: [
                  ...(h.history || []),
                  {
                    date: new Date(),
                    completed: true,
                  },
                ],
              }
            : h
        )
      );
    } catch (err) {
      console.error("Failed to toggle habit:", err);
      setError(err instanceof Error ? err.message : "Failed to update habit");
    }
  };

  const addHabit = async (
    newHabit: Omit<Habit, "id" | "completed" | "streak" | "lastCompleted">
  ) => {
    try {
      const response = await fetch("http://localhost:8000/api/v2/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: newHabit.name,
          description: newHabit.goal,
          category: newHabit.category,
          color: newHabit.color,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add habit");
      }

      const createdHabit = await response.json();

      setHabits((prev) => [
        ...prev,
        {
          id: createdHabit._id || createdHabit.id || `habit-${prev.length}`,
          name: createdHabit.title || createdHabit.name || "Untitled Habit",
          goal: createdHabit.description || "Daily goal",
          completed: false,
          streak: createdHabit.streak ?? 0,
          category: createdHabit.category || "General",
          color: createdHabit.color || "bg-primary",
          lastCompleted: createdHabit.lastCheckedDate
            ? new Date(createdHabit.lastCheckedDate)
            : null,
        },
      ]);

      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add habit:", err);
      throw err;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Stats calculations
  const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
  const completedToday = habits.filter((h) => h.completed).length;
  const successRate =
    habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  // Only show habits not completed today on the dashboard
  const todaysHabits = habits.filter(
    (h) =>
      !h.completed ||
      (h.lastCompleted &&
        new Date(h.lastCompleted).toDateString() !== todayString)
  );

  const handleDeleteHabit = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v2/habits/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to delete habit");

      // Remove habit from state
      setHabits((prev) => prev.filter((habit) => habit.id !== id));
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to delete habit");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              key: "todayProgress",
              icon: Target,
              title: "Today's Progress",
              value: `${completedToday}/${habits.length}`,
              color: "text-primary",
            },
            {
              key: "totalStreak",
              component: <StreakDisplay streak={totalStreak} />,
            },
            {
              key: "badges",
              icon: Award,
              title: "Badges Earned",
              value: "3",
              color: "text-accent",
            },
            {
              key: "successRate",
              icon: BarChart3,
              title: "Success Rate",
              value: `${successRate}%`,
              color: "text-secondary",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.key || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {stat.component || (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {/* View Navigation */}
        <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
          {[
            { key: "habits", label: "Habits", icon: Target },
            { key: "calendar", label: "Calendar", icon: Calendar },
            { key: "stats", label: "Stats", icon: BarChart3 },
            { key: "journal", label: "Journal", icon: BookOpen },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeView === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView(key as ViewType)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>

        {/* Active View */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === "habits" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Today's Habits</h2>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Habit</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {todaysHabits.map((habit, index) => (
                  <motion.div
                    key={habit.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <HabitCard
                      habit={habit}
                      onToggle={() => toggleHabit(habit.id)}
                      onDelete={handleDeleteHabit}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeView === "calendar" && <CalendarView habits={habits} />}
          {activeView === "stats" && <ProgressStats habits={habits} />}
          {activeView === "journal" && <NotesJournal />}
        </motion.div>
      </div>

      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addHabit}
      />
    </div>
  );
};

export default Dashboard;
