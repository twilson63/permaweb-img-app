<script>
  import { router } from "tinro";
  import { listAssets } from "../lib/asset.js";

  import ConnectModal from "../dialogs/connect.svelte";
  import WalletHelp from "../dialogs/wallet-help.svelte";
  let showConnect = false;
  let showWalletHelp = false;
</script>

<main>
  <section class="hero min-h-screen bg-base-100">
    <div class="hero-content flex-col space-y-16">
      <h1 class="text-8xl font-bold hover:text-primary">img</h1>
      <p class="text-2xl dark:text-white">
        A utility app that allows you to upload <br />your images as tradeable
        atomic assets.
      </p>
      <div class="flex space-x-4">
        <button class="btn btn-primary" on:click={() => (showConnect = true)}
          >Connect Wallet</button
        >
        <a href="/about" class="btn btn-outline">Learn More</a>
      </div>
      {#await listAssets(9) then imgs}
        <div class="w-full grid gap-4 grid-cols-3 grid-flow-row">
          {#each imgs as img}
            <div>
              <a href="/show/{img.id}">
                <img
                  class="h-[100px] w-[128px]"
                  src="https://arweave.net/{img.id}"
                  alt={img.title}
                  onerror="this.src = 'assets/img.png'"
                />
              </a>
            </div>
          {/each}
        </div>
      {/await}
    </div>
  </section>
</main>
<ConnectModal
  bind:open={showConnect}
  on:connected={() => router.goto("/home")}
  on:help={() => (showWalletHelp = true)}
/>
<WalletHelp bind:open={showWalletHelp} />
