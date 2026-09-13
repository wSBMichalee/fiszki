'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function deleteAccount() {
  const supabase = await createClient()

  // 1. Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Brak autoryzacji')
  }

  // 2. Init Admin Client
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!.trim()
  )

  // 3. Delete related images from Storage
  try {
    const { data: decks, error: decksError } = await supabase
      .from('decks')
      .select('source_image_urls')
      .eq('user_id', user.id)

    if (!decksError && decks && decks.length > 0) {
      const allUrls = decks.flatMap(d => d.source_image_urls || [])
      
      const filesToDelete: string[] = []
      for (const url of allUrls) {
        if (!url) continue
        // Extract filename from public URL (e.g. .../public/deck-images/1789324450717-1a2b3.jpg)
        const parts = url.split('/deck-images/')
        if (parts.length > 1) {
          filesToDelete.push(parts[1])
        }
      }

      if (filesToDelete.length > 0) {
        // We use adminClient to ensure we have permission to delete any object regardless of RLS
        const { error: storageError } = await adminClient.storage
          .from('deck-images')
          .remove(filesToDelete)
        
        if (storageError) {
          console.error('Failed to remove some images from storage, but proceeding with account deletion:', storageError)
        }
      }
    }
  } catch (err) {
    console.error('Error during image deletion step:', err)
    // Do not throw, continue to delete the account
  }

  // 4. Delete the user
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)
  
  if (deleteError) {
    console.error('Failed to delete user:', deleteError)
    throw new Error('Wystąpił błąd podczas usuwania konta: ' + deleteError.message)
  }

  // 5. Sign out the local session via cookies
  await supabase.auth.signOut()

  // 6. Redirect to home page
  redirect('/?deleted=true')
}
