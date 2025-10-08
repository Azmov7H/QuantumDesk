"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

export default function SecuritySettingsPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleChangePassword = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await api.auth.update({ password });
    setLoading(false);

    if (res.ok) {
      setPassword("");
      toast.success("Password updated!");
    } else {
      toast.error(res.error || "Something went wrong.");
    }
  } catch (err) {
    setLoading(false);
    toast.error(err.message || "Something went wrong.");
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
