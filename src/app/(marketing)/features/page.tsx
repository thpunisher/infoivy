import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Sparkles, 
  Palette, 
  Zap, 
  Shield, 
  Users, 
  CreditCard, 
  CheckCircle, 
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  Brain,
  Image,
  Type,
  MessageSquare,
  Download,
  BarChart3,
  Settings,
  Globe
} from 'lucide-react'

export default function FeaturesPage() {
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
          ✨ Complete Invoice Management Platform
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Everything You Need to
          <span className="text-blue-600"> Get Paid Faster</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          From AI-powered invoice creation to professional templates and payment tracking, 
          Invoify gives you all the tools to manage your business finances efficiently.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Free Trial
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Explore Features
            </Button>
          </Link>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful features for modern businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to create, manage, and track your invoices
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* AI-Powered Creation */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">AI-Powered Creation</CardTitle>
              <CardDescription>
                Transform brief notes into professional descriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>AI Description Generator</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Smart Reminder Drafter</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Professional language</span>
                </div>
              </div>
              <Link href="/ai-features" className="block">
                <Button variant="outline" className="w-full group-hover:bg-blue-50">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Professional Templates */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Professional Templates</CardTitle>
              <CardDescription>
                Beautiful, customizable invoice designs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>4 template designs</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Logo upload</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Color customization</span>
                </div>
              </div>
              <Link href="/templates" className="block">
                <Button variant="outline" className="w-full group-hover:bg-green-50">
                  View Templates
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Client Management */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Client Management</CardTitle>
              <CardDescription>
                Organize and manage your client relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Client database</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Contact information</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Payment history</span>
                </div>
              </div>
              <Link href="/auth/signin" className="block">
                <Button variant="outline" className="w-full group-hover:bg-purple-50">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* PDF Generation */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">PDF Generation</CardTitle>
              <CardDescription>
                High-quality PDFs ready for printing and sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Professional layouts</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Print-ready format</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Email attachment ready</span>
                </div>
              </div>
              <Link href="/auth/signin" className="block">
                <Button variant="outline" className="w-full group-hover:bg-orange-50">
                  Try It Out
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Payment Tracking */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-teal-600" />
              </div>
              <CardTitle className="text-xl">Payment Tracking</CardTitle>
              <CardDescription>
                Monitor invoice status and payment progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Invoice status</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Payment reminders</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Overdue tracking</span>
                </div>
              </div>
              <Link href="/auth/signin" className="block">
                <Button variant="outline" className="w-full group-hover:bg-teal-50">
                  Start Tracking
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Security & Privacy</CardTitle>
              <CardDescription>
                Enterprise-grade security for your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>SSL encryption</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Data privacy</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Regular backups</span>
                </div>
              </div>
              <Link href="/auth/signin" className="block">
                <Button variant="outline" className="w-full group-hover:bg-indigo-50">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Feature comparison
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what's included in each plan
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
              <div className="space-y-3">
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
                  <span>All 4 template designs</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Basic customization</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Client management</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>PDF export</span>
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
              <div className="space-y-3">
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
                  <span>All 4 template designs</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Advanced customization</span>
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
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Advanced analytics</span>
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

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why choose Invoify?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of businesses that trust Invoify for their invoicing needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Save Time</h3>
              <p className="text-sm text-gray-600">Create invoices 10x faster with AI</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Look Professional</h3>
              <p className="text-sm text-gray-600">Beautiful templates impress clients</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Get Paid Faster</h3>
              <p className="text-sm text-gray-600">Clear invoices lead to quicker payments</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-sm text-gray-600">Enterprise-grade security</p>
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
            Join thousands of businesses using Invoify to get paid faster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/ai-features">
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600">
                Explore AI Features
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
                Complete invoice management platform with AI-powered features.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/features" className="hover:text-gray-900">Features</Link></li>
                <li><Link href="/templates" className="hover:text-gray-900">Templates</Link></li>
                <li><Link href="/ai-features" className="hover:text-gray-900">AI Features</Link></li>
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
