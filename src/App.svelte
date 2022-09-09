<script>
  import { Route, router } from "tinro";
  import Announcer from "./components/announcer.svelte";
  import Transition from "./components/transition.svelte";

  import Start from "./pages/start.svelte";
  import Home from "./pages/home.svelte";
  import About from "./pages/about.svelte";
  import Show from "./pages/show.svelte";
  import History from "./pages/history.svelte";

  import { profile } from "./store.js";

  router.mode.hash();
  router.subscribe((_) => window.scrollTo(0, 0));
</script>

<Announcer />
<Transition>
  <Route path="/">
    <Start />
  </Route>
  <Route path="/home">
    {#if $profile}
      <Home />
    {:else}
      <Start />
    {/if}
  </Route>
  <Route path="/about">
    <About />
  </Route>
  <Route path="/show/:id" let:meta>
    <Show id={meta.params.id} />
  </Route>
  <Route path="/hx/:addr" let:meta>
    <History addr={meta.params.addr} />
  </Route>
</Transition>
