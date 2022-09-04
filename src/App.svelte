<script>
  import { Route, router } from "tinro";
  import Announcer from "./components/announcer.svelte";
  import Transition from "./components/transition.svelte";

  import Home from "./pages/home.svelte";
  import About from "./pages/about.svelte";
  import Show from "./pages/show.svelte";

  router.mode.hash();
  router.subscribe((_) => window.scrollTo(0, 0));
</script>

<Announcer />
<Transition>
  <Route path="/">
    <Home />
  </Route>
  <Route path="/about">
    <About />
  </Route>
  <Route path="/show/:id" let:meta>
    <Show id={meta.params.id} />
  </Route>
</Transition>
