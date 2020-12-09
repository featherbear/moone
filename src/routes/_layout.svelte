<script lang="ts">
	import 'cirrus-ui'
</script>

<style lang="scss" global>
  html, body, #app {
		height: 100vh;
	}
	
  main {
    position: relative;
    max-width: 56em;
    padding: 2em;
    margin: 0 auto;
		box-sizing: border-box;
		height: 100%;
  }
</style>

<main class="bg-gray-900 text-gray-600">
  <slot />
</main>
