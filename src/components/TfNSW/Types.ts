/**
 * Either `to: string | string[]`  
 * OR `route: string | string[]`
 */
export type ServiceSpecifier = {
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

export interface ServiceInformation {
  stopName: string
  routeNumber: string
  routeDescription: string
  departureTimePlanned: Date,
  realtime: boolean
  delay?: number
  departureTimeEstimated?: Date,
}
