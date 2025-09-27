import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Habit } from "@/pages/Dashboard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProgressStatsProps {
  habits: Habit[];
}

const ProgressStats = ({ habits }: ProgressStatsProps) => {
  // Filter completed habits in the last 7 days for weekly stats
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 6);

  const weeklyHabits = habits.filter((habit) => {
    if (!habit.lastCompleted) return false;
    const last = new Date(habit.lastCompleted);
    return last >= weekAgo && last <= today;
  });

  // Prepare weekly data for BarChart
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - (6 - i));
    const dayName = days[date.getDay()];
    const completedCount = weeklyHabits.filter(
      (h) =>
        h.lastCompleted &&
        new Date(h.lastCompleted).toDateString() === date.toDateString()
    ).length;
    return { day: dayName, completed: completedCount };
  });

  // Prepare category data for PieChart
  const categoryData = habits.reduce((acc, habit) => {
    const category = habit.category;
    if (!acc[category]) {
      acc[category] = { name: category, value: 0, completed: 0 };
    }
    acc[category].value += 1;
    if (habit.completed) acc[category].completed += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; completed: number }>);

  const pieData = Object.values(categoryData);
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Habit Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{habit.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Streak: {habit.streak} days
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      habit.completed ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {habit.completed ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressStats;
