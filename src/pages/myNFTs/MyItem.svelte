<script lang="ts">
    import { connectionProvider } from "../../stores/connection.store";
    import { get } from "svelte/store";
    import SwalW from 'sweetalert2';
    import MyUpgrades from "./MyUpgrades.svelte";
    import type { MyNFT } from "../../types";

    const Swal: any = SwalW;

    export let index;
    let loading = true;

    export let nft: MyNFT;
    console.log("Got NItem", nft);

    const handleAccept = async () => {
        if (!nft) {
            console.log("No nft info")
            return;
        }

        const rpc = get(connectionProvider);

        if (!rpc) {
            return;
        }

        const { isConfirmed } = await Swal.fire({
            title: 'Are you sure ?',
            // text: "You won't be able to revert deleting you NFT !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: '#d33',
        })

        if (isConfirmed) {
            Swal.fire({
                title: 'Waiting for Confirmation',
                icon: 'question',
                showConfirmButton: false,
                allowOutsideClick: false,
            })

            try {

            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: e.message,
                })
            }
        }
    }

    const nftChanged = () => {
        if (nft) {
        }
    }

    $: nft, nftChanged();
</script>

<div class="row">
    <!-- content -->
    <div class="col-4 col-xl-4">
        <div
                id="nft-wrapper"
                class="asset__item"
        >
            <a class="asset__img" href={nft.imageUri}>
                <img style="max-width: 100%" src={nft.imageUri} alt="">
            </a>
        </div>
    </div>
    <!-- end content -->

    <!-- header -->
    <div class="col-8 col-xl-8">
        <div class="asset__info">
            <div class="asset__desc">
                <h1 style="color: white"> {nft.metadata.name}</h1>
            </div>
            <div class="asset__desc">
                <h2 style="color: white">Description</h2>
                <p style="color: white">
                    {nft.metadata.description}
                </p>
            </div>

            <!-- tabs -->
            <MyUpgrades myNft={nft}/>
        </div>
    </div>
    <!-- end header -->
</div>


<style>
    #div-nft-element {
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
        font-size: 18px;
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
        font-family: 'Inter', sans-serif;
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
</style>
