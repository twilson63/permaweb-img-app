<script>
  import { getAssetData } from "../lib/asset.js";

  export let id;
</script>

<nav
  class="flex space-x-4 h-[75px] bg-secondary text-secondary-content flex items-center"
>
  <a class="btn btn-ghost" href="/">img</a>
  <a class="btn btn-ghost" href="/about">About</a>
</nav>
<main>
  <section class="hero min-h-screen bg-base-100">
    <div class="hero-content space-x-4">
      <div class="w-1/2 grid place-items-center">
        <img class="w-full h-full" src="https://arweave.net/{id}" alt="Title" />
      </div>
      <div class="w-1/2 ml-8">
        {#await getAssetData(id) then asset}
          <h1 class="text-5xl mb-8">{asset.title}</h1>
          <p class="text-xl">{asset.description}</p>
          <div class="mt-8 space-y-4">
            <div class="mb-4">Count: 2</div>
            <button class="btn btn-block btn-outline rounded-none">STAMP</button
            >
            <button class="btn btn-block btn-outline btn-error rounded-none"
              >SELL</button
            >
            <button class="btn btn-block btn-outline btn-success rounded-none"
              >BUY</button
            >
            <a
              href="/"
              class="btn btn-block btn-outline btn-primary rounded-none"
              >Back to Upload</a
            >
          </div>
        {/await}
      </div>
    </div>
  </section>
</main>
