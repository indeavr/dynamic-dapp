<script lang="ts">
    // How to get this item only ? -> one function getItem (contract, id) == enough
    // get contract & id
    // call function to get full info
    import Propositions from "./nft/Propositions.svelte";
    import { onMount } from "svelte";
    import AddPropositionModal from "./nft/AddPropositionModal.svelte";
    import SwalW from 'sweetalert2';
    import { nftStore, propositionsStore } from "../stores/nfts.store";
    import type { NFT } from "../types";
    import { generateMetadataImage } from "../service/api";
    import { addProposition } from "../service/ceramics";

    const Swal: any = SwalW;

    let setCountdownDate;

    export let params = {};
    const { contract, id } = params;

    let nft: NFT;
    let accountSubstr = "";
    let accountSubstrSeller = "";

    let loading = false;

    onMount(async () => {

    });

    const onNFTsChanged = async (nfts: NFT[]) => {
        if (!nfts || nfts.length === 0) {
            console.log("No NFTS !");
            return;
        }

        console.log("Found nfts", nfts);

        nft = nfts.find((n) => n.id === id && n.contract === contract);

        if (nft) {
            console.log("FOUND NFT", nft)
            const firstSubstr = nft.contract.substr(0, 6);
            const secondSubstr = nft.contract.substr(nft.contract.length - 5, nft.contract.length);
            accountSubstr = firstSubstr + "..." + secondSubstr;
        }
    };
    let simulateChange = false;

    const makeProposition = async (event) => {
        const { file } = event.detail;

        Swal.fire({
            title: 'Generating IPFS URI ... ',
            icon: 'info',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
        })

        const metadataUrl = await generateMetadataImage(file)

        if (!metadataUrl) {
            console.error("no meta returned")
            return;
        }

        const mimeType = file.mimeType;

        await addProposition({
            id: nft.id,
            contract: nft.contract,
            image: {
                mimeType,
                src: metadataUrl
            }
        })

        console.log("SUCCESS");
        Swal.fire({
            icon: 'success',
            title: 'Proposition Added !',
        })


        setTimeout(async () => {
            await propositionsStore.get({ id: nft.id, contract: nft.contract })
            simulateChange = !simulateChange;
        }, 2000);
    }

    $: onNFTsChanged($nftStore);

    const changeExt = (aPath) => {
        if (!aPath) {
            return;
        }
        return aPath[0].substr(0, aPath[0].lastIndexOf(".")) + ".gif";
    };


</script>

