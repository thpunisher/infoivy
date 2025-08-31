'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Palette, Type, Image, FileText, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { 
  getInvoiceTemplate, 
  updateInvoiceTemplate, 
  applyTemplatePreset, 
  uploadLogo,
  TEMPLATE_PRESETS,
  type InvoiceTemplate 
} from '@/lib/invoice-templates'

export function InvoiceTemplateCustomizer() {
  const [template, setTemplate] = useState<InvoiceTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')

  useEffect(() => {
    loadTemplate()
  }, [])

  const loadTemplate = async () => {
    try {
      const data = await getInvoiceTemplate()
      setTemplate(data)
      if (data?.logo_url) {
        setLogoPreview(data.logo_url)
      }
    } catch (error) {
      toast.error('Failed to load template settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateChange = (field: keyof InvoiceTemplate, value: any) => {
    if (template) {
      setTemplate({ ...template, [field]: value })
    }
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoUpload = async () => {
    if (!logoFile) return

    try {
      const logoUrl = await uploadLogo(logoFile)
      if (logoUrl) {
        handleTemplateChange('logo_url', logoUrl)
        setLogoFile(null)
        toast.success('Logo uploaded successfully!')
      }
    } catch (error) {
      toast.error('Failed to upload logo')
    }
  }

  const handlePresetApply = async (presetName: keyof typeof TEMPLATE_PRESETS) => {
    try {
      const updatedTemplate = await applyTemplatePreset(presetName)
      if (updatedTemplate) {
        setTemplate(updatedTemplate)
        toast.success(`${TEMPLATE_PRESETS[presetName].name} template applied!`)
      }
    } catch (error) {
      toast.error('Failed to apply template preset')
    }
  }

  const handleSave = async () => {
    if (!template) return

    setIsSaving(true)
    try {
      const updatedTemplate = await updateInvoiceTemplate(template)
      if (updatedTemplate) {
        setTemplate(updatedTemplate)
        toast.success('Template settings saved!')
      }
    } catch (error) {
      toast.error('Failed to save template settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  if (!template) {
    return <div className="text-center p-8 text-red-600">Failed to load template</div>
  }

  return (
    <div className="space-y-6">
      {/* Template Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>Template Presets</span>
          </CardTitle>
          <CardDescription>
            Choose from our professionally designed templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(TEMPLATE_PRESETS).map(([key, preset]) => (
              <div
                key={key}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  template.template_name === key ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handlePresetApply(key as keyof typeof TEMPLATE_PRESETS)}
              >
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.primary_color }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.secondary_color }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.accent_color }}
                    />
                  </div>
                  <div className="text-sm font-medium">{preset.name}</div>
                  <div className="text-xs text-gray-500">{preset.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Image className="h-5 w-5" />
            <span>Company Logo</span>
          </CardTitle>
          <CardDescription>
            Upload your company logo to appear on invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            {logoPreview && (
              <div className="w-20 h-20 border rounded-lg overflow-hidden">
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="mb-2"
              />
              {logoFile && (
                <Button onClick={handleLogoUpload} size="sm">
                  Upload Logo
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Color Scheme</span>
          </CardTitle>
          <CardDescription>
            Customize the colors used in your invoice design
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="primary_color"
                  type="color"
                  value={template.primary_color}
                  onChange={(e) => handleTemplateChange('primary_color', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={template.primary_color}
                  onChange={(e) => handleTemplateChange('primary_color', e.target.value)}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="secondary_color"
                  type="color"
                  value={template.secondary_color}
                  onChange={(e) => handleTemplateChange('secondary_color', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={template.secondary_color}
                  onChange={(e) => handleTemplateChange('secondary_color', e.target.value)}
                  placeholder="#1F2937"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="accent_color">Accent Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="accent_color"
                  type="color"
                  value={template.accent_color}
                  onChange={(e) => handleTemplateChange('accent_color', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={template.accent_color}
                  onChange={(e) => handleTemplateChange('accent_color', e.target.value)}
                  placeholder="#10B981"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Type className="h-5 w-5" />
            <span>Typography</span>
          </CardTitle>
          <CardDescription>
            Choose the font family for your invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select 
            value={template.font_family} 
            onValueChange={(value) => handleTemplateChange('font_family', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter (Modern)</SelectItem>
              <SelectItem value="Georgia">Georgia (Classic)</SelectItem>
              <SelectItem value="Arial">Arial (Clean)</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman (Traditional)</SelectItem>
              <SelectItem value="Helvetica">Helvetica (Professional)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Footer & Watermark */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Footer & Watermark</span>
          </CardTitle>
          <CardDescription>
            Customize the footer text and watermark settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="footer_text">Footer Text</Label>
            <Textarea
              id="footer_text"
              value={template.footer_text}
              onChange={(e) => handleTemplateChange('footer_text', e.target.value)}
              placeholder="Thank you for your business!"
              rows={2}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="watermark_enabled"
              checked={template.watermark_enabled}
              onCheckedChange={(checked) => handleTemplateChange('watermark_enabled', checked)}
            />
            <Label htmlFor="watermark_enabled">
              Show watermark on free plan invoices
            </Label>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Template Settings'}
        </Button>
      </div>
    </div>
  )
}
