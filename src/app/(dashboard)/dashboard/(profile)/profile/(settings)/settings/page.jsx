"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setUsername(data.username || "");
        setEmail(data.email || "");
        setPreview(data.profileImage || null);
      });
  }, []);

  // ✅ Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (profileImage) formData.append("profileImage", profileImage);

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/update`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setProfile(data.user);
      alert("✅ Profile updated successfully!");
    } else {
      alert("❌ " + data.msg);
    }
  };

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Profile Image */}
          <div className="flex items-center gap-4">
            <img
              src={preview || "/default-avatar.png"}
              alt="Profile Preview"
              className="w-16 h-16 rounded-full border"
            />
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
            <label className="block text-sm font-medium">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <Button type="submit" disabled={loading} className="rounded-xl">
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
