import dotenv from 'dotenv'
dotenv.config()

const { TFNSW_API_KEY } = process.env
if (!TFNSW_API_KEY) {
  console.error("TFNSW_API_KEY not defined!")
  process.exit(1)
}

export default {
  TFNSW_API_KEY
}