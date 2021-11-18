<script lang="ts">
    import MyItem from "./myNFTs/MyItem.svelte";
    import { myInfoStore, collectionsStore } from "../stores/nfts.store";
    import type { MyNFT } from "../types";

    let pendingWithdraws = 1;
    let loading = true;

    const onColletionsChanged = async (colls) => {
        if (!colls || colls.length === 0) {
            console.log("Not Connected !");
            pendingWithdraws = 0;
            return;
        }

        console.log("<< @Connected@ >>");

        loading = true;
        await myInfoStore.getMyNFTs();
        loading = false;
    };

    const onMyInfoChanged = async (myNfts: MyNFT[]) => {
        console.log("<<< My Info changed >>>", myNfts)
        if (!myNfts || myNfts.length === 0) {
            console.log("NOTHING")
        }
    }


    $: onColletionsChanged($collectionsStore);
    $: onMyInfoChanged($myInfoStore);

</script>

<div class="container" style="padding-top: 10px">
    <h1 style="color:white; width: 100%; text-align: center">My NFTs</h1>
    {#if loading}
        <h2 style="width: 100%; text-align: center; color: white">Loading ...</h2>
    {:else if !$myInfoStore || $myInfoStore.length === 0}
        <div style="color: white; padding-top: 30px; text-align: center; width: 100%;">
            <h2> No NFTs ! </h2>
            <a href="/#/mint" class="hero__btn hero__btn--clr">Mint</a>
        </div>
    {:else}
        {#each $myInfoStore as item, i}
            <div style="margin-top: 60px">
                <MyItem nft={item} index={i}/>
            </div>
        {/each}
    {/if}
</div>


<style>
    .card__info {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: flex-end;
        width: 100%;
        border-top: 1px solid #222227;
        padding-top: 15px;
        margin-top: 15px;
    }


    .asset__action {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        /*width: 100%;*/
        position: relative;
        margin-top: 20px;
    }

    .asset__action img {
        display: block;
        overflow: hidden;
        width: 44px !important;
        height: 44px;
        border-radius: 10px;
        margin-right: 10px;
    }

    .asset__action p {
        font-size: 14px;
        line-height: 22px;
        color: #bdbdbd;
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        margin-bottom: 0;
    }

    .asset__action p a {
        color: #fff;
        font-weight: 500;
    }

    .asset__action p a:hover {
        color: #AC1E21;
    }

    .asset__action p b {
        font-weight: 500;
        color: #fff;
    }

    /*BUTTON*/
    .asset__btns {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        width: 100%;
        margin-top: 20px;
        border-top: 1px solid #222227;
    }

    .asset__btn {
        width: calc(30% - 10px);
        height: 50px;
        border-radius: 12px;
        background-color: #222227;
        display: inline-flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 14px;
        position: relative;
        z-index: 2;
        text-transform: uppercase;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        padding: 0 20px;
        margin-top: 20px;
        margin-right: 20px;
    }

    @media (max-width: 768px) {
        .asset__btn {
            width: calc(40% - 10px);
        }
    }

    @media (max-width: 500px) {
        .asset__btn {
            width: calc(70% - 10px);
        }
    }

    .asset__btn svg {
        fill: #fff;
        width: 28px;
        height: auto;
        margin-right: 7px;
    }

    .asset__btn:last-child {
        margin-right: 0;
    }

    .asset__btn:hover {
        color: #AC1E21;
    }

    .asset__btn--clr {
        background-color: #AC1E21;
        color: #fff;
    }

    .asset__btn--clr:hover {
        background-color: #222227;
        color: #AC1E21;
    }

    .hero__btn {
        width: auto;
        min-width: 140px;
        height: 50px;
        border-radius: 12px;
        background-color: #222227;
        display: inline-flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 14px;
        position: relative;
        z-index: 2;
        text-transform: uppercase;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        padding: 0 20px;
        margin-top: 20px;
        margin-right: 20px;
    }

    .hero__btn svg {
        fill: #fff;
        width: 28px;
        height: auto;
        margin-right: 7px;
    }

    .hero__btn:last-child {
        margin-right: 0;
    }

    .hero__btn:hover {
        color: #AC1E21;
    }

    .hero__btn--clr {
        background-color: #AC1E21;
        color: #fff;
    }

    .hero__btn--clr:hover {
        background-color: #222227;
        color: #AC1E21;
    }
</style>
