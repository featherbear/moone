export function minuteDifference(dateA: Date | string, dateB: Date | string) {
  if (typeof dateA === 'string') dateA = new Date(dateA)
  if (typeof dateB === 'string') dateB = new Date(dateB)

  let sign = (dateA < dateB) ? 1 : -1
  let minutes = Math.floor((dateB.valueOf() - dateA.valueOf()) / 60000);

  return minutes * sign;
}
