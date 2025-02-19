import { Mail, Clapperboard, Tv2, Sparkles, MonitorPlay, Laptop2, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-sonix-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section with Logo */}
          <div className="text-center space-y-6">
            <div className="relative w-40 h-40 mx-auto">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sonix%20Movies-RmPG44SQLyyVfCaAoHxAD4zUEAqx8q.png"
                alt="Sonix Movies Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-sonix-red">About Sonix Movies</h1>
            <p className="text-xl text-gray-300">Your Gateway to Unlimited Entertainment! 🍿</p>
          </div>

          {/* Introduction Card */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <p className="text-gray-300 leading-relaxed">
                Sonix Movies is a free movie streaming platform that brings you a vast library of the best Nollywood and
                international films in high definition (HD). Whether you're into action, drama, romance, or thrillers,
                Sonix Movies delivers a seamless streaming experience with no subscriptions, no hidden fees—just pure
                entertainment at your fingertips.
              </p>
            </CardContent>
          </Card>

          {/* Why Choose Us Section */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-sonix-red">Why Choose Sonix Movies?</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start space-x-3">
                <Clapperboard className="w-5 h-5 text-sonix-red mt-1" />
                <p className="text-gray-300">Massive Movie Collection – Explore an ever-growing selection of movies</p>
              </div>
              <div className="flex items-start space-x-3">
                <MonitorPlay className="w-5 h-5 text-sonix-red mt-1" />
                <p className="text-gray-300">HD Streaming – Watch your favorite movies in high definition</p>
              </div>
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-sonix-red mt-1" />
                <p className="text-gray-300">100% Free – No subscriptions, no paywalls—just stream and enjoy!</p>
              </div>
              <div className="flex items-start space-x-3">
                <Tv2 className="w-5 h-5 text-sonix-red mt-1" />
                <p className="text-gray-300">Dark-Themed User Interface – A sleek and modern design</p>
              </div>
            </CardContent>
          </Card>

          {/* How It Works Section */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-sonix-red">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                <div className="bg-sonix-red p-3 rounded-full">
                  <Laptop2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Browse & Discover</h3>
                  <p className="text-gray-300">Find trending, classic, and newly released movies.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                <div className="bg-sonix-red p-3 rounded-full">
                  <MonitorPlay className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Watch in HD</h3>
                  <p className="text-gray-300">Stream movies instantly in high quality with no buffering.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                <div className="bg-sonix-red p-3 rounded-full">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Enjoy Anytime, Anywhere</h3>
                  <p className="text-gray-300">Works on any device with a browser, no downloads required.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Section */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-sonix-red">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                At Sonix Movies, our mission is to make high-quality movies accessible to everyone for free. We are
                dedicated to providing a seamless and enjoyable movie streaming experience without the hassle of
                subscriptions or payments.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-sonix-red">Stay Connected</CardTitle>
              <CardDescription className="text-gray-400">We'd love to hear from you!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Mail className="text-sonix-red" />
                <a href="mailto:sonixmovies.emmytech@gmail.com" className="text-gray-300 hover:text-sonix-red">
                  sonixmovies.emmytech@gmail.com
                </a>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Channel */}
          <Card className="bg-gray-900 border-gray-800 mt-8">
            <CardHeader>
              <CardTitle className="text-2xl text-sonix-red">Join Our WhatsApp Channel</CardTitle>
              <CardDescription className="text-gray-400">Get the latest updates and announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">Stay up-to-date with Sonix Movies by joining our WhatsApp channel:</p>
              <Button asChild variant="outline" className="w-full">
                <Link
                  href="https://whatsapp.com/channel/0029Vb4ItpF6RGJNenYGsl3W"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join WhatsApp Channel
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="text-center py-8">
            <p className="text-gray-400">Start streaming today and dive into the world of Sonix Movies! 🚀🎥</p>
          </div>
        </div>
      </div>
    </div>
  )
}

