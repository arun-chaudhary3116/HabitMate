import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood: string;
}

// Response type from API
interface JournalResponse {
  id: string;
  date: string; // string from backend
  content: string;
  mood: string;
}

const NotesJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState("Neutral");

  const moods = [
    "Happy",
    "Energetic",
    "Calm",
    "Determined",
    "Stressed",
    "Tired",
    "Motivated",
  ];

  // Fetch all journal entries
  const fetchEntries = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v2/journal", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch journal entries");

      const data: JournalResponse[] = await res.json();

      setEntries(
        data.map((entry) => ({
          id: entry.id,
          date: new Date(entry.date),
          content: entry.content,
          mood: entry.mood,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Add new entry
  const addEntry = async () => {
    if (!newEntry.trim()) return;

    try {
      const res = await fetch("http://localhost:8000/api/v2/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newEntry, mood: selectedMood }),
      });

      if (!res.ok) throw new Error("Failed to add entry");

      const saved: JournalResponse = await res.json();

      const entry: JournalEntry = {
        id: saved.id,
        date: new Date(saved.date),
        content: saved.content,
        mood: saved.mood,
      };

      setEntries((prev) => [entry, ...prev]);
      setNewEntry("");
      setSelectedMood("Neutral");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete entry
  const deleteEntry = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v2/journal/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete entry");

      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Mood color badges
  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      Happy: "bg-yellow-100 text-yellow-800",
      Energetic: "bg-orange-100 text-orange-800",
      Calm: "bg-blue-100 text-blue-800",
      Determined: "bg-purple-100 text-purple-800",
      Stressed: "bg-red-100 text-red-800",
      Tired: "bg-gray-100 text-gray-800",
      Motivated: "bg-green-100 text-green-800",
      Neutral: "bg-gray-100 text-gray-800",
    };
    return colors[mood] || colors.Neutral;
  };

  return (
    <div className="space-y-6">
      {/* Journal Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Daily Journal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="How did your habits go today? What are you feeling?"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            className="min-h-[100px]"
          />

          <div className="flex items-center justify-between">
            {/* Mood Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Mood:</span>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                {moods.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Button */}
            <Button
              onClick={addEntry}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Entry</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Previous Entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Previous Entries</h3>
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  {/* Date + Mood */}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {entry.date.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={getMoodColor(entry.mood)}
                    >
                      {entry.mood}
                    </Badge>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{entry.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotesJournal;
