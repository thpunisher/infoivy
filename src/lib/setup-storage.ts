'use server'

import { createServerSupabaseClient } from '@/lib/supabase'

export async function setupStorageBucket() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Note: Storage bucket creation typically requires admin privileges
    // This is just a verification function
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      return { error: error.message }
    }

    const invoiceAssetsBucket = buckets.find(bucket => bucket.name === 'invoice-assets')
    
    if (!invoiceAssetsBucket) {
      return { 
        error: 'invoice-assets bucket not found',
        message: 'Please create the invoice-assets storage bucket in your Supabase dashboard',
        buckets: buckets.map(b => b.name)
      }
    }

    return { 
      success: true, 
      bucket: invoiceAssetsBucket,
      message: 'invoice-assets bucket is available'
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
