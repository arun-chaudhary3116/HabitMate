import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-foreground hover:text-primary transition-colors duration-300"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden border border-border shadow-xl"
              >
                <motion.div
                  layout
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-border bg-background/95 backdrop-blur-md shadow-lg flex justify-center space-x-6 px-6 py-3 glass-effect"
    >
      {children}
    </nav>
  );
};

export const HoveredLink = ({ children, href, ...rest }) => {
  return (
    <a
      href={href}
      {...rest}
      className="text-muted-foreground hover:text-primary transition-colors duration-300 block px-3 py-2 rounded-md hover:bg-muted/50"
    >
      {children}
    </a>
  );
};

export const FeatureItem = ({
  title,
  description,
  href,
  icon: Icon,
}) => {
  return (
    <a href={href} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-1 text-foreground">
          {title}
        </h4>
        <p className="text-xs text-muted-foreground max-w-[12rem]">
          {description}
        </p>
      </div>
    </a>
  );
};