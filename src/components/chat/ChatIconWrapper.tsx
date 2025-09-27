import { useAuth } from "@/contexts/AuthContext";
import ChatIconComponent from "./ChatIcon";

const ChatIconWrapper = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // wait until user is fetched
  return <ChatIconComponent isVerified={user?.isVerified ?? false} />;
};

export default ChatIconWrapper;
