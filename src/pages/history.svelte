<script>
  import Navbar from "../components/navbar.svelte";
  import {
    imagesByOwner,
    transfer,
    excludeTransferred,
    includeTransferred,
    assetDetails,
  } from "../lib/asset.js";
  import { getCount } from "../lib/stamp.js";
  import Transfer from "../dialogs/transfer.svelte";
  import ConnectModal from "../dialogs/connect.svelte";
  import WalletHelp from "../dialogs/wallet-help.svelte";
  import Transfering from "../dialogs/transfering.svelte";
  import ErrorDialog from "../dialogs/error.svelte";
  import { profile } from "../store.js";
  import { reject, concat, sortWith, descend, prop, takeLast } from "ramda";

  import formatDistance from "date-fns/formatDistance";

  export let addr;

  let items = {};
  let showTransfer = false;
  let transferData = { id: "0", title: "unknown" };

  let showConnect = false;
  let showHelp = false;
  let canTransfer = false;
  let showTransfering = false;
  let showError = false;
  let errorMessage = "An Error Occuried!";

  function handleCopy(id) {
    items[id] = false;
    return () => {
      setTimeout(() => (items[id] = false), 2000);
      navigator.clipboard.writeText(id);
      items[id] = true;
    };
  }

  function tweetLink(title, id) {
    return `https://twitter.com/intent/tweet?text=${encodeURI(
      "🪧 STAMP\n\n" + title.replace("#", "no ") + "\n\n🐘"
    )}&url=https://img.arweave.dev/%23/show/${id}`;
  }

  function connected() {
    canTransfer = true;
  }

  async function handleTransfer(e) {
    if (!$profile.addr) {
      showConnect = true;
      return;
    }

    showTransfer = false;
    showTransfering = true;
    transferData = e.detail;
    try {
      const result = await transfer({
        asset: transferData.id,
        title: transferData.title,
        caller: $profile.addr,
        addr: transferData.addr,
        percent: transferData.percent,
      });

      if (result.ok) {
        showTransfering = false;
        transferData = { id: "0", title: "unknown" };
        images = getImages(addr);
      } else {
        showTransfering = false;
        transferData = { id: "0", title: "unknown" };
        errorMessage = result.message;
        showError = true;
      }
    } catch (e) {
      showTransfering = false;
      errorMessage = e.message;
      showError = true;
    }
  }

  async function getImages(addr) {
    // const transferredImages = await excludeTransferred(addr);
    // return (
    //   Promise.all([imagesByOwner(addr), includeTransferred(addr)])
    //     .then((results) => concat(results[0], results[1]))
    //     .then(reject((a) => transferredImages[a.id] === 100))
    //     // sort!
    //     .then(sortWith([descend(prop("timestamp"))]))
    // );
    return await imagesByOwner(addr);
  }

  let images = getImages(addr);
</script>

