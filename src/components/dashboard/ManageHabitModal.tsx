import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Habit } from "../../pages/Dashboard";

interface ManageHabitModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedHabit: Partial<Habit>) => void;
  onDelete: (id: string) => void;
}

const ManageHabitModal = ({
  habit,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: ManageHabitModalProps) => {
  const [formData, setFormData] = useState({
    name: habit.name,
    goal: habit.goal,
    category: habit.category,
    color: habit.color,
  });

  const categories = [
    "Fitness",
    "Health",
    "Learning",
    "Productivity",
    "Mindfulness",
    "Social",
    "Creative",
  ];
  const colors = [
    { name: "Primary", value: "bg-primary" },
    { name: "Secondary", value: "bg-secondary" },
    { name: "Accent", value: "bg-accent" },
    { name: "Muted", value: "bg-muted" },
  ];

  useEffect(() => {
    setFormData({
      name: habit.name,
      goal: habit.goal,
      category: habit.category,
      color: habit.color,
    });
  }, [habit]);

  const handleUpdate = () => {
    onUpdate({ id: habit.id, ...formData });
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this habit permanently?")) {
      onDelete(habit.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Habit</DialogTitle>
          <DialogDescription>
            Edit or delete your habit below.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Goal</Label>
            <Input
              id="goal"
              value={formData.goal}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, goal: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Color Theme</Label>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, color: color.value }))
                  }
                  className={`w-8 h-8 rounded-full ${color.value} ${
                    formData.color === color.value
                      ? "ring-2 ring-offset-2 ring-foreground"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save</Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageHabitModal;
