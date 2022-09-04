<script>
  import { marked } from "marked";
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
      <div class="prose prose-xl">
        {@html marked.parse(`
# img

\`img\` is a demo application that has been created to showcase Atomic Assets. An Atomic Asset is
a Tradeable PST, that can be STAMPed. The \`STAMP\` process gives viewers the ability to create a proof of 
attention. And by making the data tradeable, it allows the community to share in the rewards.
 
        
        `)}
      </div>
    </div>
  </section>
</main>
