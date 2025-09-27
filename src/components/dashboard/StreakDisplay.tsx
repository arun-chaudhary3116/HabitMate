import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakDisplayProps {
  streak: number;
}

const StreakDisplay = ({ streak }: StreakDisplayProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Flame className="h-8 w-8 text-orange-500" />
          </motion.div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">
              Total Streak
            </p>
            <motion.p
              className="text-2xl font-bold"
              animate={{ scale: streak > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {streak}
            </motion.p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakDisplay;
