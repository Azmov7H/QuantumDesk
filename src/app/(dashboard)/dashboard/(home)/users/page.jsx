import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Users | QuantumLeap",
  description: "Browse the users on QuantumLeap.",
  openGraph: {
    title: "Users | QuantumLeap",
    description: "Discover users and connect.",
    url: "https://quantum-desk.vercel.app/dashboard/users",
    siteName: "QuantumDesk",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "QuantumDesk" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Users | QuantumDesk",
    description: "Discover users and connect.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://quantum-desk.vercel.app/dashboard/users" },
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        const res = await api.users.list();
        if (!res.ok) throw new Error(res.error || "Failed to load users");
        if (mounted) setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, []);

  const filtered = users.filter(u =>
    (u.username || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-xl"
            />
          </div>

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4"><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-10 w-10 rounded-full" /></Card>
              ))}
            </div>
          )}
          {error && (
            <div>
              <Alert variant="destructive" title="Error">{error}</Alert>
              <div className="mt-3">
                <Button onClick={async () => {
                  setError("");
                  setLoading(true);
                  try {
                    const res = await api.users.list();
                    if (!res.ok) throw new Error(res.error || "Failed to load users");
                    setUsers(Array.isArray(res.data) ? res.data : []);
                  } catch (e) {
                    setError(e.message || "Failed to load users");
                  } finally {
                    setLoading(false);
                  }
                }}>Retry</Button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(user => (
                <div key={user._id} className="flex items-center gap-3 p-3 border rounded-xl">
                  <Avatar>
                    <AvatarImage src={user.profileImage || "/default-avatar.png"} />
                    <AvatarFallback>{user.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.username || "User"}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
