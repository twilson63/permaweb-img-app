<script>
  import { imagesByOwner } from "../lib/asset.js";
  import { take } from "ramda";

  export let addr;
</script>

<nav
  class="flex space-x-4 h-[75px] bg-secondary text-secondary-content flex items-center"
>
  <a class="btn btn-ghost" href="/">img</a>
  <a class="btn btn-ghost" href="/about">About</a>
</nav>
<main class="px-8 max-w-screen">
  <header class="my-16">
    <h1 class="text-3xl">History</h1>
  </header>
  <section>
    {#await imagesByOwner(addr) then images}
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {#each images as img}
            <tr>
              <th><a class="link" href="/show/{img.id}">{img.id}</a></th>
              <th>{img.title}</th>
              <th
                >{take(70, img.description)}
                {img.description.length > 70 ? "..." : ""}</th
              >
              <th>{new Date(img.timestamp * 1000).toISOString()}</th>
            </tr>
          {/each}
        </tbody>
      </table>
    {/await}
  </section>
</main>
