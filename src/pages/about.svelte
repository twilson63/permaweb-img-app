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
 
For more information about the tutorial, you can find it here: https://pjgr5rzoytzbk7yizk7755n226aurasg4m7qojmwjhbcujbjhe5a.arweave.net/ek0exy7E8hV_CMq__vW614FIgkbjPwcllknCKiQpOTo
You can also find the completed github repository for this tutorial here: https://github.com/twilson63/permaweb-img-app/tree/atomic-tx
        
        `)}
      </div>
    </div>
  </section>
</main>
