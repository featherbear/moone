import fetch from 'node-fetch'
import dataStore from '../../dataStore'

/**
 * Either `to: string | string[]`  
 * OR `route: string | string[]`
 */
type serviceSpecifier = {
  /**
   * Destination name, or array of destination names
   */
  to: string | string[]
  route?: never
} | {
  /**
   * Route name, or array of route names
   */
  route: string | string[]
  to?: never
}

/**
 * Find upcoming services given a stop ID
 * @param stopID ID of the bus stop / train station / etc ...
 * @param specifier Optional criteria for picking specific services from the current stop
 * 
 * TODO: Make it actually return something
 */
export async function findServices(stopID: string, specifier?: serviceSpecifier) {
  let result = await fetch(`https://api.transport.nsw.gov.au/v1/tp/departure_mon?outputFormat=rapidJSON&coordOutputFormat=EPSG%3A4326&mode=direct&type_dm=stop&name_dm=${stopID}&departureMonitorMacro=true&TfNSWDM=true&version=10.2.1.42`, {
    headers: {
      Accept: 'application/json',
      Authorization: `apikey ${dataStore.TFNSW_API_KEY}`
    }
  }).then(r => r.json())

  if (typeof result['ErrorDetails'] !== 'undefined') {
    console.error(result['ErrorDetails'])
    throw new Error()
  }

  let { stopEvents: services }: { stopEvents: Array<any> } = result
  if (typeof specifier !== 'undefined') {
    if (typeof specifier.route !== 'undefined') {
      const candidates = (typeof specifier.route === 'string') ? [specifier.route] : specifier.route
      services = services.filter((service) => {
        let routeNumber = service?.['transportation']?.['number']
        return candidates.includes(routeNumber)
      })
    } else
      // Be explicit with type checking
      if (typeof specifier.to !== 'undefined') {
        const candidates = (typeof specifier.to === 'string') ? [specifier.to] : specifier.to
        services = services.filter((service) => {
          let routeNumber = service?.['transportation']?.['destination']?.['name']
          return candidates.includes(routeNumber)
        })
      }
  }

  if (!services) {
    // ie stop doesn't exist, or there really aren't any routes
    console.warn('No routes found')
    return
  }

  for (let service of services) {
    const {
      location: { name: stopName },
      isRealtimeControlled,
      departureTimePlanned,
      departureTimeEstimated,
      transportation: { number: routeNumber, description: routeDescription }
    }: {
      /**
       * Data types for deconstruction
       */
      location: { name: string },
      isRealtimeControlled: boolean,
      departureTimePlanned: string,
      departureTimeEstimated: string,
      transportation: { number: string, description: string }
    }
      = service


    // Skip if service has already left
    if (
      ((departureTimeEstimated && new Date(departureTimeEstimated)) ||
        new Date(departureTimePlanned)) < new Date()
    )
      continue

    if (isRealtimeControlled) {
      let difference = new Date(
        new Date(departureTimeEstimated).valueOf() - new Date(departureTimePlanned).valueOf()
      ).getMinutes()
      if (difference) {
        console.log(
          `${routeDescription} service (${routeNumber}) is ${difference} min ${difference > 0 ? 'late' : 'early'
          }`
        )
      } else {
        console.log(`${routeDescription} service (${routeNumber}) is on time`)
      }
    } else {
      // console.log(`${routeDescription} service (${routeNumber}) has no real-time data`)
    }
  }
}


