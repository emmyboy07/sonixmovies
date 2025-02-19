"use client"

import { useState } from "react"
import { useAuth } from "./AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function UserSwitcher() {
  const { switchUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleSwitch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await switchUser(email, password)
      setIsOpen(false)
      toast.success("Switched user successfully")
    } catch (error) {
      toast.error("Failed to switch user. Please check your credentials.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Switch User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Switch User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSwitch} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Switch</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

