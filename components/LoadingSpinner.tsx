import { Loader2 } from "lucide-react"

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-sonix-black bg-opacity-75 z-50">
      <div className="relative">
        <Loader2 className="w-16 h-16 animate-spin text-sonix-red" />
        <div className="absolute inset-0 animate-ping">
          <Loader2 className="w-16 h-16 text-sonix-red opacity-75" />
        </div>
      </div>
    </div>
  )
}

