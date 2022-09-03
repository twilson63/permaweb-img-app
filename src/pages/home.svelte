<script>
  import { deploy } from "../lib/deploy.js";
  let files = [];

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
    await arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"]);
    const addr = await arweaveWallet.getActiveAddress();
    const data = await toArrayBuffer(files[0]);
    const result = await deploy("TEST", addr, "image/png", data);

    console.log(result);
  }
</script>

<nav
  class="flex space-x-4 h-[75px] bg-secondary text-secondary-content flex items-center"
>
  <a class="btn btn-ghost" href="/">Home</a>
  <a class="btn btn-ghost" href="/about">About</a>
</nav>
<main>
  <section class="hero min-h-screen bg-base-100">
    <div class="hero-content flex-col">
      <h1 class="text-8xl font-bold">img</h1>
      <p>Upload</p>
      <form class="form" on:submit|preventDefault={doDeploy}>
        <div class="form-control mb-16">
          <label for="file" class="label">Choose Image</label>
          <input id="file" type="file" bind:files />
        </div>
        <div class="">
          <button class="btn btn-block">Deploy</button>
        </div>
      </form>
    </div>
  </section>
</main>
