export function minuteDifference(from: Date | string, to: Date | string) {
  if (typeof from === 'string') from = new Date(from)
  if (typeof to === 'string') to = new Date(to)

  let sign = (from < to) ? -1 : 1
  let minutes = Math.floor((from.valueOf() - to.valueOf()) / 60000);
  return minutes * sign;
}
