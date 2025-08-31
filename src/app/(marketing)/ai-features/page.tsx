import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  Wand2, 
  MessageSquare, 
  Zap, 
  Brain, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Star,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react'

export default function AIFeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Invoify</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signin">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          ✨ AI-Powered Invoice Creation
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Create Professional Invoices
          <span className="text-blue-600"> with AI Magic</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Transform your brief descriptions into polished, professional invoice line items. 
          Let AI handle the writing while you focus on growing your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Sparkles className="mr-2 h-5 w-5" />
              Try AI Features Free
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="lg" className="text-lg px-8">
              See How It Works
            </Button>
          </Link>
        </div>
      </section>

      {/* AI Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI that understands your business
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI is trained on thousands of professional invoices to deliver 
            results that match your industry standards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* AI Description Generator */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wand2 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">AI Description Generator</CardTitle>
              <CardDescription className="text-lg">
                Transform brief notes into professional descriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Input:</p>
                <p className="font-medium">"3 logo concepts, $300"</p>
              </div>
              <ArrowRight className="h-6 w-6 text-blue-600 mx-auto" />
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 mb-2">AI Generated:</p>
                <p className="font-medium">"Design and delivery of 3 unique logo concepts, including up to 2 revisions per concept. Total: $300"</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Professional language</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Industry-standard terminology</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Clear value proposition</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Reminder Drafter */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">AI Reminder Drafter</CardTitle>
              <CardDescription className="text-lg">
                Generate polite but firm payment reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Context:</p>
                <p className="font-medium">"Invoice #123 overdue by 15 days"</p>
              </div>
              <ArrowRight className="h-6 w-6 text-green-600 mx-auto" />
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 mb-2">AI Generated:</p>
                <p className="font-medium">"I hope this email finds you well. I wanted to follow up regarding Invoice #123, which was due 15 days ago..."</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Professional tone</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Clear payment terms</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Maintains relationships</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How AI makes invoicing effortless
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to professional invoices with AI assistance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Write Brief Notes</h3>
            <p className="text-gray-600">
              Jot down your services in simple terms - no need to be formal yet
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Click AI Magic</h3>
            <p className="text-gray-600">
              Hit the AI button and watch your notes transform into professional descriptions
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Send & Get Paid</h3>
            <p className="text-gray-600">
              Your professional invoice is ready to impress clients and get you paid faster
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why AI-powered invoicing?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Save time, look more professional, and get paid faster
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Save 2-3 hours</h3>
              <p className="text-sm text-gray-600">Per invoice creation</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Look Professional</h3>
              <p className="text-sm text-gray-600">Every single time</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Get Paid Faster</h3>
              <p className="text-sm text-gray-600">Clear descriptions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">AI Learns</h3>
              <p className="text-sm text-gray-600">Gets better over time</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing with AI Features */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI features included in every plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start using AI-powered invoicing today - no extra cost
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>10 invoices per month</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>AI Description Generator</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>AI Reminder Drafter</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Basic PDF export</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
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
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Unlimited invoices</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Unlimited AI usage</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>No watermarks</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Custom branding</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Priority support</span>
                </div>
              </div>
              <Link href="/auth/signin" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Pro Trial
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your invoicing?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses using AI to create better invoices faster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Creating with AI
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600">
                Explore Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold">Invoify</span>
              </div>
              <p className="text-gray-600">
                AI-powered invoice management made simple.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/ai-features" className="hover:text-gray-900">AI Features</Link></li>
                <li><Link href="/templates" className="hover:text-gray-900">Templates</Link></li>
                <li><Link href="/auth/signin" className="hover:text-gray-900">Sign Up</Link></li>
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
