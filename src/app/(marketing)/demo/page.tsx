'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, 
  Sparkles, 
  Palette, 
  Wand2, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight,
  Star,
  Download,
  Eye,
  Copy,
  Zap
} from 'lucide-react'

export default function DemoPage() {
  const [descriptionInput, setDescriptionInput] = useState('3 logo concepts, $300')
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [customColors, setCustomColors] = useState({
    primary: '#3B82F6',
    secondary: '#1F2937',
    accent: '#10B981'
  })

  const handleGenerateDescription = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedDescription(
        'Design and delivery of 3 unique logo concepts, including up to 2 revisions per concept. Each concept will be presented in various formats (vector, web-ready, print-ready) with a comprehensive style guide. Total: $300'
      )
      setIsGenerating(false)
    }, 2000)
  }

  const templates = {
    modern: {
      name: 'Modern',
      colors: ['#3B82F6', '#1F2937', '#10B981'],
      description: 'Clean, professional design with blue accents'
    },
    minimalist: {
      name: 'Minimalist',
      colors: ['#000000', '#6B7280', '#374151'],
      description: 'Simple, elegant design with minimal colors'
    },
    classic: {
      name: 'Classic',
      colors: ['#1F2937', '#4B5563', '#DC2626'],
      description: 'Traditional business design with serif fonts'
    },
    vibrant: {
      name: 'Vibrant',
      colors: ['#7C3AED', '#1F2937', '#F59E0B'],
      description: 'Bold, colorful design for creative businesses'
    }
  }

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
          🎯 Interactive Demo
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Try Invoify
          <span className="text-blue-600"> Before You Buy</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Experience the power of AI-powered invoice creation and beautiful templates. 
          See how Invoify can transform your invoicing workflow.
        </p>
      </section>

      {/* AI Demo Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Invoice Creation
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch AI transform your brief notes into professional descriptions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wand2 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">AI Description Generator</CardTitle>
              <CardDescription>
                Enter a brief description and watch AI expand it professionally
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brief Description
                </label>
                <Input
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="e.g., 3 logo concepts, $300"
                  className="text-lg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Try: "Website redesign, $1500" or "Social media management, $800/month"
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleGenerateDescription}
                  disabled={isGenerating || !descriptionInput.trim()}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      AI is thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>

              {generatedDescription && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600 mb-2 font-medium">AI Generated Description:</p>
                    <p className="text-gray-800 text-lg leading-relaxed">{generatedDescription}</p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Use in Invoice
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Template Demo Section */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Beautiful Invoice Templates
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from professionally designed templates and customize them to match your brand
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Template Selection */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {Object.entries(templates).map(([key, template]) => (
              <div
                key={key}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedTemplate(key)}
              >
                <div className="space-y-3">
                  <div className="flex space-x-2 justify-center">
                    {template.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Template Preview */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Template Preview: {templates[selectedTemplate as keyof typeof templates].name}</span>
                <Badge variant="secondary">Live Preview</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8 max-w-2xl mx-auto">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: customColors.primary }}>
                      INVOICE
                    </h1>
                    <p className="text-gray-600">#INV-001</p>
                    <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-gray-500 text-xs">LOGO</span>
                    </div>
                    <p className="font-semibold">Your Company</p>
                    <p className="text-sm text-gray-600">123 Business St</p>
                    <p className="text-sm text-gray-600">City, State 12345</p>
                  </div>
                </div>

                {/* Client Info */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-2" style={{ color: customColors.secondary }}>
                    Bill To:
                  </h3>
                  <p className="font-medium">Client Name</p>
                  <p className="text-gray-600">Client Company</p>
                  <p className="text-gray-600">Client Address</p>
                </div>

                {/* Line Items */}
                <div className="mb-8">
                  <div className="border-b border-gray-200 pb-2 mb-4">
                    <div className="grid grid-cols-4 gap-4 font-semibold text-sm" style={{ color: customColors.secondary }}>
                      <div>Description</div>
                      <div>Qty</div>
                      <div>Rate</div>
                      <div>Amount</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="col-span-2">{generatedDescription || 'Professional services rendered'}</div>
                      <div>1</div>
                      <div>$300.00</div>
                      <div>$300.00</div>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="text-right">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>$300.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (0%):</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2" style={{ color: customColors.accent }}>
                      <span>Total:</span>
                      <span>$300.00</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600">
                  <p>Thank you for your business!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Color Customization Demo */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Customize Your Colors
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Adjust the colors to match your brand perfectly
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="color"
                      value={customColors.primary}
                      onChange={(e) => setCustomColors(prev => ({ ...prev, primary: e.target.value }))}
                      className="w-16 h-12 p-1"
                    />
                    <Input
                      value={customColors.primary}
                      onChange={(e) => setCustomColors(prev => ({ ...prev, primary: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="color"
                      value={customColors.secondary}
                      onChange={(e) => setCustomColors(prev => ({ ...prev, secondary: e.target.value }))}
                      className="w-16 h-12 p-1"
                    />
                    <Input
                      value={customColors.secondary}
                      onChange={(e) => setCustomColors(prev => ({ ...prev, secondary: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="color"
                      value={customColors.accent}
                      onChange={(e) => setCustomColors(prev => ({ ...prev, accent: e.target.value }))}
                      className="w-16 h-12 p-1"
                    />
                    <Input
                      value={customColors.accent}
                      onChange={(e) => setCustomColors(prev => ({ ...prev, accent: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses using Invoify to create professional invoices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600">
                View All Features
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
                AI-powered invoice management with beautiful templates.
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
