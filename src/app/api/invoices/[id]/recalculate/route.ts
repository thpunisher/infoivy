import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the invoice
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', resolvedParams.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Recalculate totals from line items
    const lineItems = invoice.line_items || []
    const calculatedSubtotal = lineItems.reduce((sum: number, item: any) => {
      const quantity = parseFloat(item.quantity) || 1
      const rate = parseFloat(item.rate || item.price || item.unit_price) || 0
      return sum + (quantity * rate)
    }, 0)

    // Keep existing tax rate but recalculate tax amount
    const existingTaxRate = invoice.subtotal > 0 ? (parseFloat(invoice.tax) / parseFloat(invoice.subtotal)) * 100 : 0
    const recalculatedTax = calculatedSubtotal * (existingTaxRate / 100)
    const recalculatedTotal = calculatedSubtotal + recalculatedTax

    // Update the invoice with correct calculations
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('invoices')
      .update({
        subtotal: calculatedSubtotal,
        tax: recalculatedTax,
        total: recalculatedTotal
      })
      .eq('id', resolvedParams.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      invoice: updatedInvoice,
      recalculated: {
        subtotal: calculatedSubtotal,
        tax: recalculatedTax,
        total: recalculatedTotal
      }
    })
  } catch (error) {
    console.error('Error recalculating invoice:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
