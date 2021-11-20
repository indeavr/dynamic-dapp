<script lang="ts">
    import Filters from "./marketplace/Filters.svelte";
    import Paginator from "./marketplace/Paginator.svelte";
    import Item from "./marketplace/Item.svelte";
    import { nftStore, BATCH_SIZE, totalNFTsCount, collectionsStore } from "../stores/nfts.store";
    import { connectionProvider } from "../stores/connection.store";
    import { onDestroy } from "svelte";
    import { get } from "svelte/store";
    import HotCollections from "./marketplace/HotCollections.svelte";
    import type { MyNFT, NFT } from "../types";

    let connected = false;

    const perPage = BATCH_SIZE;
    let highToLow = true;

    let currentPage = 1;
    let categories = [];

    let nftList: MyNFT[] = [undefined, undefined, undefined, undefined];
    let newItemsAdded = 0;
    let initialPage = 1;

    // const reRender = () => {
    //     const start = perPage * (currentPage - 1);
    //
    //     nftList
    //         .filter((nft) => {
    //             if (!currentType) {
    //                 return true;
    //             }
    //             return nft.type === currentType;
    //         })
    //         .slice(start, perPage)
    //         .forEach((nft, i) => {
    //             $offerStore[i] = nft;
    //         })
    // }

    const changeSorting = async () => {

    }

    const changeCategory = async () => {

    }

    const changePage = async () => {

    }

    const onCollectionsChanged = async (collections: any) => {
        if (!collections || collections.length === 0) {
            connected = false;
            console.log("No Collections !");
            return;
        }
        connected = true;
    }


    const onNFTsChanged = async (nfts: NFT[]) => {
        console.log("<<< NFTS changed Explore >>>", nfts)
        if (!nfts || nfts.length === 0) {
            nftList = [undefined, undefined, undefined, undefined];
            return;
        }

        nftList = nfts;

        const rpc = get(connectionProvider);
        if (!rpc) {
            console.log("Not Connected !");
            return;
        }
    };

    $: onCollectionsChanged($collectionsStore);
    $: onNFTsChanged($nftStore);

    onDestroy(() => {
    })

    console.log("NFT LIST", nftList, nftList.length);
</script>


<HotCollections/>

<div class="container">
    <div class="col-12">
        <div class="main__title" style="margin-top: 30px">
            <h2>Explore</h2>
        </div>
    </div>

    <Filters
            on:categoriesSelected={changeCategory}
            on:sortingChanged={changeSorting}
    />
    <div class="items-container row row--grid" style="display: flex;">
        {#if nftList && nftList.length > 0}
            {#each nftList as nft, i}
                <Item index={i}
                      nft={nft}
                />
            {/each}
        {:else}
            <h2 style="color: white; width: 100%; text-align: center;"> Nothing Found </h2>
        {/if}
    </div>
    <Paginator totalPages={Math.ceil($totalNFTsCount / perPage)}
               activePage={initialPage}
               on:pageChanged={changePage}/>
</div>


<style>

</style>
