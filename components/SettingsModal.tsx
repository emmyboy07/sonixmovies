"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [defaultSection, setDefaultSection] = useState("international")
  const [moviesPerPage, setMoviesPerPage] = useState("20")
  const [autoPlayTrailers, setAutoPlayTrailers] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const handleSave = () => {
    // Save settings to localStorage or context
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your Sonix Movies experience</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="default-section">Default Movie Section</Label>
            <Select value={defaultSection} onValueChange={setDefaultSection}>
              <SelectTrigger id="default-section">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="international">International Movies</SelectItem>
                <SelectItem value="nollywood">Nollywood Movies</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="movies-per-page">Number of Movies per Page</Label>
            <Select value={moviesPerPage} onValueChange={setMoviesPerPage}>
              <SelectTrigger id="movies-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-play-trailers">Auto-play Trailers</Label>
            <Switch id="auto-play-trailers" checked={autoPlayTrailers} onCheckedChange={setAutoPlayTrailers} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </DialogContent>
    </Dialog>
  )
}

