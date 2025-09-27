"use client";
import { cn } from "@/lib/utils";
import {
  motion,
  useAnimation,
  useInView,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import {
  Activity,
  Dumbbell,
  Eye,
  EyeOff,
  Flame,
  Heart,
  Target,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  forwardRef,
  memo,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

// ==================== Input Component ====================

const AnimatedInput = memo(
  forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    function AnimatedInput({ className, type, ...props }, ref) {
      const radius = 100;
      const [visible, setVisible] = useState(false);

      const mouseX = useMotionValue(0);
      const mouseY = useMotionValue(0);

      function handleMouseMove({
        currentTarget,
        clientX,
        clientY,
      }: React.MouseEvent<HTMLDivElement>) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }

      return (
        <motion.div
          style={{
            background: useMotionTemplate`
              radial-gradient(
                ${
                  visible ? radius + "px" : "0px"
                } circle at ${mouseX}px ${mouseY}px,
                hsl(var(--primary) / 0.2),
                transparent 80%
              )
            `,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className="group/input rounded-lg p-[2px] transition duration-300"
        >
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border-none bg-background px-3 py-2 text-sm text-foreground transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-soft",
              className
            )}
            ref={ref}
            {...props}
          />
        </motion.div>
      );
    }
  )
);

// ==================== BoxReveal Component ====================

type BoxRevealProps = {
  children: ReactNode;
  width?: string;
  boxColor?: string;
  duration?: number;
  overflow?: string;
  position?: string;
  className?: string;
};

const BoxReveal = memo(function BoxReveal({
  children,
  width = "fit-content",
  boxColor,
  duration,
  overflow = "hidden",
  position = "relative",
  className,
}: BoxRevealProps) {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      slideControls.start("visible");
      mainControls.start("visible");
    } else {
      slideControls.start("hidden");
      mainControls.start("hidden");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <section
      ref={ref}
      style={{
        position: position as
          | "relative"
          | "absolute"
          | "fixed"
          | "sticky"
          | "static",
        width,
        overflow,
      }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: duration ?? 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: "100%" } }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: duration ?? 0.5, ease: "easeIn" }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor ?? "hsl(var(--primary))",
          borderRadius: 4,
        }}
      />
    </section>
  );
});

// ==================== Ripple Component ====================

type RippleProps = {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
};

const Ripple = memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 11,
  className = "",
}: RippleProps) {
  return (
    <section
      className={`max-w-[50%] absolute inset-0 flex items-center justify-center
        bg-muted/30
        [mask-image:linear-gradient(to_bottom,black,transparent)] ${className}`}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        const borderOpacity = 5 + i * 5;

        return (
          <span
            key={i}
            className="absolute animate-ripple rounded-full bg-primary/15 border border-primary/20"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              animationDelay: animationDelay,
              borderStyle: borderStyle,
              borderWidth: "1px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </section>
  );
});

// ==================== OrbitingCircles Component ====================

type OrbitingCirclesProps = {
  className?: string;
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
};

const OrbitingCircles = memo(function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 50,
  path = true,
}: OrbitingCirclesProps) {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-primary/20 stroke-1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      <section
        style={
          {
            "--duration": duration,
            "--radius": radius,
            "--delay": -delay,
          } as React.CSSProperties
        }
        className={cn(
          "absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border border-primary/20 bg-primary/10",
          "[animation-delay:calc(var(--delay)*1000ms)]",
          { "[animation-direction:reverse]": reverse },
          className
        )}
      >
        {children}
      </section>
    </>
  );
});

// ==================== FitnessOrbitDisplay Component ====================

type IconConfig = {
  className?: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
  component: () => React.ReactNode;
};

type FitnessOrbitDisplayProps = {
  iconsArray: IconConfig[];
  text?: string;
};

const FitnessOrbitDisplay = memo(function FitnessOrbitDisplay({
  iconsArray,
  text = "Get Fit",
}: FitnessOrbitDisplayProps) {
  return (
    <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-primary to-primary/60 bg-clip-text text-center text-6xl font-bold leading-none text-transparent">
        {text}
      </span>

      {iconsArray.map((icon, index) => (
        <OrbitingCircles
          key={index}
          className={icon.className}
          duration={icon.duration}
          delay={icon.delay}
          radius={icon.radius}
          path={icon.path}
          reverse={icon.reverse}
        >
          {icon.component()}
        </OrbitingCircles>
      ))}
    </section>
  );
});

// ==================== AnimatedForm Component ====================

