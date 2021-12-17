<script lang="ts">
  import Header from "./header/Header.svelte";
  import Footer from "./footer/Footer.svelte";
  import Router from 'svelte-spa-router'
  import { routes } from "./routes.ts";
  import { collectionsStore, nftStore } from "./stores/nfts.store";
  import { ceramicProvider } from "./stores/connection.store";

  const onConnectionChanged = async (ceramic: any) => {
    if (!ceramic) {
      console.log("Not Connected to Ceramic !");
      return;
    }

    await collectionsStore.getAll()
  }

  const onCollectionsChanged = async (collections: any) => {
    if (!collections || collections.length === 0) {
      console.log("No Collections !");
      return;
    }

    await nftStore.getAll()
  }

  $: onConnectionChanged($ceramicProvider);
  $: onCollectionsChanged($collectionsStore);


</script>

<Header/>
<main id="main">
  <Router {routes}/>
</main>
<Footer/>


<style>
  #main {
    padding: 0 0 60px;
    margin-top: 70px;
    min-height: calc(100vh - 100px);
  }
</style>
