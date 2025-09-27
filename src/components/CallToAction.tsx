import { Button } from "@/components/ui/button";
import CustomButton from "@/components/ui/CustomButton";
import { Sparkles } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-primary-foreground text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Start your journey today
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to transform your habits?
          </h2>

          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Join thousands of users who have already built lasting habits with
            HabitMate. Start your free trial today and see the difference
            consistency can make.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Use CustomButton here */}
            <CustomButton>Start Free Trial</CustomButton>

            <Button
              variant="outline"
              size="xl"
              className="bg-black text-white dark:bg-transparent dark:text-primary-foreground border-white/20 hover:opacity-90 dark:hover:bg-white/5"
            >
              Schedule Demo
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-primary-foreground/80">
            <div className="flex items-center">
              <span>✓</span>
              <span className="ml-1">No credit card required</span>
            </div>
            <div className="flex items-center">
              <span>✓</span>
              <span className="ml-1">14-day free trial</span>
            </div>
            <div className="flex items-center">
              <span>✓</span>
              <span className="ml-1">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 right-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
    </section>
  );
};

export default CallToAction;
