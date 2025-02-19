"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/AuthProvider"
import { toast } from "sonner"
import UserSwitcher from "./UserSwitcher"
import { useRouter } from "next/navigation"

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (user && user.id !== "anonymous") {
      setUsername(user.username)
      setEmail(user.email)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user && user.id !== "anonymous") {
      try {
        await updateUser({ username, email })
        toast.success("Profile updated successfully!")
      } catch (error) {
        toast.error("Failed to update profile.")
      }
    }
  }

  if (!user || user.id === "anonymous") {
    router.push("/login")
    return null
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit">Update Profile</Button>
      </form>
      <Button onClick={logout} variant="destructive">
        Logout
      </Button>
      <UserSwitcher />
    </div>
  )
}

