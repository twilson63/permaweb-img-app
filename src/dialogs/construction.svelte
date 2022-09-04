<script>
  import Modal from "../components/modal.svelte";
  import { createEventDispatcher } from "svelte";

  export let open = false;
  export let msg = "Feature is in process of being developed.";

  const dispatch = createEventDispatcher();
</script>

<Modal {open} on:cancel={() => dispatch("cancel")}>
  <div
    class="m-4 border-4 border-warning pb-8 px-2 flex flex-col items-center justify-center"
  >
    <h3 class="mb-8 text-3xl bg-warning text-white p-2 mt-4">
      ! Under Construction !
    </h3>
    <p class="text-xl">{msg}</p>
  </div>
</Modal>
