<script lang="ts">
    import { onMount } from "svelte";
    import ItemPlaceholder from "../../lib/ItemPlaceholder.svelte";
    import type { NFT } from "../../types";

    export let nft: NFT;
    export let index: number;

    console.log("Got Item", nft);
    let setCountdownDate;
    let timeLeft = 5;


    onMount(async () => {

    });

    const handleItemClick = () => {

    };

    const nftChanged = () => {
        if (nft && setCountdownDate) {
        }
    }

    $: nft, nftChanged();
</script>

<div class="col-12 col-sm-6 col-lg-4 col-xl-3">

    <!-- card -->
    <div class="card">
        {#if !nft}
            <ItemPlaceholder/>
        {:else}
            <a href={"/#/nft/" + nft.contract + "/" + nft.id} class="card__cover">

                <!-- <video id="this-nft-element" autoplay muted loop src={nft.artPath}/> -->
                <img id="this-nft-element" src={nft.imageUri}/>
                <span class="card__time card__time--clock">
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path
                                                        d="M8.46777,8.39453l-.00225.00183-.00214.00208ZM18.42188,8.208a1.237,1.237,0,0,0-.23-.17481.99959.99959,0,0,0-1.39941.41114,5.78155,5.78155,0,0,1-1.398,1.77734,8.6636,8.6636,0,0,0,.1333-1.50977,8.71407,8.71407,0,0,0-4.40039-7.582,1.00009,1.00009,0,0,0-1.49121.80567A7.017,7.017,0,0,1,7.165,6.87793l-.23047.1875a8.51269,8.51269,0,0,0-1.9873,1.8623A8.98348,8.98348,0,0,0,8.60254,22.83594.99942.99942,0,0,0,9.98,21.91016a1.04987,1.04987,0,0,0-.0498-.3125,6.977,6.977,0,0,1-.18995-2.58106,9.004,9.004,0,0,0,4.3125,4.0166.997.997,0,0,0,.71534.03809A8.99474,8.99474,0,0,0,18.42188,8.208ZM14.51709,21.03906a6.964,6.964,0,0,1-3.57666-4.40234,8.90781,8.90781,0,0,1-.17969-.96387,1.00025,1.00025,0,0,0-.79931-.84473A.982.982,0,0,0,9.77,14.80957a.99955.99955,0,0,0-.8667.501,8.9586,8.9586,0,0,0-1.20557,4.71777,6.98547,6.98547,0,0,1-1.17529-9.86816,6.55463,6.55463,0,0,1,1.562-1.458.74507.74507,0,0,0,.07422-.05469s.29669-.24548.30683-.2511a8.96766,8.96766,0,0,0,2.89874-4.63269,6.73625,6.73625,0,0,1,1.38623,8.08789,1.00024,1.00024,0,0,0,1.18359,1.418,7.85568,7.85568,0,0,0,3.86231-2.6875,7.00072,7.00072,0,0,1-3.2793,10.457Z"/></svg>
											</span>
            </a>

            <h3 class="card__title"><a href={"#/nft/" + nft.contract + "/" + nft.id}>{nft.metadata.name}</a></h3>
            <div class="card__author">
                <img src="img/avatars/avatar.jpg" alt="">
                <a target="_blank"
                   id="address"
                   href={`https://mumbai.polygonscan.com/address/${nft.contract}`}>
                    {nft.contract.substr(0, 6) + "..." + nft.contract.substr(nft.contract.length - 5, nft.contract.length)}
                </a>
            </div>
            <div class="card__info">
                <span>Collection: {nft.name}</span>
            </div>
            <div class="card__info">
                <span>ID: {nft.id}</span>
            </div>
        {/if}
    </div>
    <!-- end card -->
</div>


<style>
    #this-nft-element {
        max-width: 100%;
    }

    #address {
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 80%;
        font-size: 14px;
    }

    .card {
        margin-top: 20px;
        border-radius: 16px;
        width: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 20px;
        border: 1px solid #222227;
        background-color: #16151a;
    }

    .card__cover {
        width: 100%;
        border-radius: 16px;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-bottom: 12px;
    }

    .card__cover img {
        width: 100%;
    }

    .card__cover--carousel {
        display: block;
    }

    .card__cover--carousel img {
        border-radius: 16px;
    }

    .card__cover--carousel .owl-dots {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        left: 0;
        bottom: 20px;
        position: absolute;
        padding: 0 20px;
    }

    .card__cover--carousel .owl-dot {
        margin-right: 10px;
    }

    .card__cover--carousel .owl-dot:last-child {
        margin-right: 0;
    }

    .card__cover--carousel .owl-dot span {
        display: block;
        height: 4px;
        width: 10px;
        border-radius: 2px;
        background-color: #fff;
        transition: background-color 0.5s ease;
    }

    .card__cover--carousel .owl-dot.active span {
        background-color: #AC1E21;
    }

    .card__cover--video svg {
        position: absolute;
        top: 20px;
        right: 20px;
        pointer-events: none;
        fill: #bdbdbd;
        width: 20px;
        height: auto;
        pointer-events: none;
    }

    .card__title {
        display: block;
        width: 100%;
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-wrap: break-word;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        font-size: 18px;
        margin-bottom: 15px;
        transition: color 0.5s ease;
    }

    .card__title a {
        color: #fff;
    }

    .card__title a:hover {
        color: #AC1E21;
    }

    .card__title:hover {
        color: #AC1E21;
    }

    .card__author {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        position: relative;
    }

    .card__author--verified:after {
        content: '';
        position: absolute;
        display: block;
        width: 18px;
        height: 18px;
        border: 2px solid #fff;
        bottom: -2px;
        left: 24px;
        border-radius: 50%;
        background: url("img/verified.svg") no-repeat center #2f80ed;
        background-size: 14px auto;
        z-index: 1;
        pointer-events: none;
    }

    .card__author img {
        display: block;
        overflow: hidden;
        width: 40px !important;
        height: 40px;
        border-radius: 10px;
        margin-right: 10px;
    }

    .card__author a {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        color: #bdbdbd;
        font-size: 16px;
    }

    .card__author a:hover {
        color: #AC1E21;
    }

    .card__info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;
        border-top: 1px solid #222227;
        padding-top: 15px;
        margin-top: 15px;
        color: white;
    }

    .card__price {
        display: inline-flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .card__price span:first-child {
        font-size: 14px;
        line-height: 100%;
        color: #bdbdbd;
    }

    .card__price span:last-child {
        font-size: 17px;
        line-height: 100%;
        color: #fff;
        margin-top: 10px;
    }

    .card__likes {
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .card__likes svg {
        width: 18px;
        height: auto;
        transition: fill 0.5s ease;
        fill: #bdbdbd;
    }

    .card__likes span {
        font-size: 13px;
        line-height: 18px;
        color: #bdbdbd;
        margin-left: 5px;
        transition: color 0.5s ease;
    }

    .card__likes span:empty {
        margin-left: 0;
    }

    .card__likes:hover svg {
        fill: #eb5757;
    }

    .card__likes--active svg {
        fill: #eb5757;
    }

    .card__likes--active span {
        color: #fff;
    }

    .card__likes--active:hover svg {
        fill: #bdbdbd;
    }

    .card__likes--active:hover span {
        color: #bdbdbd;
    }

    .card__time {
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        height: 32px;
        border-radius: 16px;
        position: absolute;
        bottom: 0;
        left: 0;
        border: 2px solid #AC1E21;
        color: #fff;
        font-size: 12px;
        background-color: #222227;
        font-weight: 400;
        padding: 0 12px;
    }

    .card__time svg {
        position: relative;
        top: auto;
        left: auto;
        right: auto;
        bottom: auto;
        width: 16px;
        height: auto;
        margin-right: 6px;
        fill: #AC1E21;
        margin-left: -3px;
    }

    .card__time--clock {
        border-color: #f7630c;
    }

    .card__time--clock svg {
        fill: #f7630c;
    }

    @media (min-width: 768px) {
        .card {
            margin-top: 30px;
        }
    }

    @media (max-width: 578px) {
        .card {
            padding: 50px;
        }
    }

    @media (max-width: 478px) {
        .card {
            padding: 20px;
        }
    }
</style>
