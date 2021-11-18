<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    const validateAndSendProposition = () => {
        const file = (document.getElementById("sign__file-upload") as HTMLInputElement).files[0];

        if (!file) {
            console.error("No FILE !");
            return;
        }
        dispatch('makeProposition', { file });
    }


    onMount(async () => {
        const { owl } = await import("../../scripts/template");
        owl();
        console.log("imported")
    });

</script>

<div id="modal-bid" class="zoom-anim-dialog mfp-hide modal modal--form">
    <button class="modal__close" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/>
        </svg>
    </button>

    <h4 class="sign__title">Add Asset Proposition</h4>

    <div class="sign__group sign__group--row">

        <div class="col-12">
            <div class="sign__file">
                <label id="file1" for="sign__file-upload">e. g. Image, Audio, Video</label>
                <input data-name="#file1" id="sign__file-upload" name="file" class="sign__file-upload"
                       type="file" accept="video/mp4,video/x-m4v,video/*,.png,.jpg,.jpeg">
            </div>
        </div>
    </div>

    <button class="sign__btn" type="button" on:click={validateAndSendProposition}>Propose</button>
</div>

<style>
    .modal {
        position: relative;
        display: block;
        background-color: #16151a;
        margin: 40px auto;
        width: 100%;
        max-width: 420px;
        padding: 20px;
        border-radius: 16px;
        overflow: hidden;
    }

    .modal--form {
        padding: 20px 20px 5px;
    }

    .modal--asset {
        max-width: 1300px;
        padding: 35px 20px 20px;
    }

    .modal .mfp-close {
        display: none;
    }

    .modal__close {
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 1;
    }

    .modal__close svg {
        fill: #bdbdbd;
        opacity: 0.6;
        transition: 0.5s ease;
        height: auto;
        width: 24px;
    }

    .modal__close:hover svg {
        opacity: 1;
        fill: #AC1E21;
    }

    @media (min-width: 768px) {
        .modal {
            padding: 40px;
        }

        .modal--asset {
            padding: 10px 40px 40px;
        }

        .modal--form {
            padding: 40px 40px 25px;
        }

        .modal--form .modal__close {
            top: 37px;
            right: 35px;
        }

        .modal--form .sign__btn {
            margin-top: 30px;
        }
    }

    .mfp-bg {
        background: rgba(34, 34, 39, 0.75);
    }

    .mfp-container {
        padding: 0 15px !important;
    }

    .my-mfp-zoom-in .zoom-anim-dialog {
        opacity: 0;
        transition: all 0.4s ease-in-out;
        transform: scale(0.8);
    }

    .my-mfp-zoom-in.mfp-ready .zoom-anim-dialog {
        opacity: 1;
        transform: scale(1);
    }

    .my-mfp-zoom-in.mfp-ready.mfp-bg {
        opacity: 1;
    }

    .my-mfp-zoom-in.mfp-removing .zoom-anim-dialog {
        transform: scale(0.8);
        opacity: 0;
    }

    .my-mfp-zoom-in.mfp-removing.mfp-bg {
        opacity: 0;
    }

    .my-mfp-zoom-in.mfp-bg {
        opacity: 0;
        transition: opacity 0.4s ease-out;
    }

    .mfp-iframe-scaler iframe {
        border-radius: 12px;
        box-shadow: none;
        background-color: #16151a;
    }

    .mfp-iframe-holder .mfp-close {
        color: transparent;
        transition: opacity 0.4s;
    }

    .mfp-iframe-holder .mfp-close:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 44px;
        background: url("img/close.svg") no-repeat center;
        background-size: 30px auto;
    }

    .mfp-iframe-holder .mfp-content {
        max-width: 910px;
    }

    .mfp-figure::after {
        box-shadow: none;
        background-color: #222227;
    }

    .mfp-fade.mfp-bg {
        opacity: 0;
        transition: all 0.4s ease-in-out;
    }

    .mfp-fade.mfp-bg.mfp-ready {
        opacity: 1;
    }

    .mfp-fade.mfp-bg.mfp-ready .mfp-content {
        opacity: 1;
    }

    .mfp-fade.mfp-bg.mfp-removing {
        opacity: 0;
    }

    .mfp-fade.mfp-bg.mfp-removing .mfp-content {
        opacity: 0;
    }

    .mfp-fade.mfp-wrap .mfp-content {
        opacity: 0;
        transition: all 0.4s ease-in-out;
    }

    .mfp-fade.mfp-wrap.mfp-ready .mfp-content {
        opacity: 1;
    }

    .mfp-fade.mfp-wrap.mfp-removing .mfp-content {
        opacity: 0;
    }

    /*SIGN*/

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
        justify-content: flex-start;
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


</style>
