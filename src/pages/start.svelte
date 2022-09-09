<script>
  import { router } from "tinro";
  import ConnectModal from "../dialogs/connect.svelte";
  import WalletHelp from "../dialogs/wallet-help.svelte";
  let showConnect = false;
  let showWalletHelp = false;
</script>

<main>
  <section class="hero min-h-screen bg-base-100">
    <div class="hero-content flex-col space-y-16">
      <h1 class="text-8xl font-bold">img</h1>
      <p class="text-2xl dark:text-white">
        A utility app that allows you to upload <br />your images as tradeable
        atomic assets.
      </p>
      <div class="flex space-x-4">
        <button class="btn btn-primary" on:click={() => (showConnect = true)}
          >Connect Wallet</button
        >
        <button class="btn btn-outline">Learn More</button>
      </div>
    </div>
  </section>
</main>
<ConnectModal
  bind:open={showConnect}
  on:connected={() => router.goto("/home")}
  on:help={() => (showWalletHelp = true)}
/>
<WalletHelp bind:open={showWalletHelp} />
