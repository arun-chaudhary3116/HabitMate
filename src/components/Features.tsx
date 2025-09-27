import { Target, TrendingUp, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: Target,
      title: "Track Daily Goals",
      description: "Set up custom habits and track your daily progress with intuitive check-ins and reminders.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: TrendingUp,
      title: "Build Streaks",
      description: "Stay motivated with streak counters that celebrate your consistency and help you maintain momentum.",
      color: "bg-accent/50 text-primary",
    },
    {
      icon: BarChart3,
      title: "Visual Insights",
      description: "Get detailed analytics and beautiful charts that show your progress patterns and help you improve.",
      color: "bg-secondary/50 text-primary",
    },
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything you need to{" "}
            <span className="gradient-text animate-glow">build lasting habits</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            HabitMate provides all the tools you need to track, analyze, and improve your daily routines.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-card border border-border glass-effect"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              viewport={{ once: true }}
            >
              <motion.div 
                className={`inline-flex p-3 rounded-xl ${feature.color} mb-6`}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.5 }
                }}
              >
                <feature.icon className="h-6 w-6" />
              </motion.div>
              
              <motion.h3 
                className="text-xl font-semibold mb-4 text-card-foreground"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {feature.title}
              </motion.h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              {/* Animated background effect */}
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-10"
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Floating particles */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;