"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"

interface ReportFormProps {
  contentId: string
  contentType: "movie" | "tv"
  contentTitle: string
}

export function ReportForm({ contentId, contentType, contentTitle }: ReportFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("https://formspree.io/f/mldgnewk", {
        method: "POST",
        body: new FormData(event.currentTarget),
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        toast.success("Report submitted successfully")
        setIsOpen(false)
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      toast.error("Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button variant="ghost" className="flex flex-col items-center gap-2" onClick={() => setIsOpen(true)}>
        <AlertTriangle className="w-6 h-6 text-white" />
        <span className="text-sm text-white">Report</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Content</DialogTitle>
            <DialogDescription>
              Please provide details about the issue you&apos;re reporting for &quot;{contentTitle}&quot;.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} method="POST" className="space-y-4">
            <input type="hidden" name="Content ID" value={contentId} />
            <input type="hidden" name="Content Type" value={contentType} />
            <input type="hidden" name="Content Title" value={contentTitle} />
            <div>
              <Label htmlFor="reportType">Type of Issue</Label>
              <Select name="Report Type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video_quality">Video Quality</SelectItem>
                  <SelectItem value="audio_issue">Audio Issue</SelectItem>
                  <SelectItem value="subtitle_problem">Subtitle Problem</SelectItem>
                  <SelectItem value="incorrect_content">Incorrect Content</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="Description"
                placeholder="Please describe the issue in detail"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Your Email (optional)</Label>
              <Input type="email" id="email" name="_replyto" placeholder="your@email.com" />
            </div>
            <input type="hidden" name="_subject" value={`Content Report: ${contentTitle}`} />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

