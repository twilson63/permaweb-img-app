<script>
  import Navbar from "../components/navbar.svelte";
  import { marked } from "marked";
  import ConnectModal from "../dialogs/connect.svelte";
  import WalletHelp from "../dialogs/wallet-help.svelte";

  let showConnect = false;
  let showHelp = false;
</script>

<Navbar on:connect={() => (showConnect = true)} />
<main>
  <section class="hero min-h-screen bg-base-100">
    <div class="hero-content flex-col">
      <div class="prose prose-xl">
        {@html marked.parse(`
# pst

\`pst\` is a decentrailized application that has been created to showcase Atomic Assets. An Atomic Asset is
a Tradeable PST (Profit Sharing Token), that can be STAMPed (https://stamps.live). The \`STAMP\` process gives viewers the ability to create a proof of 
attention. And by making the data tradeable, it allows the community to share in the rewards.
 
For more information about the tutorial, you can find it here: [Tutorial](https://pjgr5rzoytzbk7yizk7755n226aurasg4m7qojmwjhbcujbjhe5a.arweave.net/ek0exy7E8hV_CMq__vW614FIgkbjPwcllknCKiQpOTo)
You can also find the completed github repository for this tutorial here: [Github Source](https://github.com/twilson63/permaweb-img-app/tree/atomic-tx)
        
        `)}
      </div>
    </div>
  </section>
</main>
<ConnectModal bind:open={showConnect} on:help={() => (showHelp = true)} />
<WalletHelp bind:open={showHelp} />
