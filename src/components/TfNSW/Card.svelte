<script lang="ts">
  import type { ServiceInformation } from "./Types";
  import { minuteDifference } from "./Util";

  export let data: ServiceInformation;
</script>

<div class="tile u-items-center">
  <h5 class="mb-0" class:text-red-600={data.delay > 0} class:text-green-500={data.delay < 0} >
    {minuteDifference(new Date(), data.departureTimeEstimated || data.departureTimePlanned)}
    min
  </h5>
  <div class="tile__container">
    <p class="tile__title m-0">{data.routeDescription} ({data.routeNumber})</p>
    {#if data.delay}
      <p class="tile__subtitle m-0">
        {data.delay}
        min
        {data.delay > 0 ? 'late' : 'early'}
      </p>
    {/if}
  </div>
</div>
