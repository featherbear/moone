import fetch from 'node-fetch'
import dataStore from '../../dataStore'

import type { ServiceInformation, ServiceSpecifier } from './Types'

/**
 * Find upcoming services given a stop ID
 * @param stopID ID of the bus stop / train station / etc ...
 * @param specifier Optional criteria for picking specific services from the current stop
 */
export async function findServices(stopID: string, specifier?: ServiceSpecifier): Promise<ServiceInformation[]> {
  let result = await fetch(`https://api.transport.nsw.gov.au/v1/tp/departure_mon?outputFormat=rapidJSON&coordOutputFormat=EPSG%3A4326&mode=direct&type_dm=stop&name_dm=${stopID}&departureMonitorMacro=true&TfNSWDM=true&version=10.2.1.42`, {
    headers: {
      Accept: 'application/json',
      Authorization: `apikey ${dataStore.TFNSW_API_KEY}`
    }
  }).then(r => r.json())

  if (typeof result['ErrorDetails'] !== 'undefined') {
    throw new Error(result['ErrorDetails'])
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
    return []
  }

  let results: ServiceInformation[] = []
  for (let service of services) {
    if (service['isCancelled']) continue

    const {
      location: { name: stopName },
      isRealtimeControlled,
      departureTimePlanned: _departureTimePlanned,
      departureTimeEstimated: _departureTimeEstimated,
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

    let departureTimePlanned = new Date(_departureTimePlanned)
    let departureTimeEstimated = (_departureTimeEstimated && new Date(_departureTimeEstimated)) || undefined

    // Skip if service has already left
    if ((departureTimeEstimated || departureTimePlanned) < new Date()) continue

    if (isRealtimeControlled) {
      results.push({
        stopName,
        routeNumber,
        routeDescription,
        departureTimePlanned,
        realtime: true,
        delay: new Date(departureTimeEstimated.valueOf() - departureTimePlanned.valueOf()).getMinutes(),
        departureTimeEstimated
      })
    } else {
      results.push({
        stopName,
        routeNumber,
        routeDescription,
        departureTimePlanned,
        realtime: false
      })
    }
  }
  return results;
}


