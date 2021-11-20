<script lang="ts">
    import { get } from "svelte/store";
    import { connectionProvider } from "../../stores/connection.store";
    import SwalW from "sweetalert2";
    import { onMount } from "svelte";
    import { proposition } from "../../stores/forms.store";
    import { propositionsStore } from "../../stores/nfts.store";
    import { Contract } from "ethers";
    import { DYNAMIC_NFT_ABI } from "../../abi";
    import type { Proposition } from "../../types";
    import { generateMetadata, generateMetadataWithoutImage } from "../../service/api";

    const Swal: any = SwalW;

    onMount(async () => {
        const { owl } = await import("../../scripts/template");
        owl();
    });

    export let nft;
    export let simulateChange;

    let isMine;

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        // timer: 3000,
        // timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    let selected = -1;
    const propositionSelected = (i, prop) => {
        selected = i;
        $proposition = prop;
    }


    const acceptProposition = async () => {
        const rpc = await get(connectionProvider);
        const chosenProp: Proposition = await get(proposition);

        if (!rpc) {
            return;
        }

        console.log("hmm", chosenProp.contract, DYNAMIC_NFT_ABI, rpc.signer);

        const DYContract = new Contract(chosenProp.contract.trim(), DYNAMIC_NFT_ABI, rpc.signer);

        const { isConfirmed } = await Swal.fire({
            title: 'Are you sure ?',
            // text: "You won't be able to revert deleting you NFT !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: '#d11',
            confirmButtonText: 'Yes !',
        })

        if (isConfirmed) {
            Swal.fire({
                title: 'Waiting for Confirmation',
                icon: 'question',
                showConfirmButton: false,
                allowOutsideClick: false,
            })

            try {
                const newMetadata = await generateMetadataWithoutImage({
                    ...nft.metadata,
                    image:   chosenProp.image.original.src
                })
                console.log("NEW META", newMetadata)

                const tx = await DYContract.addUpgrade(
                    chosenProp.id,
                    newMetadata
                );

                Swal.fire({
                    title: 'Accepting ...',
                    icon: 'info',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                })

                try {
                    await tx.wait();
                    // Swal.close()
                    await Swal.fire({
                        title: "Success !",
                        confirmButtonText: "Done",
                        icon: "success",
                    });
                    window.location.reload();
                } catch (err) {
                    console.error(err);
                    const filter = /transactionHash="(.*)"/
                    const match = filter.exec(err.message.toString());
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Execution reverted',
                        footer: `<a href="https://mumbai.polygonscan.com/tx/${match[1]}" target="_blank">Check out why</a>`
                    })
                }


            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: e.message,
                })
            }
        }

    };

    const refresh = async () => {
        await propositionsStore.get({
            id: nft.id,
            contract: nft.contract
        })
    }

    const nftChanged = async () => {
        if (nft) {
            console.log("@@@ NFT CHANGED @@@")
            await propositionsStore.get({
                id: nft.id,
                contract: nft.contract
            })
        }
    }

    const propositionsChanged = async (propositions) => {
        console.log("@@@ Propositions @@@", propositions);

    }

    $: nft, nftChanged();
    $:propositionsChanged($propositionsStore);

</script>

