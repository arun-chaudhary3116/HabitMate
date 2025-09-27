import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with habit tracking",
      features: [
        "Track up to 5 habits",
        "Basic streak tracking",
        "Mobile app access",
        "Weekly insights",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$2",
      period: "for 3 months",
      description: "Unlock advanced features and unlimited habits",
      features: [
        "Unlimited habits",
        "Advanced analytics",
        "Custom reminders",
        "Data export",
        "Priority support",
        "Team collaboration",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Annual",
      price: "$14",
      period: "per month",
      description: "Perfect for teams and organizations",
      features: [
        "Everything in Pro",
        "Team dashboard",
        "Admin controls",
        "Bulk user management",
        "Custom branding",
        "Advanced reporting",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your needs. Start free and upgrade as you
            grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 animate-slide-up ${
                plan.popular
                  ? "border-primary bg-gradient-secondary shadow-large scale-105 "
                  : "border-border bg-card hover:shadow-medium hover:scale-105 "
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 ">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold ">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4 flex items-baseline justify-center gap-2">
                  {/* Only show line-through for Pro plan */}
                  {plan.name === "Pro" && (
                    <span className="line-through">$2</span>
                  )}

                  {/* Current price */}
                  <span className="text-4xl font-bold">
                    {plan.name === "Pro" ? "$0" : plan.price}
                  </span>

                  <span
                    className={`ml-1 ${
                      plan.popular ? "text-white/70" : "text-muted-foreground"
                    }`}
                  >
                    /{plan.period}
                  </span>
                </div>

                <p
                  className={`${
                    plan.popular ? "text-white/80 " : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0 " />
                    <span className="text-card-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "hero" : "outline"}
                size="lg"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
