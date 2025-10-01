import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (userData: User) => void;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v2/users/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.user) {
          setUser({
            id: data.user._id,
            name: data.user.username || data.user.name,
            email: data.user.email,
            avatar: data.user.profilePicture || undefined,
            bio: data.user.bio || "",
            isVerified: data.user.isEmailVerified ?? false, // ✅ key for chat visibility
          });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v2/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    if (data?.data?.user) {
      setUser({
        id: data.data.user._id,
        name: data.data.user.username,
        email: data.data.user.email,
        avatar: data.data.user.profilePicture || undefined,
        bio: data.data.user.bio || "",
        isVerified: data.data.user.isEmailVerified ?? false, // ✅ key
      });
    }
  };

  const loginWithOAuth = (userData: User) => {
    // Only mark as verified if backend confirms email verified
    setUser({
      ...userData,
      isVerified: userData.isVerified ?? false,
    });
  };

  const logout = async () => {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v2/users/logout`, {
      method: "POST",
      credentials: "include", // ✅ required for cookies
    });
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    
    setUser(null);

    // 🔄 Optional: force reload to ensure cookies cleared and state reset
    window.location.href = "/";
  }
};



  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginWithOAuth, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
