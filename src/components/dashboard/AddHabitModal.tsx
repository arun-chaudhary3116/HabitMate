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
import { useState } from "react";
import { Habit } from "../../pages/Dashboard";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    habit: Omit<Habit, "id" | "completed" | "streak"> & {
      lastCompleted: Date | null;
    }
  ) => void;
}

const AddHabitModal = ({ isOpen, onClose, onAdd }: AddHabitModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    category: "",
    color: "bg-primary",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.goal || !formData.category) return;

    await onAdd({
      name: formData.name,
      goal: formData.goal,
      category: formData.category,
      color: formData.color,
      lastCompleted: null,
    });

    setFormData({ name: "", goal: "", category: "", color: "bg-primary" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
          <DialogDescription>
            Create a habit by filling the form below.
          </DialogDescription>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              placeholder="e.g., Morning Workout"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Goal</Label>
            <Input
              id="goal"
              placeholder="e.g., 30 minutes daily"
              value={formData.goal}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, goal: e.target.value }))
              }
              required
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Habit</Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitModal;
