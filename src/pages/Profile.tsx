/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Calendar, Camera, CheckCircle, Mail, Save, User } from "lucide-react";
import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  joinedDate: string;
  totalHabits: number;
  longestStreak: number;
  completedHabits: number;
  isVerified?: boolean;
}

const Profile = () => {
  const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: "", bio: "" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (authUser) fetchUserProfile();
  }, [authUser]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v2/users/me`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      if (!data.success || !data.user) throw new Error("Not authenticated");

      const userData = data.user;

      setProfile({
        id: userData._id || userData.id || "",
        name: userData.username || userData.name || "",
        email: userData.email || "",
        profilePicture: userData.profilePicture || "",
        bio: userData.bio || "",
        joinedDate: userData.createdAt || new Date().toISOString(),
        totalHabits: 0,
        longestStreak: 0,
        completedHabits: 0,
        isVerified: userData.isEmailVerified || false,
      });

      setEditData({
        name: userData.username || userData.name || "",
        bio: userData.bio || "",
      });

      await fetchHabitStats();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchHabitStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v2/habits`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const habits = await res.json();

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              totalHabits: habits.length,
              longestStreak: Math.max(
                ...habits.map((h: any) => h.streak || 0),
                0
              ),
              completedHabits: habits.reduce((sum: number, h: any) => {
                const completedHistory =
                  h.history?.filter((item: any) => item.completed) || [];
                const lastCompletedAdded =
                  h.lastCompleted &&
                  !completedHistory.some(
                    (item) =>
                      new Date(item.date).toDateString() ===
                      new Date(h.lastCompleted).toDateString()
                  )
                    ? 1
                    : 0;
                return sum + completedHistory.length + lastCompletedAdded;
              }, 0),
            }
          : prev
      );
    } catch (err) {
      console.error("Failed to fetch habit stats:", err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v2/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: editData.name, bio: editData.bio }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedData = await res.json();
      if (updatedData.success && updatedData.user) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                name: updatedData.user.username || updatedData.user.name,
                bio: updatedData.user.bio,
              }
            : prev
        );
        setIsEditing(false);
        setError("Profile updated successfully!");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (file: File) => {
    setUploading(true);
    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) =>
      prev ? { ...prev, profilePicture: previewUrl } : prev
    );

    const formData = new FormData();
    formData.append("avatar", file);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v2/users/avatar`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.profilePicture) {
          setProfile((prev) =>
            prev ? { ...prev, profilePicture: data.user.profilePicture } : prev
          );
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setUploading(false));
  };

  const handleVerifyEmail = async () => {
    try {
      setVerifying(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v2/users/send-verification-email`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to send verification email");

      setError("Verification email sent! Check your inbox.");
      setTimeout(() => setError(null), 4000);
    } catch (err) {
      setError("Failed to send verification email");
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          Failed to load profile
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-md flex justify-between items-center bg-red-100 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6 flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profile.profilePicture || "/default-avatar.png"}
                    alt={profile.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) =>
                    e.target.files?.[0] && handleAvatarUpload(e.target.files[0])
                  }
                  disabled={uploading}
                />
                <div className="absolute -bottom-2 -right-2">
                  {uploading ? (
                    <div className="animate-spin h-8 w-8 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  ) : (
                    <Camera className="h-8 w-8 text-primary" />
                  )}
                </div>
              </div>

              <div className="flex-1 flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <p className="text-muted-foreground flex items-center mt-1 space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                    {profile.isVerified ? (
                      <span className="text-green-600 flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleVerifyEmail}
                        disabled={verifying}
                        className="ml-2"
                      >
                        {verifying ? "Sending..." : "Verify Email"}
                      </Button>
                    )}
                  </p>
                  <p className="text-muted-foreground flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2" /> Joined{" "}
                    {new Date(profile.joinedDate).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  variant={isEditing ? "default" : "outline"}
                  disabled={saving}
                >
                  {isEditing ? (
                    <Save className="h-4 w-4 mr-2" />
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                  {isEditing ? "Save" : "Edit Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats & Edit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Habits</span>
                  <span className="font-semibold">{profile.totalHabits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Longest Streak</span>
                  <span className="font-semibold">
                    {profile.longestStreak} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Completed Habits
                  </span>
                  <span className="font-semibold">
                    {profile.completedHabits}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm">{profile.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData({ ...editData, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {profile.bio || "No bio added yet"}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} size="sm" disabled={saving}>
                      {saving ? (
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          name: profile.name,
                          bio: profile.bio || "",
                        });
                      }}
                      variant="outline"
                      size="sm"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
      {/* Chat Icon for verified users */}
      {/* {profile && (
        <ChatIconComponent isVerified={profile.isVerified || false} />
      )} */}
    </div>
  );
};

export default Profile;
