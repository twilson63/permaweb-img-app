<script>
  import { deploy } from "../lib/deploy-path.js";
  let files = [];
  let title = "";
  let description = "";

  const toArrayBuffer = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.readAsArrayBuffer(file);
      fr.addEventListener("loadend", (evt) => {
        resolve(evt.target.result);
      });
    });

  async function doDeploy() {
    // connnect
    await arweaveWallet.connect([
      "ACCESS_ADDRESS",
      "SIGN_TRANSACTION",
      "DISPATCH",
    ]);
    const addr = await arweaveWallet.getActiveAddress();
    const data = await toArrayBuffer(files[0]);
    const result = await deploy(title, description, addr, "image/png", data);

    console.log(result);
  }
</script>

<nav
  class="flex space-x-4 h-[75px] bg-secondary text-secondary-content flex items-center"
>
  <a class="btn btn-ghost" href="/">img</a>
  <a class="btn btn-ghost" href="/about">About</a>
</nav>
<main>
  <section class="hero min-h-screen bg-base-100">
    <div class="hero-content flex-col">
      <h1 class="text-8xl font-bold">img</h1>
      <p>Upload</p>
      <form class="form" on:submit|preventDefault={doDeploy}>
        {#if files[0]}
          <img
            class="border-2 border-secondary"
            src={URL.createObjectURL(files[0])}
            alt="img"
          />
        {:else}
          <div class="form-control">
            <label for="file" class="label">Choose Image</label>
            <input id="file" type="file" bind:files />
          </div>
        {/if}
        <div class="form-control">
          <label for="title" class="label">Title</label>
          <input id="title" class="input input-bordered" bind:value={title} />
        </div>
        <div class="form-control">
          <label for="desc" class="label">Description</label>
          <input
            id="desc"
            class="input input-bordered"
            bind:value={description}
          />
        </div>
        <div class="mt-16">
          <button class="btn btn-block">Deploy</button>
        </div>
      </form>
    </div>
  </section>
</main>
