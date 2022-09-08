<script>
  import { getAssetData } from "../lib/asset.js";
  import Construction from "../dialogs/construction.svelte";
  import Stamping from "../dialogs/stamping.svelte";
  import ErrorDialog from "../dialogs/error.svelte";

  import { onMount } from "svelte";
  import { imgCache } from "../store.js";
  import { isVouched, stamp, getCount } from "../lib/stamp.js";

  export let id;
  let src = "https://placehold.co/400";
  let imageMsg = "";
  let stampDlg = false;
  let errorDlg = false;
  let errorMsg = "";

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

  let assetCount = getCount(id);
</script>

<nav
  class="flex space-x-4 h-[75px] bg-secondary text-secondary-content flex items-center"
>
  <a class="btn btn-ghost" href="/">img</a>
  <a class="btn btn-ghost" href="/about">About</a>
</nav>
{#await getAssetData(id) then asset}
  <main>
    <section class="hero min-h-screen bg-base-100">
      <div class="hero-content space-x-4">
        <div class="w-1/2 grid place-items-center">
          <img class="w-full h-full" {src} alt={asset.title} />
          {#if imageMsg !== ""}
            <p>{imageMsg}</p>
          {/if}
        </div>
        <div class="w-1/2 ml-8">
          <h1 class="text-5xl mb-8">{asset.title}</h1>
          <p class="text-xl">{asset.description}</p>
          <div class="mt-8 space-y-4">
            <div class="mb-4">
              Count:
              {#await assetCount then count}
                {count}
              {/await}
            </div>
            <button
              on:click={handleStamp}
              class="btn btn-block btn-outline rounded-none">STAMP</button
            >
            <a
              href="/hx/{asset.owner}"
              class="btn btn-block btn-outline btn-secondary rounded-none"
              >Owner History</a
            >
            <!--
            <button
              on:click={() => {
                msg = "SELL feature is not implemented yet, coming soon!";
                constructionDlg = true;
              }}
              class="btn btn-block btn-outline btn-error rounded-none"
              >SELL</button
            >
            <button
              on:click={() => {
                msg = "BUY feature is not implemented yet, coming soon!";
                constructionDlg = true;
              }}
              class="btn btn-block btn-outline btn-success rounded-none"
              >BUY</button
            >
            -->
            <a
              href="/"
              class="btn btn-block btn-outline btn-primary rounded-none"
              >Back to Upload</a
            >
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
