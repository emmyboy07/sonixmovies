export async function requestGeolocation(): Promise<boolean> {
  try {
    await navigator.geolocation.getCurrentPosition(() => {})
    return true
  } catch {
    console.error("Geolocation permission denied")
    return false
  }
}

export async function requestNotifications(): Promise<boolean> {
  try {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  } catch {
    console.error("Notification permission denied")
    return false
  }
}

export async function requestMicrophoneAccess(): Promise<boolean> {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true })
    return true
  } catch {
    console.error("Microphone permission denied")
    return false
  }
}

export async function checkStorageAccess(): Promise<boolean> {
  try {
    localStorage.setItem("test", "test")
    localStorage.removeItem("test")
    return true
  } catch {
    console.error("Local storage not available")
    return false
  }
}

