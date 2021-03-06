import { findServices } from "../../components/TfNSW/Lookup"
import type { ServiceSpecifier, ServiceInformation } from "../../components/TfNSW/Types"

/**
 * Concurrently execute a function on a set of `items`, at most `concurrency` at time.  
 * Results maintain item order
 * 
 * @param items List of items
 * @param processor Function to perform on the item
 * @param concurrency (default = 5) Maximum number of active processors
 */
async function process<T>(items: any[], processor: (data: any) => Promise<T> | T, concurrency: number = 5): Promise<T[]> {
  let queue = []
  let results = []

  const shift = () => {
    let fn = queue.shift()
    fn && fn()
  }

  for (let data of items) {
    results.push(new Promise((resolve, reject) => {
      queue.push(async () => {
        try {
          let result = await processor(data)
          shift();
          return resolve(result)
        } catch (e) {
          shift();
          return reject(e)
        }
      })
    }))
  }

  for (let i = 0; i < concurrency; i++) shift()

  return Promise.all(results)
}

export async function post(req, res, next) {
  const requests = Array.isArray(req.body) ? req.body : [req.body]

  const results = await process<ServiceInformation[]>(requests, async (request) => {
    const { stopID, specifier }: { stopID: string, specifier?: ServiceSpecifier } = request
    return await findServices(stopID, specifier)
  }, 5)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(results))
}