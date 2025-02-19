"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, Twitter, Coffee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutDeveloperPage() {
  // const buyMeCoffeeRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   const script = document.createElement("script")
  //   script.src = "https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
  //   script.async = true
  //   script.onload = () => {
  //     if (buyMeCoffeeRef.current) {
  //       const bmcButton = document.createElement("script")
  //       bmcButton.innerHTML = `
  //         var btn = document.createElement("button");
  //         btn.className = "bmc-button";
  //         btn.innerHTML = "<img src='https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg' alt='Buy me a coffee'><span style='margin-left:5px;font-size:19px !important;'>Buy me a coffee</span>";
  //         btn.setAttribute("data-color", "red");
  //         btn.setAttribute("data-emoji", "☕");
  //         btn.setAttribute("data-font", "Cookie");
  //         btn.setAttribute("data-text", "Buy me a coffee");
  //         btn.setAttribute("data-outline-color", "#000000");
  //         btn.setAttribute("data-font-color", "#000000");
  //         btn.setAttribute("data-coffee-color", "#ffffff");
  //         btn.onclick = function() {
  //           window.open('https://www.buymeacoffee.com/EmmyTech', '_blank');
  //         };
  //         document.getElementById("bmc-container").appendChild(btn);
  //       `
  //       buyMeCoffeeRef.current.appendChild(bmcButton)
  //     }
  //   }
  //   document.body.appendChild(script)

  //   return () => {
  //     if (buyMeCoffeeRef.current) {
  //       buyMeCoffeeRef.current.innerHTML = ""
  //     }
  //     document.body.removeChild(script)
  //   }
  // }, [])

  return (
    <div className="min-h-screen bg-background pt-16">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">About the Developer</h2>
          <div className="text-center mb-12">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Developer%20Profile%20Picture-i3v1JhJcYx3k8KvnBEneiChggZHump.png"
                alt="Anakwe Tochukwu Emmanuel"
                fill
                className="rounded-full object-cover border-4 border-sonix-red"
              />
            </div>
            <h3 className="text-3xl font-bold mb-2">Anakwe Tochukwu Emmanuel</h3>
            <p className="text-xl text-muted-foreground italic">Lead Developer & Founder</p>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Biography</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Anakwe Emmanuel is a passionate frontend developer with a fresh perspective on creating innovative web
                applications. His love for cinema and technology inspired him to create Sonix Movies, a platform
                designed to bring the joy of movies to audiences worldwide. As a young programmer, Emmanuel combines
                creativity and modern techniques to deliver user-friendly and visually captivating experiences.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With Sonix Movies, he has showcased his ability to turn ideas into functional solutions, leveraging his
                growing expertise in frontend development to build a platform that resonates with movie enthusiasts.
                Driven by curiosity and a desire to learn, Emmanuel continues to explore the latest technologies to
                refine his skills and contribute to the tech world in impactful ways.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Frontend Development",
                  "JavaScript (ES6+)",
                  "UI/UX Design & Prototyping",
                  "Responsive Web Design",
                  "Basic Backend Development (Node.js & Express)",
                  "RESTful API Integration",
                  "Version Control (Git)",
                ].map((skill) => (
                  <li key={skill} className="flex items-center text-muted-foreground">
                    <span className="mr-2 text-sonix-red">✓</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Have questions or want to collaborate? Feel free to reach out!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="mailto:anakweemmyboy08@gmail.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="https://github.com/emmyboy07" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-12 border-sonix-red">
            <CardHeader className="bg-sonix-red text-white">
              <CardTitle className="text-2xl flex items-center justify-center">
                <Coffee className="mr-2 h-6 w-6" />
                Support Me
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center p-6">
              <h4 className="font-bold mb-4 text-xl">Bank Details</h4>
              <p className="text-muted-foreground mb-2">Account Number: 1031721457</p>
              <p className="text-muted-foreground mb-2">Bank Name: Polaris Bank</p>
              <p className="text-muted-foreground mb-4">Account Name: Anakwe Tochukwu Emmanuel</p>
              <div className="mt-6">
                <p className="mb-4 text-lg font-semibold">Or buy me a coffee</p>
                <Button
                  className="bg-sonix-red hover:bg-sonix-red/90 text-white font-bold py-2 px-4 rounded-full inline-flex items-center"
                  onClick={() => window.open("https://www.buymeacoffee.com/EmmyTech", "_blank")}
                >
                  <Coffee className="mr-2 h-5 w-5" />
                  <span>Buy me a coffee</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

