import { Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-sonix-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Terms of Service Section */}
          <div>
            <h1 className="text-4xl font-bold text-sonix-red mb-2">Terms of Service</h1>
            <p className="text-gray-400 mb-6">Last Updated: 1st January 2025</p>

            <Card className="bg-gray-900 border-gray-800 mb-6">
              <CardContent className="p-6">
                <p className="text-gray-300 mb-4">
                  Welcome to Sonix Movies! By accessing or using our website/app, you agree to comply with and be bound
                  by the following Terms of Service. If you do not agree with these terms, please do not use Sonix
                  Movies.
                </p>
              </CardContent>
            </Card>

            {[
              {
                title: "1. Acceptance of Terms",
                content: [
                  "By using Sonix Movies, you agree to these Terms of Service and any additional terms that may apply.",
                  "We reserve the right to change these terms at any time. Your continued use of Sonix Movies after changes constitutes acceptance of those changes.",
                ],
              },
              {
                title: "2. Use of Service",
                content: [
                  "Sonix Movies is a free streaming platform that allows users to watch movies and TV shows online.",
                  "You must be at least 13 years old or have parental consent to use our services.",
                  "You agree not to use Sonix Movies for any illegal activities, including copyright infringement.",
                  "We reserve the right to terminate or suspend access to our service, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
                ],
              },
              {
                title: "3. User Accounts",
                content: [
                  "You are responsible for safeguarding the password you use to access Sonix Movies and for any activities or actions under your password.",
                  "You agree to keep your password secure and not to share your account with anyone else.",
                ],
              },
              {
                title: "4. Content and Copyright",
                content: [
                  "All content provided on Sonix Movies is for informational and entertainment purposes only.",
                  "We do not claim ownership of the movies and TV shows available through our service. These are sourced through third-party providers.",
                  "If you believe that any content on our site infringes upon your copyright, please contact us immediately.",
                  "If you have any questions or concerns about our content, please contact us at sonixmovies.emmytech@gmail.com.",
                ],
              },
              {
                title: "5. Limitation of Liability",
                content: [
                  "Sonix Movies and its affiliates will not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.",
                  "We do not guarantee that our service will be uninterrupted or error-free.",
                ],
              },
              {
                title: "6. Changes to Service",
                content: [
                  "Sonix Movies reserves the right to modify or discontinue, temporarily or permanently, the service with or without notice.",
                  "We shall not be liable to you or to any third party for any modification, suspension or discontinuance of the service.",
                ],
              },
              {
                title: "7. Governing Law",
                content: [
                  "These Terms shall be governed and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.",
                ],
              },
            ].map((section) => (
              <Card key={section.title} className="bg-gray-900 border-gray-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-xl text-sonix-red">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {section.content.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-12" />

          {/* Privacy Policy Section */}
          <div>
            <h1 className="text-4xl font-bold text-sonix-red mb-2">Privacy Policy</h1>
            <p className="text-gray-400 mb-6">Last Updated: 1st January 2025</p>

            <Card className="bg-gray-900 border-gray-800 mb-6">
              <CardContent className="p-6">
                <p className="text-gray-300">
                  At Sonix Movies, we respect your privacy and are committed to protecting your personal information.
                  This Privacy Policy explains how we collect, use, and protect your data.
                </p>
              </CardContent>
            </Card>

            {[
              {
                title: "1. Information We Collect",
                content: [
                  "Personal Information: We may collect your name, email address, and other contact details when you create an account or contact us.",
                  "Usage Data: We collect information on how you interact with our service, including viewing history and preferences.",
                  "Device Information: We may collect information about the device and software you use to access Sonix Movies.",
                ],
              },
              {
                title: "2. How We Use Your Information",
                content: [
                  "To provide and maintain our service",
                  "To notify you about changes to our service",
                  "To provide customer support",
                  "To gather analysis or valuable information so that we can improve our service",
                  "To monitor the usage of our service",
                  "To detect, prevent and address technical issues",
                ],
              },
              {
                title: "3. Data Security",
                content: [
                  "We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction or damage.",
                  "However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.",
                ],
              },
              {
                title: "4. Third-Party Services",
                content: [
                  "We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services or assist us in analyzing how our service is used.",
                  "These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.",
                ],
              },
              {
                title: "5. Children's Privacy",
                content: [
                  "Our service does not address anyone under the age of 13.",
                  "We do not knowingly collect personally identifiable information from children under 13.",
                ],
              },
              {
                title: "6. Changes to This Privacy Policy",
                content: [
                  "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.",
                  "You are advised to review this Privacy Policy periodically for any changes.",
                ],
              },
            ].map((section) => (
              <Card key={section.title} className="bg-gray-900 border-gray-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-xl text-sonix-red">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {section.content.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            {/* Contact Section */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-sonix-red">7. Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Mail className="text-sonix-red" />
                  <span>If you have any questions about this Privacy Policy, please contact us at:</span>
                  <a href="mailto:sonixmovies.emmytech@gmail.com" className="text-sonix-red hover:underline">
                    sonixmovies.emmytech@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

