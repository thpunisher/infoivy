import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap, Shield, FileText, CreditCard, Sparkles, Palette } from 'lucide-react'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: "Invoify - Professional Invoice Management",
  description: "Create beautiful invoices in minutes with AI-powered features. Free to start, no design skills required.",
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mobile-container py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">Invoify</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="sm" className="text-sm px-4">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mobile-container py-12 sm:py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          ✨ Professional Invoice Management
        </Badge>
        <h1 className="mobile-heading font-bold text-gray-900 mb-6">
          Create Beautiful Invoices
          <span className="text-blue-600"> in Minutes</span>
        </h1>
        <p className="mobile-text text-gray-600 mb-8 max-w-2xl mx-auto">
          Generate professional invoices, track payments, and manage your business finances 
          with our intuitive platform. No design skills required.
        </p>
        <div className="mobile-flex justify-center">
          <Link href="/auth/signin" className="w-full sm:w-auto">
            <Button size="lg" className="mobile-button text-lg px-8">
              Start Creating Invoices
            </Button>
          </Link>
          <Link href="#pricing" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="mobile-button text-lg px-8">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mobile-container py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="mobile-heading font-bold text-gray-900 mb-4">
            Everything you need to manage invoices
          </h2>
          <p className="mobile-text text-gray-600 max-w-2xl mx-auto">
            From creation to payment tracking, we've got you covered with powerful features 
            designed for modern businesses.
          </p>
        </div>

        <div className="mobile-grid">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>AI-Powered</CardTitle>
              <CardDescription>
                Generate professional descriptions and reminders with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/ai-features" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Learn more →
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Beautiful Templates</CardTitle>
              <CardDescription>
                Choose from 4 professional designs or create your own custom look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/templates" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View templates →
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your data is protected with enterprise-grade security
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="mobile-container py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="mobile-heading font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="mobile-text text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you need more features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-4xl font-bold text-gray-900">$0</div>
              <CardDescription>Forever free</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>10 invoices per month</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>AI Description Generator</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>AI Reminder Drafter</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>All 4 template designs</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Basic PDF export</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Check className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Watermark on PDFs</span>
                </div>
              </div>
              <Link href="/auth/signin" className="block">
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600 text-white">Most Popular</Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For growing businesses</CardDescription>
              <div className="text-4xl font-bold text-gray-900">$5</div>
              <CardDescription>per month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Unlimited invoices</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>No watermarks</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Unlimited AI usage</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Advanced customization</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Custom branding</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Advanced analytics</span>
                </div>
              </div>
              <Link href="/auth/signin" className="block">
                <Button className="w-full">
                  Start Pro Trial
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="mobile-container py-12 sm:py-20">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            Trusted by businesses worldwide
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">No card required for free</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mobile-container py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold">Invoify</span>
              </div>
              <p className="text-gray-600">
                Professional invoice management made simple.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/features" className="hover:text-gray-900">Features</Link></li>
                <li><Link href="/templates" className="hover:text-gray-900">Templates</Link></li>
                <li><Link href="/ai-features" className="hover:text-gray-900">AI Features</Link></li>
                <li><Link href="#pricing" className="hover:text-gray-900">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/contact" className="hover:text-gray-900">Contact Us</a></li>
                <li><a href="/privacy" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-gray-900">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/about" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="/terms" className="hover:text-gray-900">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 Invoify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
