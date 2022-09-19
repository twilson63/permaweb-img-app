<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "../components/modal.svelte";
  import { take } from "ramda";

  export let open;
  export let title;
  export let id;

  let sendTo = "";
  let percent = 0;

  const dispatch = createEventDispatcher();

  async function handleSubmit(e) {
    dispatch("transfer", {
      id,
      title,
      addr: sendTo,
      percent,
    });
  }
</script>

<Modal
  bind:open
  bgColor="bg-white"
  border="border-4 border-[#929292]"
  cancel={true}
  on:cancel={() => (open = false)}
>
  <div class="px-[36px] py-[24px] flex flex-col space-y-8">
    <img class="h-[55px] w-[55px]" src="assets/transfer2.svg" alt="transfer" />
    <h2 class="text-2xl font-bold text-[#160042]">
      Set your transfer details for:
    </h2>
    <p class="text-xl  text-[#160042]">{title} ({take(5, id)})</p>
    <form class="form space-y-8" on:submit|preventDefault={handleSubmit}>
      <div class="form-control">
        <input
          class="input input-bordered"
          placeholder="Send to address..."
          bind:value={sendTo}
        />
      </div>
      <div class="form-control">
        <div class="flex space-x-2">
          <input
            class="input input-bordered"
            placeholder="Send a percentage of ownership"
            bind:value={percent}
          />
          <button
            type="button"
            class="btn bg-gray-400 border-gray-400 font-light"
            on:click={() => (percent = 100)}>Max</button
          >
        </div>
      </div>
      <p class="text-[14px] font-light">Arweave Fee: 0.00</p>
      <p class="text-[14px] font-light">Total: 0.00</p>
      <button class="btn btn-block rounded-full hover:bg-gray-400"
        >Confirm & Transfer</button
      >
    </form>

    <button
      on:click={() => {
        dispatch("help");
        open = false;
      }}
      class="link no-underline text-center  text-[#160042]"
      >How is ownership calculated?</button
    >
  </div>
</Modal>
