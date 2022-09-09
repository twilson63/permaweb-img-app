<script>
  import { profile } from "../store.js";

  const addr = $profile ? $profile.addr : "";
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
        </ul>
      </div>
    {/if}
  </div>
  <div class="navbar-center">
    <a href="/home" class="btn btn-ghost normal-case text-xl">img</a>
  </div>
  <div class="navbar-end">
    {#if $profile}
      <a href="/home" class="btn btn-ghost">Upload</a>
      <a href="/hx/{addr}" class="btn btn-ghost">My Imgs</a>
      <a href="/about" class="btn btn-ghost">About</a>
    {:else}
      <a href="/" class="btn btn-ghost">Connect</a>
    {/if}
  </div>
</div>
