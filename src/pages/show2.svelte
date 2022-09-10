<script>
  import Navbar from "../components/navbar.svelte";
  import { getAssetData } from "../lib/asset.js";
  import { atomicToStamp } from "../lib/utils.js";
  import Construction from "../dialogs/construction.svelte";
  import Stamping from "../dialogs/stamping.svelte";
  import ErrorDialog from "../dialogs/error.svelte";
  import ConnectModal from "../dialogs/connect.svelte";
  import WalletHelp from "../dialogs/wallet-help.svelte";

  import { onMount } from "svelte";
  import { imgCache, profile } from "../store.js";
  import { isVouched, stamp, getCount, getRewards } from "../lib/stamp.js";
  import { getProfile } from "../lib/account.js";

  export let id;
  let src = "https://placehold.co/400";
  let imageMsg = "";
  let stampDlg = false;
  let errorDlg = false;
  let errorMsg = "";
  let showConnect = false;
  let showHelp = false;

  onMount(async () => {
    const i = $imgCache.find((img) => img.id === id);

    if (i) {
      src = i.src;
      imageMsg =
        "Currently displaying cache, when deploying directly to arweave, it can take up to 30 minutes to show on chain...";
    } else {
      src = `https://arweave.net/${encodeURI(id)}/asset`;
      //src = await loadImage(`https://arweave.net/${encodeURI(id)}/asset`);
      //console.log(src);
    }
  });

  let constructionDlg = false;
  let msg = "";

  function loadImage(url) {
    return new Promise((resolve) => {
      fetch(url)
        // Extract as a blob
        .then((resp) => resp.blob())
        .then((blob) => {
          console.log("got blob");
          // Image element to load the image into. Could be passed as a variable if you already have an element to load into.
          const img = document.createElement("img");
          // Use blob as object url
          //img.src = URL.createObjectURL(blob);

          // wait for image to be loaded before resolving the promise
          // img.onload = () => {
          //   console.log("loaded");
          //   resolve(img.src);
          // };
          resolve(URL.createObjectURL(blob));
        });
    });
  }

  async function handleStamp() {
    if (!window.arweaveWallet) {
      alert("Wallet not connected!");
      return;
    }
    stampDlg = true;
    const addr = await window.arweaveWallet.getActiveAddress();
    isVouched(addr)
      .then((res) =>
        res ? stamp(id) : Promise.reject(new Error("could not stamp asset"))
      )
      .then((res) => {
        assetCount = getCount(id);
        stampDlg = false;
      })
      .catch((e) => {
        stampDlg = false;
        errorMsg = e.message;
        errorDlg = true;
      });
  }

  function tweetLink(title, id) {
    return `https://twitter.com/intent/tweet?text=${encodeURI(
      "🪧 STAMP\n\n" + title.replace("#", "no ") + "\n\n🐘"
    )}&url=https://img.arweave.dev/%23/show/${id}`;
  }

  let assetCount = getCount(id);
  let assetData = getAssetData(id);
</script>

<svelte:head>
  <title>img</title>
  <meta property="og:image" content="{location.origin}/{id}" />
  <meta property="og:url" content="{location.origin}/#/show/{id}" />
</svelte:head>

<Navbar />
{#await getAssetData(id) then asset}
  <main>
    <section class="hero min-h-screen bg-base-100">
      <div class="hero-content space-x-4">
        <div class="w-1/2 grid place-items-center">
          <img class="h-[400px]" {src} alt={asset.title} />
          {#if imageMsg !== ""}
            <p>{imageMsg}</p>
          {/if}
          <button
            on:click={handleStamp}
            class="mt-4 btn btn-block rounded-none"
          >
            <span class="text-xl font-normal">STAMP</span>
            <img
              class="ml-4 h-[35px] w-[35px]"
              src="assets/stamp.svg"
              alt="stamp-logo"
            />
          </button>
        </div>
        <div class="w-1/2 ml-8">
          <div class="mb-4 flex items-center justify-between">
            <h1 class="text-3xl">{asset.title}</h1>
            <a
              target="_blank"
              href={tweetLink(asset.title, id)}
              class="btn btn-outline btn-sm rounded-none font-normal">share</a
            >
          </div>
          <p class="text-xl">{asset.description}</p>
          <div class="mt-4">
            <div class="mb-2 uppercase">Creator</div>
            {#await getProfile(asset.owner) then creator}
              <div class="flex items-center space-x-2">
                <img
                  class="mask mask-circle h-[35px] w-[35px]"
                  src={creator.profile.avatarURL}
                  alt="avatar"
                />
                {#if creator.profile.handleName === ""}
                  <div>{asset.owner}</div>
                {:else}
                  <div>{creator.profile.handleName}</div>
                {/if}
              </div>
            {/await}
          </div>
          <div class="mt-8 space-y-4">
            <div class="flex justify-between">
              <div class="mb-4 flex flex-col">
                <div>STAMPS</div>
                <div class="flex space-x-4 items-center">
                  <img
                    class="h-[35px] w-[35px]"
                    src="assets/stamp2.svg"
                    alt="stamp"
                  />
                  {#await assetCount then count}
                    <div>{count}</div>
                  {/await}
                </div>
              </div>
              <div>
                <div class="flex flex-col">
                  <div class="uppercase">Rewards</div>
                  <div class="flex space-x-4">
                    <div class="font-bold">$TAMP</div>
                    {#await getRewards(id) then rewards}
                      <div>{Number(atomicToStamp(rewards)).toFixed(5)}</div>
                    {/await}
                  </div>
                </div>
              </div>
            </div>
            <div>
              Link: <a class="link" href="https://arweave.net/{id}">{id}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
{/await}
<Construction
  open={constructionDlg}
  {msg}
  on:cancel={() => (constructionDlg = false)}
/>
<Stamping bind:open={stampDlg} />
<ErrorDialog bind:open={errorDlg} msg={errorMsg} />
<ConnectModal bind:open={showConnect} on:help={() => (showHelp = true)} />
<WalletHelp bind:open={showHelp} />
