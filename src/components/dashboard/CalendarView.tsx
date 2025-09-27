import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Habit, HabitHistory } from "@/pages/Dashboard";
import { useState } from "react";

interface CalendarViewProps {
  habits: Habit[];
}

const CalendarView = ({ habits }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const completedHabitsForDate = habits.filter((habit) => {
    if (!selectedDate) return false;
    const selectedStr = selectedDate.toDateString();

    // Check history for selected date
    return habit.history?.some(
      (h: HabitHistory) =>
        new Date(h.date).toDateString() === selectedStr && h.completed
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Habit Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate
              ? `Habits for ${selectedDate.toLocaleDateString()}`
              : "Select a date"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedHabitsForDate.length > 0 ? (
            <div className="space-y-2">
              {completedHabitsForDate.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="font-medium">{habit.name}</span>
                  <Badge variant="secondary">{habit.category}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No completed habits for this date.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
