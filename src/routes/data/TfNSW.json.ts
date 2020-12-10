import { findServices } from "../../components/TfNSW/index"
import type { ServiceSpecifier } from "../../components/TfNSW/Types"

export async function post(req, res, next) {
  const { stopID, specifier }: { stopID: string, specifier?: ServiceSpecifier } = req.body

  let data = await findServices(stopID, specifier)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}