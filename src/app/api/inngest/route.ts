import { serve } from 'inngest/next'
import { inngest } from '@/inngest/client'
import { processNotesJob } from '@/inngest/functions'

// Tworzymy endpoint (API Route), pod którym Inngest będzie się komunikował z naszą aplikacją
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processNotesJob,
  ],
})
