<script>
  import { createEventDispatcher } from "svelte";
  import { rnd } from "../utils.js";

  export let id = rnd(20, rnd.alphaLower);
  export let open = false;
  export let cancel = true;

  const dispatch = createEventDispatcher();

  function cancelClick() {
    dispatch("cancel");
  }
</script>

<input type="checkbox" {id} bind:checked={open} class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    {#if cancel}
      <button
        on:click={cancelClick}
        class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
      >
    {/if}
    <slot />
  </div>
</div>
