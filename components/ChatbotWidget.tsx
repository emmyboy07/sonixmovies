"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {isOpen ? (
        <div className="relative bg-sonix-black rounded-lg shadow-lg border border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 text-white hover:text-sonix-red"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          <iframe
            src="https://app.fastbots.ai/embed/cm6lujby409cjsvk6nyp19gkt"
            className="w-[320px] h-[500px] md:w-[400px] md:h-[600px] rounded-lg"
          />
        </div>
      ) : (
        <Button
          className="bg-sonix-red hover:bg-sonix-red/90 rounded-full p-3 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}