<Navbar on:connect={() => (showConnect = true)} />
<main class="px-8 max-w-screen">
  <header class="my-16">
    <h1 class="text-3xl">History</h1>
  </header>
  <section class="flex flex-col items-center max-w-screen">
    {#await images then images}
      {#each images as img}
        <div
          class="md:hidden flex flex-col space-y-4 p-4 mb-4 shadow-xl w-full"
        >
          <div class="flex space-x-2">
            <!--
            <div class="w-[75px] flex justify-center">
              <img
                class="h-[48px] py-2"
                src="https://arweave.net/{img.id}"
                alt={img.title}
              />
            </div>
            -->
            <div class="flex flex-col w-[250px]">
              <h3 class="text-[14px] font-bold">{img.title}</h3>
              <p class="text-[10px] font-light">
                Last update:
                {formatDistance(new Date(img.timestamp * 1000), new Date(), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex justify-between font-bold text-[14px]">
              Transaction ID

              <img
                on:click={handleCopy(img.id)}
                class="ml-2 h-[14px] w-[14px]"
                src="assets/copy.svg"
                alt="copy"
              />
              {#if items[img.id]}
                <span class="text-primary text-[10px]">copied!</span>
              {/if}
            </div>
            <p class="text-[10px] font-light flex space-x-2 items-center">
              {img.id}
            </p>
          </div>
          <div class="flex space-x-8 justify-center">
            <div>
              <h3 class="text-[12px] font-bold">Share</h3>
              <p class="text-[12px] font-light flex justify-center">
                <a target="_blank" href={tweetLink(img.title, img.id)}>
                  <img
                    class="h-[16px] w-[16px] dark:invert"
                    src="assets/share.svg"
                    alt="share"
                  />
                </a>
              </p>
            </div>
            <div>
              <h3 class="text-[12px] font-bold">View</h3>
              <p class="text-[12px] font-light flex justify-center">
                <a href="/show/{img.id}">
                  <img
                    class="h-[16px] w-[16px] dark:invert"
                    src="assets/view.svg"
                    alt="view"
                  />
                </a>
              </p>
            </div>
            <div>
              <h3 class="text-[12px] font-bold">Transfer</h3>
              <p class="text-[12px] font-light flex justify-center">
                <img
                  on:click={() => {
                    transferData = { id: img.id, title: img.title };
                    showTransfer = true;
                  }}
                  class="h-[16px] w-[16px] dark:invert"
                  src="assets/transfer.svg"
                  alt="transfer"
                />
              </p>
            </div>
          </div>
        </div>
      {/each}
      <table class="hidden md:block table table-zebra">
        <thead>
          <tr>
            <th class="text-center">Preview</th>
            <th>Title</th>
            <th>Stamps</th>
            <th>Transaction ID</th>
            <th>Ownership</th>
            <th>Creator</th>
            <th>Share</th>
            <th>View</th>
            <th>Transfer</th>
          </tr>
        </thead>
        <tbody>
          {#each images as img}
            <tr>
              <td>
                <div class="w-[75px] flex justify-center">
                  <img
                    class="h-[75px] w-[75]"
                    src="https://arweave.net/{img.id}"
                    onerror="this.src = 'assets/img.png'"
                  />
                </div>
              </td>
              <td>
                <div class="flex flex-col">
                  <h3 class="text-[18px] font-bold">{img.title}</h3>
                  <p class="text-[18px] font-light">
                    Last update:
                    {formatDistance(
                      new Date(img.timestamp * 1000),
                      new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                </div>
              </td>
              <td>
                <h3 class="text-[18px] font-bold">&nbsp;</h3>
                <p class="text-[18px] font-light flex space-x-2">
                  {#await getCount(img.id) then count}
                    <div>{count}</div>
                  {/await}
                  <img
                    class="ml-2 h-[24px] w-[24px]"
                    src="assets/stamp2.svg"
                    alt="stamp logo"
                  />
                </p>
              </td>
              <td>
                <h3 class="text-[18px] font-bold">&nbsp;</h3>
                <p class="text-[18px] font-light flex space-x-2 items-center">
                  ...{takeLast(5, img.id)}
                  <img
                    on:click={handleCopy(img.id)}
                    class="ml-2 h-[17px] w-[17px]"
                    src="assets/copy.svg"
                    alt="copy"
                  />
                  {#if items[img.id]}
                    <span class="text-primary">copied!</span>
                  {/if}
                </p>
              </td>
              {#await assetDetails(img.id, addr)}
                <td>
                  <h3 class="text-[18px] font-bold">&nbsp;</h3>
                  <p class="text-[18px] font-light">100%</p>
                </td>
                <td>
                  <h3 class="text-[18px] font-bold">&nbsp;</h3>
                  <p class="text-[18px] font-light">...</p>
                </td>
              {:then details}
                <td>
                  <h3 class="text-[18px] font-bold">&nbsp;</h3>
                  <p class="text-[18px] font-light">{details.percent} %</p>
                </td>
                <td>
                  <h3 class="text-[18px] font-bold">&nbsp;</h3>
                  <p class="text-[18px] font-light">
                    {details.handle}
                  </p>
                </td>
              {:catch error}
                <td>
                  <h3 class="text-[18px] font-bold">&nbsp;</h3>
                  <p class="text-[18px] font-light">0 %</p>
                </td>
                <td>
                  <h3 class="text-[18px] font-bold">&nbsp;</h3>
                  <p class="text-[18px] font-light">@unknown</p>
                </td>
              {/await}
              <td>
                <h3 class="text-[18px] font-bold">&nbsp;</h3>
                <p class="text-[18px] font-light flex justify-center">
                  <a target="_blank" href={tweetLink(img.title, img.id)}>
                    <img
                      class="h-[24px] w-[24px] dark:invert"
                      src="assets/share.svg"
                      alt="share"
                    />
                  </a>
                </p>
              </td>
              <td>
                <h3 class="text-[18px] font-bold">&nbsp;</h3>
                <p class="text-[18px] font-light flex justify-center">
                  <a href="/show/{img.id}">
                    <img
                      class="h-[24px] w-[24px] dark:invert"
                      src="assets/view.svg"
                      alt="view"
                    />
                  </a>
                </p>
              </td>
              <td>
                <h3 class="text-[18px] font-bold">&nbsp;</h3>
                <p class="text-[18px] font-light flex justify-center">
                  <img
                    on:click={() => {
                      transferData = { id: img.id, title: img.title };
                      showTransfer = true;
                    }}
                    class="h-[24px] w-[24px] dark:invert"
                    src="assets/transfer.svg"
                    alt="transfer"
                  />
                </p>
              </td>
            </tr>
            <!--
        <div class="flex space-x-4 items-center my-8">
          <div class="w-[140px] flex justify-center">
            <img
              class="h-[75px]"
              src="https://arweave.net/{img.id}"
              alt={img.title}
            />
          </div>
          <div class="flex flex-col w-[300px]">
            <h3 class="text-[18px] font-bold">{img.title}</h3>
            <p class="text-[18px] font-light">
              Last update:
              {formatDistance(new Date(img.timestamp * 1000), new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>
          <div class="flex flex-col">
            <h3 class="text-[18px] font-bold">Stamps</h3>
            <p class="text-[18px] font-light flex space-x-2">
              {#await getCount(img.id) then count}
                <div>{count}</div>
              {/await}
              <img
                class="ml-2 h-[24px] w-[24px]"
                src="assets/stamp2.svg"
                alt="stamp logo"
              />
            </p>
          </div>
          <div class="flex flex-col w-[600px]">
            <h3 class="text-[18px] font-bold">Transaction ID</h3>
            <p class="text-[18px] font-light flex space-x-2 items-center">
              {img.id}
              <img
                on:click={handleCopy(img.id)}
                class="ml-2 h-[17px] w-[17px]"
                src="assets/copy.svg"
                alt="copy"
              />
              {#if items[img.id]}
                <span class="text-primary">copied!</span>
              {/if}
            </p>
          </div>
          <div class="flex flex-col">
            <h3 class="text-[18px] font-bold">Share</h3>
            <p class="text-[18px] font-light flex justify-center">
              <a target="_blank" href={tweetLink(img.title, img.id)}>
                <img
                  class="h-[24px] w-[24px] dark:invert"
                  src="assets/share.svg"
                  alt="share"
                />
              </a>
            </p>
          </div>
          <div class="flex flex-col">
            <h3 class="text-[18px] font-bold">View</h3>
            <p class="text-[18px] font-light flex justify-center">
              <a href="/show/{img.id}">
                <img
                  class="h-[24px] w-[24px] dark:invert"
                  src="assets/view.svg"
                  alt="view"
                />
              </a>
            </p>
          </div>
          <div class="flex flex-col">
            <h3 class="text-[18px] font-bold">Transfer</h3>
            <p class="text-[18px] font-light flex justify-center">
              <img
                on:click={() => {
                  transferData = { id: img.id, title: img.title };
                  showTransfer = true;
                }}
                class="h-[24px] w-[24px] dark:invert"
                src="assets/transfer.svg"
                alt="transfer"
              />
            </p>
          </div>
        </div>
        -->
          {/each}
        </tbody>
      </table>
    {/await}
  </section>
</main>
<Transfer
  bind:open={showTransfer}
  {...transferData}
  on:transfer={handleTransfer}
/>
<ConnectModal
  bind:open={showConnect}
  on:connected={connected}
  on:help={() => (showHelp = true)}
/>
<WalletHelp bind:open={showHelp} />
<Transfering
  bind:open={showTransfering}
  addr={transferData.addr}
  percent={transferData.percent}
  title={transferData.title}
/>
<ErrorDialog bind:open={showError} msg={errorMessage} />
