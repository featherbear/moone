<script lang="ts">
  import type { ServiceInformation } from "./Types";
  import { minuteDifference } from "./Util";

  export let data: ServiceInformation;
</script>

{data.routeDescription}

{data.routeNumber}

{minuteDifference(new Date(), data.departureTimeEstimated || data.departureTimePlanned)}
min

{#if data.delay}({data.delay} min {data.delay > 0 ? 'late' : 'early'}){/if}
