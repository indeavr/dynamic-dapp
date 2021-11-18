<script>
    import { onMount } from 'svelte';

    onMount(async () => {
        console.log("Mounted !")
        const { owl } = await import("../../scripts/template");
        owl();
    });

</script>

<div class="home home--hero">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="hero owl-carousel" id="hero">
                    <div class="hero__slide" data-bg="img/slider/ultra2.jpg">
                        <h1 class="hero__title" style="font-size: 30px;">True Ownership & Dynamic NFTs</h1>
                        <p class="hero__text">Discover the next generation of Non-Fungible Tokens.
                            <br>Empowering GameFi, Creators and Developers.
                            <br><br>Solidity Library, Dapp, Tooling</p>
                        <div class="hero__btns">
                            <a href="/#/explore" class="hero__btn hero__btn--clr">Explore</a>
                            <a href="/#/mint" class="hero__btn">Mint NFT</a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .hero {
        display: block;
        width: 100%;
        margin-top: 30px;
        position: relative;
    }

    .hero .owl-dots {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 25px;
        position: relative;
    }

    .hero .owl-dot {
        margin-right: 10px;
    }

    .hero .owl-dot:last-child {
        margin-right: 0;
    }

    .hero .owl-dot span {
        display: block;
        height: 4px;
        width: 10px;
        border-radius: 2px;
        background-color: #bdbdbd;
        transition: 0.5s ease;
    }

    .hero .owl-dot.active span {
        width: 20px;
        background-color: #AC1E21;
    }

    .hero .owl-stage-outer {
        border-radius: 16px;
    }

    .hero__slide {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        min-height: 360px;
        border-radius: 16px;
        overflow: hidden;
        padding: 40px 20px;
        position: relative;
    }

    .hero__slide:before {
        content: '';
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(30deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
        z-index: 1;
    }

    .hero__title {
        position: relative;
        z-index: 2;
        color: #fff;
        font-weight: 400;
        font-size: 30px;
        font-family: 'Inter', sans-serif;
        margin-bottom: 0;
        line-height: 140%;
    }

    .hero__title b {
        font-weight: 500;
    }

    .hero__title span {
        color: #AC1E21;
    }

    .hero__text {
        position: relative;
        z-index: 2;
        color: #bdbdbd;
        font-size: 16px;
        line-height: 28px;
        margin-bottom: 0;
        margin-top: 15px;
    }

    .hero__btns {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        width: 100%;
        margin-top: 10px;
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

    @media (min-width: 576px) {
        .hero__slide {
            min-height: 400px;
        }
    }

    @media (min-width: 768px) {
        .hero .owl-dots {
            margin-top: 30px;
        }

        .hero__slide {
            padding: 40px;
            padding-right: 10%;
            min-height: 460px;
        }

        .hero__title {
            font-size: 36px;
        }

        .hero__btn {
            margin-top: 30px;
            margin-right: 30px;
            min-width: 160px;
            padding: 0 25px;
        }

        .hero__btn:last-child {
            margin-right: 0;
        }
    }

    @media (min-width: 992px) {
        .hero__slide {
            padding-right: 25%;
        }
    }

    @media (min-width: 1200px) {
        .hero .owl-dots {
            justify-content: flex-end;
            margin-top: -44px;
            margin-bottom: 0;
            padding-right: 124px;
            z-index: 2;
            position: absolute;
        }

        .hero .owl-dot span {
            background-color: rgba(255, 255, 255, 0.6);
        }

        .hero .owl-dot.active span {
            background-color: #fff;
        }

        .hero__title {
            font-size: 42px;
        }

        .hero__btn {
            margin-top: 40px;
        }

        .hero__slide {
            padding: 60px;
            padding-right: 50%;
        }
    }
</style>
