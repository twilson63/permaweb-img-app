<script>
  import Modal from "../components/modal.svelte";
  export let open = false;
  export let percent = 0;
  export let addr = "";
  export let title = "";
</script>

<Modal {open} cancel={false}>
  <h3 class="text-xl font-light">Transfering...</h3>
  <p class="text-sm font-light">
    {percent} % of {title} to <br />
    {addr}
  </p>
</Modal>
