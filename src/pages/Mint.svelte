<script lang="ts">
    import { connectionProvider } from "../stores/connection.store";
    import { collection, nftMint } from "../stores/forms.store";
    import SwalW from 'sweetalert2';
    import type { Connection } from "../types";
    import { generateMetadata } from "../service/api";
    import { get } from "svelte/store";
    import type { ContractTransaction } from "ethers/lib/ethers";
    import { push } from "svelte-spa-router";

    const Swal: any = SwalW;
    let account = "";
    let accountSubstr = "";
    let loading = true;

    let count = 1;
    let address = "";

    let noConnection = false;

    const validate = () => {
        console.log("VALIDATING", $collection);
        const errors = [];

        // if (!$collection.id || !$collection.contract) {
        //     errors.push("Please select the NFT you wish to Sell");
        // }


        return {
            success: errors.length === 0,
            error: errors.join("\n")
        }
    }

    const handleSubmit = async () => {
        const file = document.forms['mintForm']['sign__file-upload'].files[0];

        console.log(file);
        const { success, error } = validate();

        if (!success) {
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

            Toast.fire({
                icon: 'error',
                title: error
            })
            return;
        }

        try {
            const rpc = get(connectionProvider);

            Swal.fire({
                title: 'Generating IPFS URI ... ',
                icon: 'info',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                },
            })

            const metadataURI = await generateMetadata($nftMint, file);

            if (!metadataURI) {
                console.error("NO metadataURI", metadataURI);
                return;
            }
            console.log("metadataURI", metadataURI);

            const tx: ContractTransaction = await rpc.Factory.mint(metadataURI);

            Swal.fire({
                title: 'Minting ...',
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
                // window.location.reload();
                // push("/#")
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

    };

    const onConnectionChanged = async (rpc: Connection) => {
        if (!rpc) {
            console.log("Not Connected !");
            return;
        }

        account = rpc?.account || "";


        loading = false;
    }

    const onMyInfoChanged = async () => {
        // console.log("<<< My Info changed >>>", info)
        // if (!info || info.length === 0) {
        //     myInfo = [];
        // }
        // const rpc = get(connectionProvider);
        // if (!rpc) {
        //     noConnection = true;
        //     return;
        // }
        // noConnection = false;
        // const service = getService(rpc);
        //
        // count = info.length;
        // myInfo = await service.main.getPreviews(info);
    }

    $: onConnectionChanged($connectionProvider);
    // $: onMyInfoChanged($myInfoStore);

</script>


<div class="main__author" style="background-image: url('./img/bg.png')"></div>

<div class="container">
    <div class="row row--grid">
        <!-- author -->
        <div class="col-12 col-xl-3">
            <div class="author author--page">
                <div class="author__meta">
                    <a href="" class="author__avatar author__avatar--verified">
                        <img id="nft-element" src="/img/avatars/avatarGirl.jpg" alt="">
                    </a>
                    <h1 class="author__name" style="height: 30px"><a href="author.html"></a></h1>
                    <h2 class="author__nickname" id="account"><a
                            href={`https://mumbai.polygonscan.com/address/${account}`}
                            target="_blank">@{accountSubstr}</a></h2>
                    <!--                    <p class="author__text"><b>Holding: </b><br>-->
                    <!--                        <span>{count} NFT{count > 1 ? "s" : ""}</span>-->
                    <!--                    </p>-->
                </div>
            </div>
        </div>

        <div class="col-12 col-xl-9">
            <!-- title -->
            <div class="main__title main__title--create">
                <h2>Mint Dynamic NFT</h2>
            </div>
            <!-- end title -->

            <!-- Mint form -->
            <form class="sign__form sign__form--create" id="mintForm">
                <div class="row" style="width: 100%;">
                    <div class="col-12">
                        <h4 class="sign__title">Upload file</h4>
                    </div>

                    <div class="col-12">
                        <div class="sign__file">
                            <label id="file1" for="sign__file-upload">e. g. Image, Audio, Video</label>
                            <input data-name="#file1" id="sign__file-upload" name="file" class="sign__file-upload"
                                   type="file" accept="video/mp4,video/x-m4v,video/*,.png,.jpg,.jpeg">
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="sign__group">
                            <label class="sign__label" for="itemname">Name</label>
                            <input bind:value={$nftMint.name} id="itemname" type="text" name="itemname"
                                   class="sign__input"
                                   placeholder="Item Name">
                        </div>
                    </div>


                    <div class="col-12">
                        <div class="sign__group">
                            <label class="sign__label" for="description">Description</label>
                            <textarea bind:value={$nftMint.description} id="description" name="description"
                                      class="sign__textarea"
                                      placeholder="e.g. 'A unique on chain card game featuring ...'"></textarea>
                        </div>
                    </div>

                    {#if !noConnection}
                        <div class="col-12 col-xl-3">
                            <button type="button" on:click={handleSubmit} class="sign__btn">
                                Mint
                            </button>
                        </div>
                    {/if}
                </div>
            </form>
            <!-- end Mint form -->
        </div>
    </div>
</div>

<style>
    #account {
        /*color: white;*/
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }

    #nft-element {
        max-width: 100%;
    }

    .my-nft:hover {
        cursor: pointer;
    }

    .sign {
        display: block;
        position: relative;
    }

    .sign__content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: auto;
        padding: 25px 0 0;
    }

    .sign__form {
        background-color: #16151a;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 16px;
        padding: 30px 20px;
        position: relative;
        width: 100%;
        max-width: 420px;
        border: 1px solid #222227;
    }

    .sign__form--contacts,
    .sign__form--profile,
    .sign__form--create {
        margin-top: 20px;
        max-width: 100%;
        padding: 20px 20px 5px;
        align-items: flex-start;
    }

    .sign__form--contacts .sign__btn,
    .sign__form--profile .sign__btn,
    .sign__form--create .sign__btn {
        margin: 0 0 15px;
    }

    .sign__form--contacts .row,
    .sign__form--profile .row,
    .sign__form--create .row {
        margin-left: -10px;
        margin-right: -10px;
    }

    .sign__form--contacts .col-12,
    .sign__form--profile .col-12,
    .sign__form--create .col-12 {
        padding-left: 10px;
        padding-right: 10px;
    }

    .sign__form--profile .sign__btn {
        margin: 5px 0 15px;
    }

    .sign__logo {
        display: block;
        margin-bottom: 30px;
    }

    .sign__logo a {
        max-width: 100%;
        width: auto;
    }

    .sign__logo img {
        width: auto;
        height: 50px;
    }

    .sign__title {
        font-size: 16px;
        font-weight: 500;
        font-family: 'Inter', sans-serif;
        color: #fff;
        margin-bottom: 20px;
    }

    .sign__label {
        font-weight: 400;
        font-size: 14px;
        color: #bdbdbd;
        margin-bottom: 5px;
        padding-left: 20px;
    }

    .sign__label b {
        font-weight: 600;
        color: #fff;
    }

    .sign__input {
        background-color: #222227;
        border: 1px solid transparent;
        border-radius: 12px;
        height: 46px;
        position: relative;
        color: #fff;
        font-size: 16px;
        width: 100%;
        padding: 0 20px;
        font-family: 'Inter', sans-serif;
    }

    .sign__input:focus {
        border-color: #AC1E21;
    }

    .sign__select {
        background: url("img/arrow2.svg") no-repeat center right 20px #222227;
        background-size: 18px auto;
        border: 1px solid transparent;
        border-radius: 12px;
        height: 46px;
        position: relative;
        color: #fff;
        font-size: 16px;
        width: 100%;
        padding: 0 20px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
    }

    .sign__select:focus {
        border-color: #AC1E21;
    }

    .sign__textarea {
        background-color: #222227;
        border: 1px solid transparent;
        border-radius: 12px;
        height: 144px;
        position: relative;
        color: #fff;
        font-size: 16px;
        width: 100%;
        padding: 15px 20px;
        resize: none;
        font-family: 'Inter', sans-serif;
    }

    .sign__textarea:focus {
        border-color: #AC1E21;
    }

    .sign__group {
        display: flex;
        flex-direction: row;
        /*justify-content: center;*/
        align-items: flex-end;
        flex-wrap: wrap;
        position: relative;
        margin-bottom: 20px;
        width: 100%;
    }

    .sign__group--row .sign__label {
        padding-left: 0;
    }

    .sign__group--checkbox {
        width: 100%;
        text-align: left;
    }

    .sign__group--checkbox input:not(:checked),
    .sign__group--checkbox input:checked {
        position: absolute;
        left: -9999px;
    }

    .sign__group--checkbox input:not(:checked) + label,
    .sign__group--checkbox input:checked + label {
        font-size: 14px;
        color: #bdbdbd;
        font-weight: normal;
        position: relative;
        cursor: pointer;
        padding-left: 35px;
        line-height: 22px;
        margin: 0;
    }

    .sign__group--checkbox input:not(:checked) + label a,
    .sign__group--checkbox input:checked + label a {
        color: #AC1E21;
    }

    .sign__group--checkbox input:not(:checked) + label a:hover,
    .sign__group--checkbox input:checked + label a:hover {
        color: #AC1E21;
        text-decoration: underline;
    }

    .sign__group--checkbox input:not(:checked) + label:before,
    .sign__group--checkbox input:checked + label:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 22px;
        height: 22px;
        background-color: #222227;
        border: 1px solid transparent;
        border-radius: 6px;
    }

    .sign__group--checkbox input:not(:checked) + label:after,
    .sign__group--checkbox input:checked + label:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 22px;
        height: 22px;
        text-align: center;
        transition: 0.5s ease;
        background: url("img/checkmark.svg") no-repeat center/20px auto;
        border-radius: 6px;
    }

    .sign__group--checkbox input:not(:checked) + label:after {
        opacity: 0;
        transform: scale(0);
    }

    .sign__group--checkbox input:checked + label:after {
        opacity: 1;
        transform: scale(1);
    }

    .sign__group--checkbox label::-moz-selection {
        background: transparent;
        color: #bdbdbd;
    }

    .sign__group--checkbox label::selection {
        background: transparent;
        color: #bdbdbd;
    }

    .sign__btn {
        width: 100%;
        height: 50px;
        border-radius: 12px;
        background-color: #AC1E21;
        display: flex;
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
        margin: 15px auto;
    }

    .sign__btn:hover {
        color: #AC1E21;
        background-color: #222227;
    }

    .sign__text {
        margin-top: 15px;
        font-size: 14px;
        line-height: 24px;
        color: #fff;
        width: 100%;
        text-align: center;
    }

    .sign__text:first-child {
        margin-top: 0;
    }

    .sign__text a {
        position: relative;
        color: #AC1E21;
    }

    .sign__text a:hover {
        color: #AC1E21;
        text-decoration: underline;
    }

    .sign__text--small {
        font-size: 13px;
        line-height: 21px;
        text-align: left;
        color: #bdbdbd;
    }

    .sign__delimiter {
        font-size: 14px;
        color: #bdbdbd;
        line-height: 100%;
        width: 100%;
        display: block;
        text-align: center;
    }

    .sign__social {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-bottom: 15px;
        margin-top: 15px;
    }

    .sign__social a {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 46px;
        width: calc(33% - 10px);
        border-radius: 12px;
        color: #fff;
    }

    .sign__social a svg {
        height: auto;
        fill: #fff;
        transition: 0.5s ease;
    }

    .sign__social a.fb {
        background-color: #3b5999;
    }

    .sign__social a.fb svg {
        width: 10px;
    }

    .sign__social a.gl {
        background-color: #df4a32;
    }

    .sign__social a.gl svg {
        width: 18px;
    }

    .sign__social a.tw {
        background-color: #1da1f2;
    }

    .sign__social a.tw svg {
        width: 20px;
    }

    .sign__social a:hover {
        background-color: #bdbdbd;
    }

    .sign__social a:hover.fb svg {
        fill: #3b5999;
    }

    .sign__social a:hover.gl svg {
        fill: #df4a32;
    }

    .sign__social a:hover.tw svg {
        fill: #1da1f2;
    }

    .sign__value {
        font-size: 24px;
        color: #fff;
        display: block;
        font-weight: 500;
        margin-left: 10px;
        font-family: 'Inter', sans-serif;
    }

    .sign__radio {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        margin-top: 5px;
    }

    .sign__radio--single {
        padding-top: 20px;
        margin-top: 0;
        border-top: 1px solid #222227;
    }

    .sign__radio li {
        position: relative;
        overflow: hidden;
        margin-bottom: 10px;
    }

    .sign__radio li:last-child {
        margin-bottom: 0;
    }

    .sign__radio input:not(:checked),
    .sign__radio input:checked {
        position: absolute;
        left: -9999px;
    }

    .sign__radio label {
        display: block;
        margin: 0;
        position: relative;
        font-weight: 400;
        cursor: pointer;
        font-size: 16px;
        color: #bdbdbd;
        line-height: 24px;
        padding-left: 32px;
        transition: 0.5s ease;
    }

    .sign__radio label:before {
        content: '';
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        border: 6px solid #222227;
        background-color: transparent;
        border-radius: 50%;
        left: 0;
        top: 2px;
        transition: 0.5s ease;
    }

    .sign__radio label:hover {
        color: #fff;
    }

    .sign__radio input:checked + label {
        color: #fff;
    }

    .sign__radio input:checked + label:before {
        border-color: #AC1E21;
    }

    .sign__file {
        position: relative;
        width: 100%;
        height: 46px;
        margin-bottom: 20px;
        overflow: hidden;
        border-radius: 12px;
        display: block;
    }

    .sign__file input {
        position: absolute;
        left: -9999px;
        opacity: 0;
        z-index: 1;
    }

    .sign__file label {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        z-index: 2;
        height: 46px;
        color: #bdbdbd;
        padding: 0 60px 0 20px;
        background-color: #222227;
        margin: 0;
        width: 100%;
        font-size: 16px;
        cursor: pointer;
        transition: 0.5s ease;
        font-family: 'Inter', sans-serif;
        font-weight: 400;
    }

    .sign__file label:hover {
        color: #fff;
    }

    @media (min-width: 576px) {
        .sign__form {
            padding: 40px;
        }

        .sign__form--contacts,
        .sign__form--profile,
        .sign__form--create {
            padding: 20px 20px 5px;
        }

        .sign__logo {
            margin-bottom: 40px;
        }
    }

    @media (min-width: 768px) {
        .sign__form--contacts,
        .sign__form--profile,
        .sign__form--create {
            margin-top: 30px;
        }

        .sign__form--contacts .sign__btn,
        .sign__form--profile .sign__btn,
        .sign__form--create .sign__btn {
            margin: 10px 0 15px;
        }
    }

    @media (min-width: 992px) {
        .sign__form--profile .sign__btn {
            width: 160px;
        }
    }

    /*AUTHOR*/


    .author {
        margin-top: 20px;
        border-radius: 16px;
        width: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .author--page {
        overflow: visible;
        margin-top: 0;
        z-index: 2;
    }

    .author--page .author__avatar {
        width: 160px;
        max-width: 160px;
        height: 160px;
        margin-top: -80px;
        margin-bottom: 15px;
    }

    .author--page .author__avatar img {
        border: 2px solid #16151a;
    }

    .author--page .author__avatar--verified:after {
        width: 24px;
        height: 24px;
        background-size: 18px auto;
    }

    .author__cover {
        width: 100%;
        height: 120px;
        background-color: #222227;
        border-top: 1px solid #222227;
        border-left: 1px solid #222227;
        border-right: 1px solid #222227;
        border-radius: 16px 16px 0 0;
    }

    .author__cover--bg {
        border: none;
    }

    .author__meta {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        padding: 0 20px 20px;
        background-color: #16151a;
        border-radius: 0 0 16px 16px;
        border-left: 1px solid #222227;
        border-right: 1px solid #222227;
        border-bottom: 1px solid #222227;
        height: auto;
    }

    .author__avatar {
        display: block;
        width: 60px;
        height: 60px;
        border-radius: 16px;
        margin-top: -30px;
        margin-bottom: 12px;
        position: relative;
    }

    .author__avatar img {
        width: 100%;
        border-radius: 16px;
        border: 1px solid #16151a;
    }

    .author__avatar--verified:after {
        content: '';
        position: absolute;
        display: block;
        width: 20px;
        height: 20px;
        border: 2px solid #fff;
        bottom: -2px;
        right: -2px;
        border-radius: 50%;
        background: url("img/verified.svg") no-repeat center #2f80ed;
        background-size: 14px auto;
        z-index: 1;
        pointer-events: none;
    }

    .author__name {
        display: block;
        width: 100%;
        font-size: 18px;
        color: #fff;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        margin-bottom: 6px;
    }

    .author__name a {
        color: #fff;
    }

    .author__name a:hover {
        color: #AC1E21;
    }

    .author__nickname {
        display: block;
        width: 100%;
        font-size: 16px;
        color: #AC1E21;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        margin-bottom: 10px;
    }

    .author__nickname a {
        color: #AC1E21;
    }

    .author__nickname a:hover {
        color: #fff;
    }

    .author__text {
        display: block;
        width: 100%;
        font-size: 14px;
        line-height: 24px;
        color: #bdbdbd;
        font-weight: 400;
        margin-bottom: 0;
        min-height: 72px;
    }

    .author__wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;
        border-top: 1px solid #222227;
        padding-top: 15px;
        margin-top: 15px;
    }

    .author__followers {
        display: inline-flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .author__followers p {
        font-size: 20px;
        line-height: 100%;
        color: #fff;
        margin-bottom: 0;
        font-family: 'Inter', sans-serif;
    }

    .author__followers span {
        font-size: 14px;
        color: #bdbdbd;
        line-height: 100%;
        margin-top: 8px;
    }

    .author__follow {
        width: 110px;
        height: 42px;
        border-radius: 12px;
        background-color: #222227;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 13px;
        position: relative;
        z-index: 2;
        text-transform: uppercase;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    }

    .author__follow:hover {
        color: #fff;
        background-color: #AC1E21;
    }

    .author__follow--true {
        background-color: #AC1E21;
        color: #fff;
    }

    .author__follow--true:hover {
        background-color: #222227;
        color: #AC1E21;
    }

    .author__social {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        width: 100%;
    }

    .author__social a {
        margin-top: 20px;
        margin-right: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        position: relative;
    }

    .author__social a svg {
        width: 20px;
        height: auto;
        fill: #bdbdbd;
        transition: fill 0.5s ease;
    }

    .author__social a:last-child {
        margin-right: 0;
    }

    .author__social a:hover svg {
        fill: #AC1E21;
    }

    .author__code {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        margin-top: 15px;
        height: 32px;
        background-color: #222227;
        border-radius: 10px;
        position: relative;
    }

    .author__code input {
        width: 100%;
        padding: 0 40px 0 15px;
        height: 30px;
        border: none;
        background-color: transparent;
        color: #bdbdbd;
        font-size: 14px;
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-wrap: break-word;
        cursor: default;
        position: relative;
        z-index: 1;
        transition: 0s;
    }

    .author__code ::-moz-selection {
        background: transparent;
        color: #bdbdbd;
    }

    .author__code ::selection {
        background: transparent;
        color: #bdbdbd;
    }

    .author__code button {
        position: absolute;
        z-index: 2;
        cursor: pointer;
        width: 40px;
        top: 0;
        right: 0;
        height: 32px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        transition: 0s;
    }

    .author__code button span {
        position: absolute;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: auto;
        background-color: #222227;
        border-radius: 8px;
        font-size: 12px;
        line-height: 22px;
        padding: 0 8px;
        color: #bdbdbd;
        bottom: 100%;
        margin-bottom: 5px;
        transform: scale(0);
        pointer-events: none;
        opacity: 0;
        transition: 0.4s ease;
        transition-property: opacity, transform;
    }

    .author__code button svg {
        fill: #AC1E21;
        width: 18px;
        height: auto;
        opacity: 0.75;
        transition: opacity 0.5s ease;
    }

    .author__code button.active span {
        transform: scale(1);
        opacity: 1;
    }

    .author__code button.active svg {
        opacity: 1;
    }

    .author__code button:hover svg {
        opacity: 1;
    }

    .author__link {
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-top: 15px;
        font-size: 14px;
        line-height: 20px;
        color: #bdbdbd;
        font-family: 'Inter', sans-serif;
        font-weight: 400;
    }

    .author__link svg {
        width: 20px;
        height: auto;
        fill: #AC1E21;
        margin-right: 5px;
    }

    .author__link:hover {
        color: #AC1E21;
    }

    .hero__btn--clr {
        background-color: #AC1E21;
        color: #fff;
    }


    @media (min-width: 576px) {
        .author__text {
            min-height: 96px;
        }

        .author--page .author__text {
            padding-right: 40%;
        }
    }

    @media (min-width: 768px) {
        .author {
            margin-top: 30px;
        }

        .author--page {
            margin-top: 0;
        }

        .author--page .author__text {
            padding-right: 50%;
        }

        .author__text {
            min-height: 72px;
        }
    }

    @media (min-width: 1200px) {
        .author--page {
            padding-right: 10px;
        }

        .author--page .author__text {
            padding-right: 0;
        }
    }
</style>