<div class="tab-content">
    <div class="tab-pane fade  show active" id="tab-1" role="tabpanel">
        {#if nft.id}
            <!--            <img on:click={refresh} src="icons/ref.png" style="width: 22px; height: 22px; cursor: pointer;"/>-->
            <div class="asset__actions asset__actions--scroll" id="asset__actions--scroll">
                {#each $propositionsStore as prop, i}
                    <div style="cursor:pointer;" on:click={() => propositionSelected(i, prop)}
                         id="details"
                         class={`asset__action asset__action--verified ${selected === i ? "selected" : "not-selected"}`}
                    >
                        <a href={prop.imageUri} target="_blank" class="img-container">
                            <img src={prop.imageUri} alt="" style="width: 100%">
                        </a>
                        <p>Proposition made for <b>.003 ETH</b> 4 hours ago <br>by <a href="author.html">@erikkk</a></p>
                    </div>
                {/each}
            </div>
        {:else }
            Loading ...
        {/if}
    </div>
</div>
<!-- end tabs -->

<div class="asset__wrap">
    <div class="asset__timer">
                        <span
                        ><svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                        ><path
                                d="M18.3,8.59l.91-.9a1,1,0,0,0-1.42-1.42l-.9.91a8,8,0,0,0-9.79,0l-.91-.92A1,1,0,0,0,4.77,7.69l.92.91A7.92,7.92,0,0,0,4,13.5,8,8,0,1,0,18.3,8.59ZM12,19.5a6,6,0,1,1,6-6A6,6,0,0,1,12,19.5Zm-2-15h4a1,1,0,0,0,0-2H10a1,1,0,0,0,0,2Zm3,6a1,1,0,0,0-2,0v1.89a1.5,1.5,0,1,0,2,0Z"
                        /></svg>
                            Upgrades made: 0
                        </span>
        <div class="asset__clock"/>
    </div>

    <div class="asset__price">
        <span>Current Price</span>
        <span>42 Matic </span>
    </div>
</div>

<div hidden="true" style="display: none">{simulateChange}</div>

<!-- actions -->
<div class="asset__btns">
    {#if false}
        <button
                class={`asset__btn asset__btn--clr ${isMine ? "disabled" : ""}`}
                on:click={acceptProposition}
                type="button">
            UpVote Selected
        </button>
    {:else}
        <button
                class={`asset__btn asset__btn--clr ${isMine ? "disabled" : ""}`}
                on:click={acceptProposition}
                type="button">
            Accept Selected
        </button>
    {/if}

    <a href="#modal-bid" style="cursor: pointer"
       class={`asset__btn open-modal ${isMine ? "disabled" : ""}`} disabled={isMine}>
        Add Proposition
    </a>
</div>
<!-- end actions -->

<style>
    #details {
        border: solid transparent 1px;
    }

    .selected {
        border: solid mediumseagreen 1px !important;
    }

    #details-ul {
        flex-direction: row;
        justify-content: space-between;
    }

    .info {
        font-size: 18px !important;
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

    li {
        width: 200px;
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
        font-family: 'Inter', sans-serif;
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
        font-family: 'Inter', sans-serif;
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
        content: '';
        position: absolute;
        display: block;
        width: 18px;
        height: 18px;
        border: 2px solid #fff;
        bottom: -2px;
        left: 90px;
        border-radius: 50%;
        background: url("img/verified.svg") no-repeat center #2f80ed;
        background-size: 14px auto;
        z-index: 1;
        pointer-events: none;
    }

    .asset__author img {
        display: block;
        overflow: hidden;
        width: 32px !important;
        height: 32px;
        border-radius: 10px;
        margin-right: 10px;
    }

    .asset__author a {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        color: #bdbdbd;
        font-size: 16px;
    }

    .asset__author a:hover {
        color: #AC1E21;
    }

    .asset__actions--scroll {
        height: 305px;
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
        content: '';
        position: absolute;
        display: block;
        width: 18px;
        height: 18px;
        border: 2px solid #fff;
        bottom: -2px;
        left: 90px;
        border-radius: 50%;
        background: url("img/verified.svg") no-repeat center #2f80ed;
        background-size: 14px auto;
        z-index: 1;
        pointer-events: none;
    }

    .asset__action .img-container {
        overflow: hidden;
        width: 100px !important;
        height: 132px;
        border-radius: 10px;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        align-items: end;
        justify-content: center;
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
        font-family: 'Inter', sans-serif;
        white-space: nowrap;
    }

    .asset__tabs a:before {
        content: '';
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

    @media (min-width: 576px) {
        .info {
            font-size: 20px !important;
        }

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
        .info {
            font-size: 24px !important;
        }

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
