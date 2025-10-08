"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";// لو عندك shadcn toast

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const token = api.token.get();
    if (!token) return;

    api.auth.getProfile().then((res) => {
      if (!res.ok) return;
      const data = res.data;
        setProfile(data);
        setUsername(data.username || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setFacebook(data.social?.facebook || "");
        setLinkedin(data.social?.linkedin || "");
        setWhatsapp(data.social?.whatsapp || "");
        setPreview(data.avatar?.url || null);
    }).catch((err) => console.error(err));
  }, []);

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { username, email, bio, facebook, linkedin, whatsapp };
    if (profileImage) payload.avatarFile = profileImage;

    try {
      const res = await api.users.updateMe(payload);
      setLoading(false);

      if (res.ok) {
        setProfile(res.data?.user || { ...profile, username, email, bio });
        toast({ title: "Profile updated successfully!", variant: "success" });
      } else {
        toast({ title: "Update failed", description: res.error || "", variant: "destructive" });
      }
    } catch (err) {
      setLoading(false);
      toast({ title: "Network error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Card className="shadow-lg rounded-2xl max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={preview || "/default-avatar.png"} />
              <AvatarFallback>{username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProfileImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium mb-1">Facebook</label>
            <Input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <Input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp</label>
            <Input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+201234567890"
            />
          </div>

          {/* Save Button */}
          <Button type="submit" disabled={loading} className="w-full rounded-xl">
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