<div class="container">
    {#if loading || !nft}
        <h2 style="width: 100%; text-align: center; color: white">Loading ...</h2>
    {:else}
        <div class="row row--grid">
            <!-- title -->
            <div class="col-12">
                <div class="main__title main__title--page">
                    <h1>{nft.name} Id {nft.id}</h1>
                </div>
            </div>
            <!-- end title -->
        </div>

        <div class="row">
            <!-- content -->
            <div class="col-12 col-xl-6">
                <div
                        id="nft-wrapper"
                        class="asset__item"
                >
                    <a class="asset__img" href={nft.imageUri}>
                        <img src={nft.imageUri} alt="">
                    </a>
                </div>
            </div>
            <!-- end content -->

            <!-- header -->
            <div class="col-12 col-xl-6">
                <div class="asset__info">
                    <div class="asset__desc">
                        <h1 style="color: white"> {nft.metadata.name}</h1>
                    </div>
                    <div class="asset__desc">
                        <h2>Description</h2>
                        <p>
                            {nft.metadata.description}
                        </p>
                    </div>

                    <ul class="asset__authors">
                        <li id="seller-li">
                            <span>Owner</span>
                            <div class="asset__author asset__author--verified">
                                <img src="./img/avatars/avatar.jpg" alt=""/>
                                <a
                                        target="_blank"
                                        id="address"
                                        href={`https://mumbai.polygonscan.com/address/${nft.contract}`}
                                >
                                    {accountSubstr}
                                </a>
                            </div>
                        </li>
                        <li>
                            <span>NFT Collection</span>
                            <div class="asset__author ">
                                <img src="./img/tree.jpg" alt=""/>
                                <a>{nft.name}</a>
                            </div>
                        </li>
                    </ul>

                    <!-- tabs -->
                    <ul class="nav nav-tabs asset__tabs" role="tablist">
                        <li class="nav-item">
                            <a
                                    class="nav-link active"
                                    data-toggle="tab"
                                    href="#tab-1"
                                    role="tab"
                                    aria-controls="tab-1"
                                    aria-selected="true">Change Propositions</a
                            >
                        </li>
                    </ul>


                    <Propositions {nft} {simulateChange}/>
                </div>
            </div>
            <!-- end header -->
        </div>
        <AddPropositionModal on:makeProposition={makeProposition}/>

    {/if}

</div>

<style>
    #nft-element {
        max-width: 60%;
        margin: 0 auto;
        display: block;
    }

    #nft-wrapper {
        padding-bottom: 30px;
    }

    #seller-li {
        width: 45%;
    }

    #address {
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 75%;
        font-size: 14px;
    }

    .asset__item {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: relative;
        padding: 20px 20px 70px 20px;
        width: 100%;
        border-radius: 16px;
        margin-top: 20px;
        border: 1px solid #222227;
    }

    .asset__item img {
        width: auto;
        max-width: 100%;
    }

    .asset__info {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        position: relative;
        width: 100%;
        margin-top: 20px;
    }

    .asset__desc {
        display: block;
        width: 100%;
    }

    .asset__desc h2 {
        font-family: "Inter", sans-serif;
        font-size: 18px;
        font-weight: 500;
        color: #fff;
        margin-bottom: 15px;
    }

    .asset__desc p {
        font-size: 16px;
        line-height: 26px;
        color: #bdbdbd;
        margin-bottom: 15px;
        display: block;
        width: 100%;
    }

    .asset__desc p:last-child {
        margin-bottom: 0;
    }

    .asset__authors {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #222227;
    }

    .asset__authors--tab {
        padding-top: 0;
        border-top: none;
    }

    .asset__authors li {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 15px;
    }

    .asset__authors li span {
        font-size: 13px;
        color: #bdbdbd;
        margin-bottom: 12px;
        line-height: 100%;
    }

    .asset__authors li p {
        font-size: 14px;
        line-height: 100%;
        color: #fff;
        font-family: "Inter", sans-serif;
        font-weight: 400;
        margin-bottom: 0;
    }

    .asset__authors li:last-child {
        margin-bottom: 0;
    }

    .asset__author {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        position: relative;
    }

    .asset__author--verified:after {
        content: "";
        position: absolute;
        display: block;
        width: 18px;
        height: 18px;
        border: 2px solid #fff;
        bottom: -2px;
        left: 28px;
        border-radius: 50%;
        background: url("img/verified.svg") no-repeat center #2f80ed;
        background-size: 14px auto;
        z-index: 1;
        pointer-events: none;
    }

    .asset__author img {
        display: block;
        overflow: hidden;
        width: 44px !important;
        height: 44px;
        border-radius: 10px;
        margin-right: 10px;
    }

    .asset__author a {
        font-family: "Inter", sans-serif;
        font-weight: 500;
        color: #bdbdbd;
        font-size: 16px;
    }

    .asset__author a:hover {
        color: #AC1E21;
    }

    .asset__actions--scroll {
        height: 175px;
        overflow: hidden;
        margin-top: 20px;
    }

    .asset__actions--scroll .asset__action:first-child {
        margin-top: 0;
    }

    .asset__action {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        position: relative;
        margin-top: 20px;
    }

    .asset__action:last-child {
        margin-bottom: 3px;
    }

    .asset__action--verified:after {
        content: "";
        position: absolute;
        display: block;
        width: 18px;
        height: 18px;
        border: 2px solid #fff;
        bottom: -2px;
        left: 28px;
        border-radius: 50%;
        background: url("img/verified.svg") no-repeat center #2f80ed;
        background-size: 14px auto;
        z-index: 1;
        pointer-events: none;
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
        font-family: "Inter", sans-serif;
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

    .asset__tabs {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        width: 100%;
        margin-top: 30px;
        border-bottom: 1px solid #222227;
    }

    .asset__tabs li {
        margin-right: 30px;
    }

    .asset__tabs li:last-child {
        margin-right: 0;
    }

    .asset__tabs a {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        height: 36px;
        color: #bdbdbd;
        position: relative;
        font-size: 14px;
        font-family: "Inter", sans-serif;
        white-space: nowrap;
    }

    .asset__tabs a:before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        display: block;
        background-color: #AC1E21;
        transition: 0.5s ease;
        transform: translateY(2px);
        opacity: 0;
        border-radius: 2px 2px 0 0;
    }

    .asset__tabs a:hover {
        color: #fff;
    }

    .asset__tabs a.active {
        color: #fff;
        cursor: default;
    }

    .asset__tabs a.active:before {
        opacity: 1;
        transform: translateY(0);
    }

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
        width: calc(50% - 10px);
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
        font-family: "Inter", sans-serif;
        font-weight: 500;
        padding: 0 20px;
        margin-top: 20px;
        margin-right: 20px;
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

    .asset__btn--full {
        width: 100%;
    }

    .asset__likes {
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        position: absolute;
        bottom: 20px;
        right: 20px;
        height: 28px;
        z-index: 1;
    }

    .asset__likes svg {
        width: 18px;
        height: auto;
        transition: fill 0.5s ease;
        fill: #bdbdbd;
    }

    .asset__likes span {
        font-size: 13px;
        line-height: 18px;
        color: #bdbdbd;
        margin-left: 5px;
        transition: color 0.5s ease;
    }

    .asset__likes span:empty {
        margin-left: 0;
    }

    .asset__likes:hover svg {
        fill: #eb5757;
    }

    .asset__likes--active svg {
        fill: #eb5757;
    }

    .asset__likes--active span {
        color: #fff;
    }

    .asset__likes--active:hover svg {
        fill: #bdbdbd;
    }

    .asset__likes--active:hover span {
        color: #bdbdbd;
    }

    .asset__wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-top: 20px;
        border-top: 1px solid #222227;
        padding-top: 20px;
    }

    .asset__price {
        display: inline-flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: calc(50% - 10px);
        padding-left: 20px;
    }

    .asset__price span:first-child {
        font-size: 14px;
        line-height: 100%;
        color: #bdbdbd;
        line-height: 20px;
    }

    .asset__price span:last-child {
        font-size: 18px;
        line-height: 100%;
        color: #fff;
        margin-top: 10px;
    }

    .asset__timer {
        display: inline-flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 50%;
        position: relative;
        padding-right: 20px;
        border-right: 1px solid #222227;
    }

    .asset__timer span {
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        height: 20px;
        line-height: 100%;
        color: #bdbdbd;
    }

    .asset__timer span svg {
        width: 20px;
        height: auto;
        margin-right: 5px;
        fill: #AC1E21;
    }

    .asset__clock {
        font-size: 18px;
        line-height: 100%;
        color: #fff;
        margin-top: 10px;
    }

    .disabled {
        cursor: not-allowed !important;
    }

    @media (min-width: 576px) {
        .asset__authors {
            flex-direction: row;
        }

        .asset__authors li {
            margin-bottom: 0;
            margin-right: 60px;
        }

        .asset__authors li:last-child {
            margin-right: 0;
        }

        .asset__authors--tab {
            flex-direction: column;
        }

        .asset__authors--tab li {
            margin-right: 0;
            margin-bottom: 15px;
        }

        .asset__authors--tab li:last-child {
            margin-bottom: 0;
        }
    }

    @media (min-width: 768px) {
        .asset__item {
            margin-top: 30px;
            height: auto;
            min-height: calc(100% - 30px);
        }

        .asset__info {
            margin-top: 30px;
        }
    }
</style>
