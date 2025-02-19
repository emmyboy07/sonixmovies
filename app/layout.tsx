import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"
import Providers from "./providers"
import { Toaster } from "sonner"
import ChatbotWidget from "@/components/ChatbotWidget"
import { AuthProvider } from "@/components/AuthProvider"
import { AppInstanceProvider } from "@/components/AppInstance"
import { NetworkStatusNotification } from "@/components/NetworkStatusNotification"
import { Suspense } from "react"
import LoadingSpinner from "@/components/LoadingSpinner"
import AppInitializer from "@/components/AppInitializer"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sonix Movies",
  description: "Your Gateway to Unlimited Entertainment",
  metadataBase: new URL("https://sonixmovies.com"),
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-sonix-black text-white`}>
        <Providers>
          <AppInstanceProvider>
            <AuthProvider>
              <AppInitializer>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow pt-[80px] pb-[64px]">
                    <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
                  </main>
                  <BottomNav />
                </div>
                <Toaster />
                <Suspense fallback={null}>
                  <ChatbotWidget />
                </Suspense>
                <NetworkStatusNotification />
              </AppInitializer>
            </AuthProvider>
          </AppInstanceProvider>
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'