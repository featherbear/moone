<script lang="ts">
  import ClockProvider from "../components/Store_DateFmt";
  import TfNSW from "../components/TfNSW/";
</script>

<svelte:head>
  <title>Moone</title>
</svelte:head>

<h1>{$ClockProvider}</h1>
<TfNSW />

<style lang="scss">
</style>
