import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey)

async function runTest() {
  console.log('--- STARTING ACCOUNT DELETION TEST ---')
  const testEmail = `test.delete.${Date.now()}@example.com`
  const testPassword = 'testpassword123'

  // 1. Create User
  console.log('1. Creating test user:', testEmail)
  const { data: userData, error: userError } = await adminClient.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true
  })
  if (userError) throw userError
  const userId = userData.user.id
  console.log('   User created with ID:', userId)

  // 2. Login User to get normal client session (optional, but we can just use admin client to bypass RLS for setup)
  console.log('2. Creating dummy image in Storage...')
  const dummyFilename = `test-delete-image-${Date.now()}.txt`
  const { data: storageData, error: storageError } = await adminClient.storage
    .from('deck-images')
    .upload(dummyFilename, 'dummy image content', { contentType: 'text/plain' })
  if (storageError) throw storageError
  console.log('   Image uploaded to Storage:', dummyFilename)

  const { data: publicUrlData } = adminClient.storage.from('deck-images').getPublicUrl(storageData.path)
  const dummyImageUrl = publicUrlData.publicUrl
  console.log('   Public URL:', dummyImageUrl)

  // 3. Create Deck & Card
  console.log('3. Creating deck and card in Database...')
  const { data: deckData, error: deckError } = await adminClient
    .from('decks')
    .insert({
      user_id: userId,
      title: 'Test Deck to Delete',
      source_image_urls: [dummyImageUrl]
    })
    .select()
    .single()
  if (deckError) throw deckError
  const deckId = deckData.id
  console.log('   Deck created with ID:', deckId)

  const { error: cardError } = await adminClient
    .from('cards')
    .insert({
      deck_id: deckId,
      question: 'Test Q',
      answer: 'Test A'
    })
  if (cardError) throw cardError
  console.log('   Card created for Deck.')

  // 4. SIMULATE deleteAccount Action Logic
  console.log('4. SIMULATING ACCOUNT DELETION...')
  
  // Step A: Fetch decks
  const { data: decks, error: fetchError } = await adminClient
    .from('decks')
    .select('source_image_urls')
    .eq('user_id', userId)
  if (fetchError) throw fetchError

  if (decks && decks.length > 0) {
    const allUrls = decks.flatMap(d => d.source_image_urls || [])
    const filesToDelete = []
    for (const url of allUrls) {
      if (!url) continue
      const parts = url.split('/deck-images/')
      if (parts.length > 1) {
        filesToDelete.push(parts[1])
      }
    }

    if (filesToDelete.length > 0) {
      console.log('   Deleting files from storage:', filesToDelete)
      const { error: delStorageErr } = await adminClient.storage
        .from('deck-images')
        .remove(filesToDelete)
      if (delStorageErr) throw delStorageErr
    }
  }

  // Step B: Delete User
  console.log('   Deleting user from Auth...')
  const { error: delUserErr } = await adminClient.auth.admin.deleteUser(userId)
  if (delUserErr) throw delUserErr

  console.log('5. VERIFYING DELETION...')
  
  // Verify User
  const { data: checkUser, error: checkUserErr } = await adminClient.auth.admin.getUserById(userId)
  if (checkUserErr && checkUserErr.status === 404) {
    console.log('   [SUCCESS] User deleted.')
  } else if (!checkUserErr) {
    throw new Error('User still exists!')
  }

  // Verify Database Cascade
  const { data: checkDecks } = await adminClient.from('decks').select('*').eq('id', deckId)
  if (!checkDecks || checkDecks.length === 0) {
    console.log('   [SUCCESS] Deck deleted (CASCADE worked).')
  } else {
    throw new Error('Deck still exists!')
  }

  const { data: checkCards } = await adminClient.from('cards').select('*').eq('deck_id', deckId)
  if (!checkCards || checkCards.length === 0) {
    console.log('   [SUCCESS] Cards deleted (CASCADE worked).')
  } else {
    throw new Error('Cards still exist!')
  }

  // Verify Storage
  console.log('   Verifying Storage deletion...')
  // Trying to download the file should fail
  const { data: checkFile, error: checkFileErr } = await adminClient.storage.from('deck-images').download(dummyFilename)
  if (checkFileErr) {
    console.log('   [SUCCESS] File deleted from Storage.')
  } else {
    throw new Error('File still exists in Storage!')
  }

  console.log('--- TEST PASSED SUCCESSFULLY ---')
}

runTest().catch(err => {
  console.error('TEST FAILED:', err)
  process.exit(1)
})
