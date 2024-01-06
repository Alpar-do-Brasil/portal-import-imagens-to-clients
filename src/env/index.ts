import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  FIND_CLIENT_TOKEN: z.string(),
  FIND_CLIENT_URL: z.string(),
  CLIENTS_FILENAME: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error(_env.error.format())

  throw new Error('Invalid environment')
}

export const env = _env.data
