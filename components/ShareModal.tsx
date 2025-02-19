import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Link2, Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  shareText: string
  url: string
  imageUrl: string
  onShare: (platform: string) => void
  hasEpisodeData: boolean
  formatShareText: (includeEpisodeData: boolean) => string
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  shareText,
  url,
  imageUrl,
  onShare,
  hasEpisodeData,
  formatShareText,
}: ShareModalProps) {
  const [includeEpisodeData, setIncludeEpisodeData] = useState(false)
  const encodedUrl = encodeURIComponent(url)

  const shareLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(formatShareText(includeEpisodeData))}`,
          "_blank",
        ),
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(formatShareText(includeEpisodeData))}&url=${encodedUrl}`,
          "_blank",
        ),
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      action: () =>
        window.open(`https://wa.me/?text=${encodeURIComponent(formatShareText(includeEpisodeData))}`, "_blank"),
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      action: () =>
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(formatShareText(includeEpisodeData))}`,
          "_blank",
        ),
    },
    {
      name: "Email",
      icon: <Mail className="w-5 h-5" />,
      action: () =>
        (window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(formatShareText(includeEpisodeData))}`),
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatShareText(includeEpisodeData))
      toast.success("Content copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy:", err)
      toast.error("Failed to copy content. Please try again.")
    }
  }

  const handleShare = (platform: string, action: () => void) => {
    try {
      action()
      onShare(platform)
    } catch (error) {
      console.error(`Error sharing on ${platform}:`, error)
      toast.error(`Failed to share on ${platform}. Please try again.`)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share "{title}"</DialogTitle>
        </DialogHeader>
        {hasEpisodeData && (
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="includeEpisodeData"
              checked={includeEpisodeData}
              onCheckedChange={(checked) => setIncludeEpisodeData(checked as boolean)}
            />
            <Label htmlFor="includeEpisodeData">Include episode data</Label>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 py-4">
          {shareLinks.map((link) => (
            <Button
              key={link.name}
              variant="outline"
              onClick={() => handleShare(link.name, link.action)}
              className="flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              {link.icon}
              <span className="text-gray-700">{link.name}</span>
            </Button>
          ))}
        </div>
        <Button variant="secondary" onClick={copyToClipboard} className="w-full flex items-center justify-center gap-2">
          <Link2 className="w-5 h-5" />
          Copy
        </Button>
      </DialogContent>
    </Dialog>
  )
}