type FieldType = "text" | "email" | "password";

type Field = {
  label: string;
  required?: boolean;
  type: FieldType;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

type AnimatedFormProps = {
  header: string;
  subHeader?: string;
  fields: Field[];
  submitButton: string;
  textVariantButton?: string;
  errorField?: string;
  fieldPerRow?: number;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  googleLogin?: string;
  goTo?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type Errors = {
  [key: string]: string;
};

const AnimatedForm = memo(function AnimatedForm({
  header,
  subHeader,
  fields,
  submitButton,
  textVariantButton,
  errorField,
  fieldPerRow = 1,
  onSubmit,
  googleLogin,
  goTo,
}: AnimatedFormProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const toggleVisibility = () => setVisible(!visible);

  const validateForm = (event: FormEvent<HTMLFormElement>) => {
    const currentErrors: Errors = {};
    fields.forEach((field) => {
      const value = (event.target as HTMLFormElement)[field.label]?.value;

      if (field.required && !value) {
        currentErrors[field.label] = `${field.label} is required`;
      }

      if (field.type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
        currentErrors[field.label] = "Invalid email address";
      }

      if (field.type === "password" && value && value.length < 6) {
        currentErrors[field.label] =
          "Password must be at least 6 characters long";
      }
    });
    return currentErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formErrors = validateForm(event);

    if (Object.keys(formErrors).length === 0) {
      onSubmit(event);
      console.log("Form submitted");
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <section className="max-md:w-full flex flex-col gap-4 w-96 mx-auto">
      <BoxReveal boxColor="hsl(var(--primary))" duration={0.3}>
        <h2 className="font-bold text-3xl text-foreground">{header}</h2>
      </BoxReveal>

      {subHeader && (
        <BoxReveal
          boxColor="hsl(var(--primary))"
          duration={0.3}
          className="pb-2"
        >
          <p className="text-muted-foreground text-sm max-w-sm">{subHeader}</p>
        </BoxReveal>
      )}

      {googleLogin && (
        <>
          <BoxReveal
            boxColor="hsl(var(--primary))"
            duration={0.3}
            overflow="visible"
            width="unset"
          >
            <button
              className="group/btn bg-background w-full rounded-md border border-border h-10 font-medium hover:bg-accent transition-colors"
              type="button"
              onClick={() =>
                (window.location.href =
                  "http://localhost:8000/api/v2/users/auth/google")
              }
            >
              <span className="flex items-center justify-center w-full h-full gap-3">
                <div className="w-5 h-5 bg-primary rounded-sm flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-bold">
                    G
                  </span>
                </div>
                {googleLogin}
              </span>
              <BottomGradient />
            </button>
          </BoxReveal>

          <BoxReveal boxColor="hsl(var(--primary))" duration={0.3} width="100%">
            <section className="flex items-center gap-4">
              <hr className="flex-1 border-1 border-dashed border-border" />
              <p className="text-muted-foreground text-sm">or</p>
              <hr className="flex-1 border-1 border-dashed border-border" />
            </section>
          </BoxReveal>
        </>
      )}

      <form onSubmit={handleSubmit}>
        <section
          className={`grid grid-cols-1 md:grid-cols-${fieldPerRow} mb-4`}
        >
          {fields.map((field) => (
            <section key={field.label} className="flex flex-col gap-2">
              <BoxReveal boxColor="hsl(var(--primary))" duration={0.3}>
                <label
                  htmlFor={field.label}
                  className="text-sm font-medium leading-none text-foreground"
                >
                  {field.label} <span className="text-destructive">*</span>
                </label>
              </BoxReveal>

              <BoxReveal
                width="100%"
                boxColor="hsl(var(--primary))"
                duration={0.3}
                className="flex flex-col space-y-2 w-full"
              >
                <section className="relative">
                  <AnimatedInput
                    type={
                      field.type === "password"
                        ? visible
                          ? "text"
                          : "password"
                        : field.type
                    }
                    id={field.label}
                    placeholder={field.placeholder}
                    onChange={field.onChange}
                  />

                  {field.type === "password" && (
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-muted-foreground hover:text-foreground"
                    >
                      {visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </section>

                <section className="h-4">
                  {errors[field.label] && (
                    <p className="text-destructive text-xs">
                      {errors[field.label]}
                    </p>
                  )}
                </section>
              </BoxReveal>
            </section>
          ))}
        </section>

        <BoxReveal width="100%" boxColor="hsl(var(--primary))" duration={0.3}>
          {errorField && (
            <p className="text-destructive text-sm mb-4">{errorField}</p>
          )}
        </BoxReveal>

        <BoxReveal
          width="100%"
          boxColor="hsl(var(--primary))"
          duration={0.3}
          overflow="visible"
        >
          <button
            className="bg-primary text-primary-foreground relative group/btn block w-full rounded-md h-10 font-medium shadow-soft hover:bg-primary/90 transition-colors"
            type="submit"
          >
            {submitButton} &rarr;
            <BottomGradient />
          </button>
        </BoxReveal>

        {textVariantButton && goTo && (
          <BoxReveal boxColor="hsl(var(--primary))" duration={0.3}>
            <section className="mt-4 text-center">
              <button
                className="text-sm text-primary hover:text-primary/80 transition-colors"
                onClick={goTo}
                type="button"
              >
                {textVariantButton}
              </button>
            </section>
          </BoxReveal>
        )}
      </form>
    </section>
  );
});

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-primary-light to-transparent" />
    </>
  );
};

// ==================== AuthSlidePanel Component ====================

interface AuthSlidePanelProps {
  isOpen: boolean;

  onClose: () => void;
  formFields: {
    header: string;
    subHeader?: string;
    fields: Field[];
    submitButton: string;
    textVariantButton?: string;
  };
  goTo: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error?: string | null;
}

const AuthSlidePanel = memo(function AuthSlidePanel({
  isOpen,
  onClose,
  formFields,
  goTo,
  handleSubmit,
  error, // receive error prop here
}: AuthSlidePanelProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 right-0 h-full w-full lg:w-1/2 bg-background border-l border-border z-50 overflow-y-auto"
      >
        <div className="flex h-full">
          {/* Left Side - Animation */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative">
            <Ripple mainCircleSize={100} />
            <FitnessOrbitDisplay
              iconsArray={fitnessIconsArray}
              text="Get Fit"
            />
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>

            {/* Show error message here */}
            {error && (
              <div className="mb-4 w-full text-center text-sm text-red-600 font-semibold">
                {error}
              </div>
            )}

            <AnimatedForm
              {...formFields}
              fieldPerRow={1}
              onSubmit={handleSubmit}
              goTo={goTo}
              googleLogin="Login with Google"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
});

// ==================== Fitness Icons Array ====================

const fitnessIconsArray: IconConfig[] = [
  {
    component: () => <Dumbbell className="w-6 h-6 text-primary" />,
    className: "size-[40px] border-none bg-transparent",
    duration: 20,
    delay: 20,
    radius: 100,
    path: false,
    reverse: false,
  },
  {
    component: () => <Target className="w-6 h-6 text-primary" />,
    className: "size-[40px] border-none bg-transparent",
    duration: 20,
    delay: 10,
    radius: 100,
    path: false,
    reverse: false,
  },
  {
    component: () => <Zap className="w-8 h-8 text-primary" />,
    className: "size-[50px] border-none bg-transparent",
    radius: 150,
    duration: 20,
    path: false,
    reverse: false,
  },
  {
    component: () => <Heart className="w-8 h-8 text-primary" />,
    className: "size-[50px] border-none bg-transparent",
    radius: 150,
    duration: 20,
    delay: 20,
    path: false,
    reverse: false,
  },
  {
    component: () => <Trophy className="w-6 h-6 text-primary" />,
    className: "size-[40px] border-none bg-transparent",
    duration: 20,
    delay: 20,
    radius: 200,
    path: false,
    reverse: true,
  },
  {
    component: () => <Activity className="w-6 h-6 text-primary" />,
    className: "size-[40px] border-none bg-transparent",
    duration: 20,
    delay: 10,
    radius: 200,
    path: false,
    reverse: true,
  },
  {
    component: () => <Flame className="w-8 h-8 text-primary" />,
    className: "size-[50px] border-none bg-transparent",
    radius: 250,
    duration: 20,
    path: false,
    reverse: true,
  },
  {
    component: () => <Timer className="w-8 h-8 text-primary" />,
    className: "size-[50px] border-none bg-transparent",
    radius: 250,
    duration: 20,
    delay: 60,
    path: false,
    reverse: true,
  },
];

// ==================== Exports ====================

export {
  AnimatedForm,
  AnimatedInput,
  AuthSlidePanel,
  BottomGradient,
  BoxReveal,
  fitnessIconsArray,
  FitnessOrbitDisplay,
  OrbitingCircles,
  Ripple,
};
