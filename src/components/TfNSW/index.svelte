<script lang="ts">
  import TfNSWData from "../../data/TfNSW";

  import Card from "./Card.svelte";
  import type { ServiceInformation } from "./Types";

  import { onMount } from "svelte";

  let tripData: ServiceInformation[][] = [];

  onMount(() => {
    const updateTfNSW = async () => {
      console.log("gonna do update");
      tripData = [
        ...(await fetch("data/TfNSW.json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(TfNSWData),
        }).then((r) => r.json())),
      ];
    };

    updateTfNSW();
    setInterval(updateTfNSW, 30 * 1000);
  });
</script>

{#each tripData as services}
  {#if services.length}
    <Card data={services[0]} />
    {#if services[1]}
      <Card data={services[1]} />
    {/if}
  {/if}
{/each}
