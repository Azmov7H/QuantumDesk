"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SecuritySettingsPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleChangePassword = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    const formData = new FormData();
    formData.append("password", password);

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/update`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setPassword("");
      toast({
        title: "Password updated!",
        description: "Your password has been changed successfully.",
        variant: "success",
      });
    } else {
      toast({
        title: "Error",
        description: data.msg || "Something went wrong.",
        variant: "destructive",
      });
    }
  } catch (err) {
    setLoading(false);
    toast({
      title: "Error",
      description: err.message || "Something went wrong.",
      variant: "destructive",
    });
  }
};


  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Security</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} className="rounded-xl">
            {loading ? "Updating..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
