export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered with scope:", registration.scope)
    } catch (error) {
      console.error("Service Worker registration failed:", error)
    }
  }
}

export function isPWAInstalled(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-ignore
    window.navigator.standalone === true
  )
}

export async function checkConnectivity(): Promise<boolean> {
  try {
    const response = await fetch("/api/health-check")
    return response.ok
  } catch {
    return false
  }
}

