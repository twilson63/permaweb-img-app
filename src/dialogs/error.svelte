<script>
  import Modal from "../components/modal.svelte";
  import { createEventDispatcher } from "svelte";

  export let open = false;
  export let msg = "An Error Occurred!";

  const dispatch = createEventDispatcher();
</script>

<Modal {open} on:cancel={() => dispatch("cancel")}>
  <div
    class="m-4 border-4 border-error pb-8 px-2 flex flex-col items-center justify-center"
  >
    <h3 class="mb-8 text-3xl bg-error text-white p-2 mt-4">Error!</h3>
    <p class="text-xl">{msg}</p>
  </div>
</Modal>
