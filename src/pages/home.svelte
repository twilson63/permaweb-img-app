<script>
  import { providers } from "ethers";
  import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

  import { imgCache } from "../store.js";
  import { deploy, deployAr } from "../lib/deploy.js";
  import DeployDialog from "../dialogs/deploy.svelte";
  import ErrorDialog from "../dialogs/error.svelte";
  import ConfirmDialog from "../dialogs/confirm.svelte";
  import Navbar from "../components/navbar.svelte";

  //import { WebBundlr } from "@bundlr-network/client";
  const WebBundlr = Bundlr.default;

  const BAR = __BAR_CONTRACT__;

  let files = [];
  let title = "";
  let description = "";
  let topics = "";
  let deployDlg = false;
  let errorMessage = "";
  let errorDlg = false;
  let confirmDlg = false;
  let tx = "";
  let currency = "";

  function showError(msg) {
    errorMessage = msg;
    errorDlg = true;
  }

  async function doDeploy(e) {
    const asset = {
      file: files[0],
      title,
      description,
      topics,
    };

    if (currency === "matic") {
      if (!window.ethereum) {
        showError("Metamask is required!");
        return;
      }
      try {
        deployDlg = true;

        await window.ethereum.enable();
        const provider = new providers.Web3Provider(window.ethereum);
        await provider._ready();

        const bundlr = new WebBundlr(
          "https://node1.bundlr.network",
          "matic",
          provider
        );

        await bundlr.ready();

        // fund account
        const price = await bundlr.getPrice(files[0].size);
        const balance = await bundlr.getLoadedBalance();

        if (balance.isLessThan(price)) {
          await bundlr.fund(price.minus(balance).multipliedBy(1.1).toFixed(0));
        }

        const result = await deploy(bundlr, asset);

        deployDlg = false;

        // reset form
        document.forms[0].reset();

        tx = result2.id;

        $imgCache = [
          ...$imgCache,
          { id: result2.id, src: URL.createObjectURL(files[0]) },
        ];

        confirmDlg = true;
      } catch (e) {
        console.log(e);
        deployDlg = false;
        errorMessage = e.message;
        errorDlg = true;
      }
    } else if (currency === "sol") {
      if (!window.solana) {
        showError("Phantom Wallet is required!");
        return;
      }
      try {
        deployDlg = true;
        await window.solana.connect();
        const provider = new PhantomWalletAdapter();
        await provider.connect();

        const bundlr = new WebBundlr(
          "https://node1.bundlr.network",
          "solana",
          provider
        );
        await bundlr.ready();
        // fund account
        const price = await bundlr.getPrice(files[0].size);
        const balance = await bundlr.getLoadedBalance();

        if (balance.isLessThan(price)) {
          await bundlr.fund(price.minus(balance).multipliedBy(1.1).toFixed(0));
        }

        const result = await deploy(bundlr, asset);

        deployDlg = false;

        // reset form
        document.forms[0].reset();

        tx = result2.id;

        $imgCache = [
          ...$imgCache,
          { id: result2.id, src: URL.createObjectURL(files[0]) },
        ];

        confirmDlg = true;
      } catch (e) {
        //console.log(e);
        deployDlg = false;
        showError("Could not upload using SOL, check your SOL balance.");
      }
    } else {
      if (!window.arweaveWallet) {
        errorMessage = "Arweave Wallet not found!";
        errorDlg = true;
        return;
      }
      // connnect
      await arweaveWallet.connect([
        "ACCESS_ADDRESS",
        "SIGN_TRANSACTION",
        "DISPATCH",
      ]);
      const addr = await arweaveWallet.getActiveAddress();

      try {
        deployDlg = true;
        const result = await deployAr(asset);

        deployDlg = false;
        // reset form
        e.target.reset();
        tx = result.id;
        $imgCache = [
          ...$imgCache,
          { id: tx, src: URL.createObjectURL(files[0]) },
        ];

        confirmDlg = true;
      } catch (e) {
        deployDlg = false;
        errorMessage = e.message;
        errorDlg = true;
      }
    }
  }

  $: notValid = !(
    files.length > 0 &&
    ["matic", "sol", "ar", "near"].includes(currency) &&
    title !== ""
  );
</script>

<Navbar />
<main>
  <section class="hero min-h-screen bg-base-100 items-start">
    <div class="flex flex-col items-center justify-start">
      <p>Upload</p>
      <form class="form mt-16 px-4 md:px-0" on:submit|preventDefault={doDeploy}>
        <div class="flex flex-col md:flex-row md:space-x-16 justify-center">
          <div>
            {#if files[0]}
              <img
                class="border-2 border-secondary w-full md:w-[500px] md:h-[350px] object-contain"
                src={URL.createObjectURL(files[0])}
              />
              <div class="mt-2 flex justify-end">
                <button on:click={() => (files = [])} class="link">clear</button
                >
              </div>
            {:else}
              <div class="form-control">
                <label
                  for="file"
                  class="bg-gray-200 h-[200px] md:h-[350px] w-full md:w-[500px] grid place-items-center rounded-xl hover:shadow-xl"
                >
                  <div>
                    <span class="text-gray-400">Select Image</span>
                    <img src="assets/image.svg" alt="image-icon" />
                  </div>
                </label>
                <input
                  id="file"
                  type="file"
                  class="hidden input input-bordered"
                  bind:files
                  accept="image/png, image/jpeg, image/gif, image/jpg, image/webp, image/svg+xml"
                  required
                />
                <p
                  class="py-8 w-full md:w-[500px] bg-whitesmoke-200 text-gray-500 text-sm"
                >
                  When uploading images, it is important to note that you are
                  storing these images on a permanent blockchain and by
                  uploading you are indicating that you have permission to do
                  so. NSFW content is not permitted on this service.
                </p>
              </div>
            {/if}
          </div>
          <div>
            <div class="form-control">
              <label for="title" class="label" required>Title *</label>
              <input
                id="title"
                class="input input-bordered"
                bind:value={title}
                required
              />
            </div>
            <div class="form-control">
              <label for="desc" class="label">Description</label>
              <textarea
                id="desc"
                class="textarea textarea-bordered"
                bind:value={description}
              />
            </div>
            <div class="form-control">
              <label for="topics" class="label">Topics</label>
              <input
                id="topics"
                class="input input-bordered"
                bind:value={topics}
              />
              <label class="label text-sm text-gray-400"
                >Enter a comma-separated list topics (e.g. collection, category,
                etc)</label
              >
            </div>
            <div class="form-control">
              <label for="currency" class="label">Currency *</label>
              <select class="select select-bordered" bind:value={currency}>
                <option value="none">Choose</option>
                <option value="sol">$SOL</option>
                <option value="matic">$MATIC</option>
                <option value="ar">$AR</option>
                <!--
                <option value="near">$near</option>
                -->
              </select>
              <label class="label text-sm text-gray-400"
                >(when using $AR you also mint $BAR)</label
              >
            </div>
            <div class="my-16 space-y-4">
              <button disabled={notValid} class="btn btn-block">Deploy</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>
</main>
<DeployDialog open={deployDlg} />
<ErrorDialog
  open={errorDlg}
  msg={errorMessage}
  on:cancel={() => (errorDlg = false)}
/>
<ConfirmDialog {tx} open={confirmDlg} on:cancel={() => (confirmDlg = false)} />
