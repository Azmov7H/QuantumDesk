"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return router.push("/auth/login")

    fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.msg || "Failed to fetch users")
        }
        return res.json()
      })
      .then(setUsers)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </Card>
          ))
        : users.map((user) => (
            <Card key={user._id} className="p-4">
              <CardHeader>
                <CardTitle className="text-lg">{user.username}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
              </CardContent>
            </Card>
          ))}
    </div>
  )
}
