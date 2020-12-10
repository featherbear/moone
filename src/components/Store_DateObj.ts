import { readable } from 'svelte/store'

function update() {
  return new Date()
}
export default readable(update(), set => {
  let interval = setInterval(() => set(update()), 1000)
  return () => clearInterval(interval)
})