import { AuthSlidePanel } from "@/components/ui/modern-animated-sign-in";
import { useAuth } from "@/contexts/AuthContext"; // Update path as needed
import { ChangeEvent, FormEvent, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;
  onSuccess?: () => void;
}

interface FormData {
  email: string;
  password: string;
  username?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  mode,
  onModeChange,
  onSuccess,
}: AuthModalProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange =
    (key: keyof FormData) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        // Use the login function from auth context
        await login(formData.email, formData.password);
      } else {
        // Handle signup
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v2/users/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Signup failed");
        }

        // After successful signup, automatically login
        await login(formData.email, formData.password);
      }

      onClose();
      if (onSuccess) onSuccess();
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onModeChange(mode === "signin" ? "signup" : "signin");
    setFormData({ email: "", password: "", username: "" });
    setError(null);
  };

  const fields = [
    ...(mode === "signup"
      ? [
          {
            key: "username",
            label: "User Name",
            placeholder: "Enter your full name",
            type: "text" as const,
            required: true,
            onChange: handleInputChange("username"),
            value: formData.username || "",
          },
        ]
      : []),
    {
      key: "email",
      label: "Email",
      placeholder: "Enter your email",
      type: "email" as const,
      required: true,
      onChange: handleInputChange("email"),
      value: formData.email,
    },
    {
      key: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password" as const,
      required: true,
      onChange: handleInputChange("password"),
      value: formData.password,
    },
  ];

  const formFields = {
    header: mode === "signin" ? "Welcome back" : "Create account",
    subHeader:
      mode === "signin"
        ? "Sign in to your account to continue your journey"
        : "Join thousands achieving their goals",
    fields,
    submitButton: loading
      ? "Please wait..."
      : mode === "signin"
      ? "Sign in"
      : "Create account",
    textVariantButton:
      mode === "signin"
        ? "Don't have an account? Sign up"
        : "Already have an account? Sign in",
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-background rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto w-full max-w-[95vw] md:max-w-[500px]">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <AuthSlidePanel
          isOpen={isOpen}
          onClose={onClose}
          formFields={formFields}
          goTo={toggleMode}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>,
    typeof window !== "undefined"
      ? document.body
      : document.createElement("div")
  );
}
