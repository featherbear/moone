<script lang="ts">
  import Card from "../components/TfNSW/Card.svelte";
  import ClockProvider from "../components/Store_DateFmt";

  import TfNSWData from "../data/TfNSW";

  import type { ServiceInformation } from "../components/TfNSW/Types";

  import { onMount } from "svelte";

  let tripData: ServiceInformation[][] = [];
  onMount(async () => {
    tripData = await fetch("data/TfNSW.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TfNSWData),
    }).then((r) => r.json());
  });
</script>

<style lang="scss">
</style>

<svelte:head>
  <title>Moone</title>
</svelte:head>

<h1>{$ClockProvider}</h1>

{#if tripData.length}
  {#each tripData as services}
    {#if services.length}
      <Card data={services[0]} />
      {#if services[1]}
        <Card data={services[1]} />
      {/if}
    {/if}
  {/each}
{/if}
