<script>
  import { createEventDispatcher } from "svelte";
  import { profile } from "../store.js";
  import { take } from "ramda";

  const dispatch = createEventDispatcher();

  $: addr = $profile ? $profile.addr : "";

  function handleConnect() {
    dispatch("connect");
  }

  async function handleDisconnect() {
    await window.arweaveWallet.disconnect();
    $profile = null;
  }
</script>

<div class="navbar bg-base-100">
  <div class="navbar-start">
    {#if $profile}
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            /></svg
          >
        </label>
        <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li><a href="/home">Upload</a></li>
          <li><a href="/hx/{addr}">My Imgs</a></li>
          <li><a href="/about">About</a></li>
          <li>
            <button class="btn btn-ghost" on:click={handleDisconnect}
              >{take(5, $profile.addr)}...</button
            >
          </li>
        </ul>
        <a href="/home" class="btn btn-ghost normal-case text-xl md:hidden"
          >img</a
        >
      </div>
    {/if}
  </div>
  <div class="hidden navbar-center md:flex">
    <a href="/home" class="btn btn-ghost normal-case text-xl">img</a>
  </div>
  <div class="hidden navbar-end md:flex">
    {#if $profile}
      <a href="/home" class="btn btn-ghost">Upload</a>
      <a href="/hx/{addr}" class="btn btn-ghost">My Imgs</a>
      <a href="/about" class="btn btn-ghost">About</a>

      <button class="btn btn-ghost" on:click={handleDisconnect}
        >{take(5, $profile.addr)}...</button
      >
    {:else}
      <button on:click={handleConnect} class="btn btn-ghost">Connect</button>
    {/if}
  </div>
</div>
