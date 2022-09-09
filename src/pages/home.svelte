<script>
  import { imgCache } from "../store.js";
  import { deploy } from "../lib/deploy-path.js";
  import DeployDialog from "../dialogs/deploy.svelte";
  import ErrorDialog from "../dialogs/error.svelte";
  import ConfirmDialog from "../dialogs/confirm.svelte";
  import Navbar from "../components/navbar.svelte";

  let files = [];
  let title = "";
  let description = "";
  let topics = "";
  let deployDlg = false;
  let errorMessage = "";
  let errorDlg = false;
  let confirmDlg = false;
  let tx = "";

  const toArrayBuffer = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.readAsArrayBuffer(file);
      fr.addEventListener("loadend", (evt) => {
        resolve(evt.target.result);
      });
    });

  async function doDeploy(e) {
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
      const data = await toArrayBuffer(files[0]);
      const result = await deploy(
        title,
        description,
        addr,
        files[0].type,
        data
      );

      deployDlg = false;

      // reset form
      e.target.reset();
      // files = [];
      // title = "";
      // description = "";

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
</script>

<Navbar />
<main>
  <section class="hero min-h-screen bg-base-100">
    <div class="hero-content flex-col">
      <h1 class="text-8xl font-bold">img</h1>
      <p>Upload</p>
      <form class="form" on:submit|preventDefault={doDeploy}>
        {#if files[0]}
          <img
            class="border-2 border-secondary w-[500px]"
            src={URL.createObjectURL(files[0])}
            alt="img"
          />
          <div class="mt-2 flex justify-end">
            <button on:click={() => (files = [])} class="link">clear</button>
          </div>
        {:else}
          <div class="form-control">
            <label for="file" class="label">Choose Image</label>
            <input
              id="file"
              type="file"
              class="input input-bordered"
              bind:files
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
              required
            />
          </div>
        {/if}
        <div class="form-control">
          <label for="title" class="label" required>Title</label>
          <input
            id="title"
            class="input input-bordered"
            bind:value={title}
            required
          />
        </div>
        <div class="form-control">
          <label for="desc" class="label">Description</label>
          <input
            id="desc"
            class="input input-bordered"
            bind:value={description}
          />
        </div>
        <!--
        <div class="form-control">
          <label for="topics" class="label">Topics</label>
          <input id="topics" class="input input-bordered" bind:value={topics} />
          <label class="label"
            >Enter a comma-separated set of topics to describe this image</label
          >
        </div>
        -->
        <div class="mt-16">
          <button class="btn btn-block">Deploy</button>
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
