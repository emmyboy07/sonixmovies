"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

interface VoiceSearchProps {
  onResult: (result: string) => void
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if ((typeof window !== "undefined" && "SpeechRecognition" in window) || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.lang = "en-US"
      recognitionInstance.interimResults = false
      recognitionInstance.maxAlternatives = 1

      recognitionInstance.onresult = (event) => {
        const result = event.results[0][0].transcript
        onResult(result)
        setIsListening(false)
      }

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [onResult])

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop()
    } else {
      recognition?.start()
    }
    setIsListening(!isListening)
  }

  if (!recognition) {
    return null // Voice search not supported
  }

  return (
    <Button
      onClick={toggleListening}
      variant="outline"
      size="icon"
      className={`ml-2 ${isListening ? "bg-sonix-red text-white" : ""}`}
    >
      {isListening ? <Mic /> : <MicOff />}
    </Button>
  )
}

export default VoiceSearch

