import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, Target, Trash } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  goal: string;
  completed: boolean;
  streak: number;
  category: string;
  color: string;
}

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
  onDelete: (id: string) => void; // callback for delete
}

const HabitCard = ({ habit, onToggle, onDelete }: HabitCardProps) => {
  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg ${
        habit.completed ? "ring-2 ring-primary" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{habit.name}</h3>
            <p className="text-sm text-muted-foreground">{habit.goal}</p>
          </div>
          <Badge variant="secondary" className="ml-2">
            {habit.category}
          </Badge>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {habit.streak} day streak
            </span>
          </div>

          <div className="flex space-x-2">
            {/* Toggle Complete Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onToggle}
                variant={habit.completed ? "default" : "outline"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <motion.div
                  animate={{ rotate: habit.completed ? 360 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Check className="h-4 w-4" />
                </motion.div>
                <span>{habit.completed ? "Done" : "Mark Done"}</span>
              </Button>
            </motion.div>

            {/* Delete / Manage Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => onDelete(habit.id)}
                variant="destructive"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Trash className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </motion.div>
          </div>
        </div>

        {habit.completed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-2 bg-primary/10 rounded-md"
          >
            <p className="text-sm text-primary font-medium">Great job! 🎉</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitCard;
