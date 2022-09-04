<script>
  import Modal from "../components/modal.svelte";
  export let open = false;
</script>

<Modal {open} cancel={false}>
  <h3 class="text-3xl">Deploying to Arweave...</h3>
</Modal>
