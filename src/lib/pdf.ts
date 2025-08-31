import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { LineItem } from '@/lib/database.types'
import { CURRENCIES } from '@/lib/currencies'

interface GeneratePDFOptions {
  invoice: {
    id: string
    number: string
    issue_date: string
    client_name: string
    client_email: string | null
    line_items: LineItem[]
    subtotal: number
    tax: number
    total: number
  }
  currency?: string
  profile?: {
    full_name: string | null
    email: string
  }
  isFreePlan: boolean
}

export async function generateInvoicePDF({
  invoice,
  profile,
  isFreePlan,
  currency,
}: GeneratePDFOptions): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size
  const { width, height } = page.getSize()

  // Load fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Colors
  const primaryColor = rgb(0.2, 0.2, 0.2)
  const secondaryColor = rgb(0.5, 0.5, 0.5)
  const accentColor = rgb(0.1, 0.4, 0.8)

  // Header
  page.drawText('INVOICE', {
    x: 50,
    y: height - 80,
    size: 32,
    font: helveticaBold,
    color: accentColor,
  })

  // Invoice details
  page.drawText(`Invoice #: ${invoice.number}`, {
    x: 50,
    y: height - 120,
    size: 12,
    font: helveticaFont,
    color: primaryColor,
  })

  page.drawText(`Date: ${new Date(invoice.issue_date).toLocaleDateString()}`, {
    x: 50,
    y: height - 140,
    size: 12,
    font: helveticaFont,
    color: primaryColor,
  })

  // From section
  page.drawText('From:', {
    x: 50,
    y: height - 180,
    size: 14,
    font: helveticaBold,
    color: primaryColor,
  })

  page.drawText(profile?.full_name || 'Your Business Name', {
    x: 50,
    y: height - 200,
    size: 12,
    font: helveticaFont,
    color: primaryColor,
  })

  page.drawText(profile?.email || 'your@email.com', {
    x: 50,
    y: height - 215,
    size: 12,
    font: helveticaFont,
    color: secondaryColor,
  })

  // To section
  page.drawText('To:', {
    x: 300,
    y: height - 180,
    size: 14,
    font: helveticaBold,
    color: primaryColor,
  })

  page.drawText(invoice.client_name, {
    x: 300,
    y: height - 200,
    size: 12,
    font: helveticaFont,
    color: primaryColor,
  })

  if (invoice.client_email) {
    page.drawText(invoice.client_email, {
      x: 300,
      y: height - 215,
      size: 12,
      font: helveticaFont,
      color: secondaryColor,
    })
  }

  // Line items table
  const tableY = height - 280
  const colWidths = [250, 80, 80, 80]
  const colX = [50, 300, 380, 460]

  // Table headers
  const headers = ['Description', 'Quantity', 'Unit Price', 'Amount']
  headers.forEach((header, i) => {
    page.drawText(header, {
      x: colX[i],
      y: tableY,
      size: 12,
      font: helveticaBold,
      color: primaryColor,
    })
  })

  // Table rows
  let currentY = tableY - 25
  invoice.line_items.forEach((item) => {
    page.drawText(item.description, {
      x: colX[0],
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: primaryColor,
    })

    page.drawText(item.quantity.toString(), {
      x: colX[1],
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: primaryColor,
    })

    const symbol = CURRENCIES[(currency || 'USD') as keyof typeof CURRENCIES]?.symbol || '$'
    const unitPrice = item.unit_price ?? 0
    const amount = item.amount ?? 0
    
    // Draw unit price
    page.drawText(`${symbol}${unitPrice.toFixed(2)}`, {
      x: colX[2],
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: primaryColor,
    })

    // Draw total amount
    page.drawText(`${symbol}${amount.toFixed(2)}`, {
      x: colX[3],
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: primaryColor,
    })

    currentY -= 20
  })

  // Totals
  const totalsY = currentY - 40
  page.drawText('Subtotal:', {
    x: 380,
    y: totalsY,
    size: 12,
    font: helveticaBold,
    color: primaryColor,
  })

  const symbol = CURRENCIES[(currency || 'USD') as keyof typeof CURRENCIES]?.symbol || '$'
  page.drawText(`${symbol}${invoice.subtotal.toFixed(2)}`, {
    x: 460,
    y: totalsY,
    size: 12,
    font: helveticaFont,
    color: primaryColor,
  })

  page.drawText('Tax:', {
    x: 380,
    y: totalsY - 20,
    size: 12,
    font: helveticaBold,
    color: primaryColor,
  })

  page.drawText(`${symbol}${invoice.tax.toFixed(2)}`, {
    x: 460,
    y: totalsY - 20,
    size: 12,
    font: helveticaFont,
    color: primaryColor,
  })

  page.drawText('Total:', {
    x: 380,
    y: totalsY - 40,
    size: 14,
    font: helveticaBold,
    color: accentColor,
  })

  page.drawText(`${symbol}${invoice.total.toFixed(2)}`, {
    x: 460,
    y: totalsY - 40,
    size: 14,
    font: helveticaBold,
    color: accentColor,
  })

  // Add watermark for free plan (branded)
  if (isFreePlan) {
    const watermarkText = 'Invoify • Free Plan'
    page.drawText(watermarkText, {
      x: width / 2 - (watermarkText.length * 3.5),
      y: height / 2,
      size: 28,
      font: helveticaBold,
      color: rgb(0.85, 0.88, 0.95),
    })
  }

  // Footer / Branding
  page.drawText('Thank you for your business!', {
    x: 50,
    y: 50,
    size: 12,
    font: helveticaFont,
    color: secondaryColor,
  })

  return await pdfDoc.save()
}
