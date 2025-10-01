import { useAuth } from "@/contexts/AuthContext";
import ChatIconComponent from "./ChatIcon";

const ChatIconWrapper = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Only show chat if user exists and is verified
  return <ChatIconComponent isVerified={!!user?.isVerified} />;
};

export default ChatIconWrapper;
