const TrustedBy = () => {
  const brands = [
    { name: "TechCorp", logo: "TC" },
    { name: "Innovate", logo: "IN" },
    { name: "Future Labs", logo: "FL" },
    { name: "Digital Flow", logo: "DF" },
    { name: "Creative Hub", logo: "CH" },
    { name: "Growth Co", logo: "GC" },
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Trusted by teams at
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className="flex items-center justify-center animate-fade-in hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-secondary shadow-soft">
                <span className="text-lg font-bold text-primary">{brand.logo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;