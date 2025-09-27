import { motion } from "framer-motion";

const Marquee = () => {
  const marquee = [
    "/behance.png",
    "/facebook.png",
    "github.png",
    "google.png",
    "linkedin.png",
    "pinterest.png",
    "rss.png",
    "twitter.png",
  ];

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Decorative blurred elements to match Hero */}
      <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-light rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Trusted by teams at
          </p>
        </div>

        {/* Infinite Marquee Container */}
        <div className="flex">
          {[0, 1, 2].map((_, groupIndex) => (
            <motion.div
              key={groupIndex}
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="flex items-center justify-center flex-shrink-0"
            >
              {marquee.map((brand, index) => (
                <div
                  key={`${groupIndex}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center hover-lift mr-44"
                >
                  <div className="flex items-center justify-center w-30 h-20 rounded-xl bg-background/80 backdrop-blur-sm shadow-soft border border-border/50 p-3 hover:bg-background transition-all duration-300">
                    <img
                      src={brand}
                      className="w-full h-full object-contain filter dark:invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marquee;
