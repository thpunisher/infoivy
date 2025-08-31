import { getUser } from '@/lib/auth'
import { InvoiceTemplateCustomizer } from '@/components/invoice-template-customizer'

export default async function InvoiceTemplatesPage() {
  const user = await getUser()

  if (!user) {
    return <div>Unauthorized</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Invoice Templates</h1>
        <p className="text-gray-600">
          Customize your invoice design with professional templates, colors, and branding
        </p>
      </div>

      {/* Template Customizer */}
      <InvoiceTemplateCustomizer />
    </div>
  )
}
