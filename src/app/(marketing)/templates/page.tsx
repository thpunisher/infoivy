import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Sparkles, 
  Image, 
  Type, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Star,
  Shield,
  Zap,
  Eye,
  Download
} from 'lucide-react'

export default function TemplatesPage() {
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
          🎨 Professional Invoice Templates
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Design Invoices That
          <span className="text-blue-600"> Reflect Your Brand</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Choose from professionally designed templates or create your own custom design. 
          Upload your logo, pick your colors, and make every invoice uniquely yours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Palette className="mr-2 h-5 w-5" />
              Start Customizing
            </Button>
          </Link>
          <Link href="#templates">
            <Button variant="outline" size="lg" className="text-lg px-8">
              View Templates
            </Button>
          </Link>
        </div>
      </section>

      {/* Template Showcase */}
      <section id="templates" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Template
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four professionally designed templates to match your business style
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Modern Template */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="relative overflow-hidden rounded-t-lg">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Modern</h3>
                  <p className="text-blue-100">Clean & Professional</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <div className="w-4 h-4 rounded-full bg-gray-700" />
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                </div>
                <p className="text-sm text-gray-600">
                  Clean, professional design with blue accents. Perfect for tech companies and modern businesses.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Most Popular</Badge>
                  <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Minimalist Template */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="relative overflow-hidden rounded-t-lg">
              <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Minimalist</h3>
                  <p className="text-gray-300">Simple & Elegant</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <div className="w-4 h-4 rounded-full bg-black" />
                  <div className="w-4 h-4 rounded-full bg-gray-500" />
                  <div className="w-4 h-4 rounded-full bg-gray-700" />
                </div>
                <p className="text-sm text-gray-600">
                  Simple, elegant design with minimal colors. Ideal for creative agencies and design studios.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Elegant</Badge>
                  <ArrowRight className="h-4 w-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Classic Template */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="relative overflow-hidden rounded-t-lg">
              <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Classic</h3>
                  <p className="text-gray-300">Traditional & Trusted</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <div className="w-4 h-4 rounded-full bg-gray-700" />
                  <div className="w-4 h-4 rounded-full bg-gray-500" />
                  <div className="w-4 h-4 rounded-full bg-red-600" />
                </div>
                <p className="text-sm text-gray-600">
                  Traditional business design with serif fonts. Perfect for law firms and financial services.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Traditional</Badge>
                  <ArrowRight className="h-4 w-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vibrant Template */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="relative overflow-hidden rounded-t-lg">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Vibrant</h3>
                  <p className="text-purple-100">Bold & Creative</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500" />
                  <div className="w-4 h-4 rounded-full bg-gray-700" />
                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                </div>
                <p className="text-sm text-gray-600">
                  Bold, colorful design for creative businesses. Stand out with vibrant colors and modern typography.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Creative</Badge>
                  <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Customization Features */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Make It Uniquely Yours
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Customize every aspect of your invoice design to match your brand perfectly
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Logo Upload */}
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Image className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Logo Upload</h3>
              <p className="text-gray-600 mb-4">
                Upload your company logo and it will appear on every invoice
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>High-resolution support</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Automatic sizing</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Secure storage</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Customization */}
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Color Scheme</h3>
              <p className="text-gray-600 mb-4">
                Choose from millions of colors or use our preset combinations
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Primary colors</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Accent colors</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Text colors</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Type className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Typography</h3>
              <p className="text-gray-600 mb-4">
                Select from professional fonts that match your brand personality
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Modern fonts</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Classic serifs</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Professional options</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Customize in 3 Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your custom invoice design up and running in minutes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Template</h3>
            <p className="text-gray-600">
              Start with one of our professional templates as your foundation
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Customize Design</h3>
            <p className="text-gray-600">
              Upload your logo, pick your colors, and adjust fonts to match your brand
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Save & Use</h3>
            <p className="text-gray-600">
              Your custom design is saved and applied to all future invoices
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Custom Templates Matter
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional design builds trust and helps you get paid faster
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Build Trust</h3>
              <p className="text-sm text-gray-600">Professional appearance builds client confidence</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Faster Payments</h3>
              <p className="text-sm text-gray-600">Clear, professional invoices get paid quicker</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Brand Recognition</h3>
              <p className="text-sm text-gray-600">Consistent branding across all documents</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">PDF Ready</h3>
              <p className="text-sm text-gray-600">High-quality PDFs for printing and sharing</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Templates included in every plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start customizing your invoices today - no extra cost
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
                  <span>All 4 template designs</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Basic customization</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Logo upload</span>
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
            Ready to design your perfect invoice?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses using custom templates to look more professional
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Customizing
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
                Professional invoice templates and customization made simple.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/templates" className="hover:text-gray-900">Templates</Link></li>
                <li><Link href="/ai-features" className="hover:text-gray-900">AI Features</Link></li>
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
