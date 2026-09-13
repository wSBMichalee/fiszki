import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('decks').select('id, title, last_studied_at');
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  console.log("Decks in DB:", JSON.stringify(data, null, 2));
  
  if (data && data.length > 0) {
    const deck = data[0]; // Let's just update the first one
    console.log("Updating deck:", deck.title);
    
    const { error: updateError } = await supabase
      .from('decks')
      .update({ last_studied_at: new Date().toISOString() })
      .eq('id', deck.id);
      
    if (updateError) {
      console.error("Update error:", updateError);
    } else {
      console.log("Successfully updated last_studied_at for", deck.title);
    }
  }
}
check();
