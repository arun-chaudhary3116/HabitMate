import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import FancyButton from "@/components/ui/customLogin&Signup";
import {
  FeatureItem,
  HoveredLink,
  MenuItem,
  Menu as NavMenu,
} from "@/components/ui/navbar-menu";
import {
  BarChart3,
  Menu,
  Moon,
  Sun,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(null);
  const { setTheme, theme } = useTheme();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold gradient-text">HabitMate</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <NavMenu setActive={setActive}>
                <MenuItem setActive={setActive} active={active} item="Home">
                  <div className="flex flex-col space-y-2 text-sm w-60">
                    <HoveredLink href="#hero">Get Started</HoveredLink>
                    <HoveredLink href="#trusted">Success Stories</HoveredLink>
                    <HoveredLink href="#cta">Join Community</HoveredLink>
                  </div>
                </MenuItem>

                <MenuItem setActive={setActive} active={active} item="Features">
                  <div className="text-sm grid grid-cols-1 gap-2 p-4 w-80">
                    <FeatureItem
                      title="Track Daily Goals"
                      href="#features"
                      icon={Target}
                      description="Set and monitor your daily habits with intuitive tracking tools."
                    />
                    <FeatureItem
                      title="Build Streaks"
                      href="#features"
                      icon={TrendingUp}
                      description="Maintain consistency and watch your streaks grow stronger."
                    />
                    <FeatureItem
                      title="Visual Insights"
                      href="#features"
                      icon={BarChart3}
                      description="Beautiful analytics to understand your progress patterns."
                    />
                  </div>
                </MenuItem>

                <MenuItem setActive={setActive} active={active} item="Pricing">
                  <div className="flex flex-col space-y-2 text-sm w-48">
                    <HoveredLink href="#pricing">Free Plan</HoveredLink>
                    <HoveredLink href="#pricing">Pro Plan</HoveredLink>
                    <HoveredLink href="#pricing">Annual Plan</HoveredLink>
                    <HoveredLink href="#pricing">Coming Soon</HoveredLink>
                  </div>
                </MenuItem>

                <MenuItem setActive={setActive} active={active} item="Contact">
                  <div className="flex flex-col space-y-2 text-sm w-48">
                    <HoveredLink href="#contact">Support</HoveredLink>
                    <HoveredLink href="#contact">Documentation</HoveredLink>
                    <HoveredLink href="#contact">Community</HoveredLink>
                    <HoveredLink href="mailto:hello@habitmate.com">
                      Email Us
                    </HoveredLink>
                  </div>
                </MenuItem>
              </NavMenu>
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="w-9 h-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <FancyButton
              onClick={() => {
                setAuthMode("signin");
                setAuthModalOpen(true);
              }}
            >
              Login
            </FancyButton>

            <FancyButton
              onClick={() => {
                setAuthMode("signup");
                setAuthModalOpen(true);
              }}
            >
              Sign Up
            </FancyButton>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              <a
                href="#home"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-300"
              >
                Home
              </a>
              <a
                href="#features"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-300"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-300"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-300"
              >
                Contact
              </a>
              <div className="flex flex-col space-y-4 px-3 pt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="w-full justify-center"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
                  <span>Toggle Theme</span>
                </Button>

                <div className="flex flex-col space-y-4">
                  <FancyButton
                    onClick={() => {
                      setAuthMode("signin");
                      setAuthModalOpen(true);
                      setIsOpen(false);
                    }}
                  >
                    Login
                  </FancyButton>

                  <FancyButton
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthModalOpen(true);
                      setIsOpen(false);
                    }}
                  >
                    Sign Up
                  </FancyButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </nav>
  );
};

export default Navbar;
