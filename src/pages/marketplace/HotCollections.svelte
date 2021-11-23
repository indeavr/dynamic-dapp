<script lang="ts">
    import { ceramicProvider } from "../../stores/connection.store";
    import { collectionsStore } from "../../stores/nfts.store";


    // let carousel;
    // onMount(async () => {
    //     console.log("Mounted !")
    //     const { owl } = await import("../../scripts/template");
    //     carousel = owl;
    //     (window as any).carousel = owl;
    //     owl();
    // });

    let connected = false;

    const onConnectionChanged = async (ceramic) => {
        if (!ceramic) {
            connected = false;
            console.log("Not Connected to Ceramic !");
            return;
        }

        connected = true;
    }

    const onCollectionsChanged = async (collecitons) => {
        if (!collecitons || collecitons.length === 0) {
            console.log("Not Collections !");
            return;
        }

        console.log("<<< NEW HOT COLLECTIONS >>>", collecitons);

        // setTimeout(() => {
        //     carousel();
        // }, 3000)
    }

    $: onConnectionChanged($ceramicProvider);
    $: onCollectionsChanged($collectionsStore);

</script>
<div class="container">

    <section class="row row--grid">
        <!-- title -->
        <div class="col-12">
            <div class="main__title" style="margin-top: 20px">
                <h2>Collections</h2>
            </div>
        </div>
        <!-- end title -->

        <!-- carousel -->
        <div class="col-12">
            <div class="main__carousel-wrap">
                <div class="row" id="collections" style="margin-top: 40px;display: flex">

                    {#each $collectionsStore as coll, i}
                        <div class="collection col-4" id={`slide-${i}`}
                             style="display: inline-block;width: 95%; overflow: visible">
                            <a href="#" class="collection__cover" data-bg="img/bg/bg-small.png"></a>
                            <div class="collection__meta">
                                <a href="#" class="collection__avatar collection__avatar--verified">
                                    <img src="img/avatars/avatar3.jpg" alt="">
                                </a>
                                <h3 class="collection__name"><a href="#">{coll.title}</a></h3>
                                <span class="collection__number">ERC-721</span>
                            </div>
                        </div>
                    {/each}

                    <!--                    <div class="collection">-->
                    <!--                        <a href="collection.html" class="collection__cover" data-bg="img/bg/bg-small2.png"></a>-->
                    <!--                        <div class="collection__meta">-->
                    <!--                            <a href="author.html" class="collection__avatar collection__avatar&#45;&#45;verified">-->
                    <!--                                <img src="img/avatars/avatar9.jpg" alt="">-->
                    <!--                            </a>-->
                    <!--                            <h3 class="collection__name"><a href="collection.html">NFTheft</a></h3>-->
                    <!--                            <span class="collection__number">ERC-721</span>-->
                    <!--                        </div>-->
                    <!--                    </div>-->

                    <!--                    <div class="collection">-->
                    <!--                        <a href="collection.html" class="collection__cover" data-bg="img/bg/bg-small3.png"></a>-->
                    <!--                        <div class="collection__meta">-->
                    <!--                            <a href="author.html" class="collection__avatar collection__avatar&#45;&#45;verified">-->
                    <!--                                <img src="img/avatars/avatar12.jpg" alt="">-->
                    <!--                            </a>-->
                    <!--                            <h3 class="collection__name"><a href="collection.html">Inventory</a></h3>-->
                    <!--                            <span class="collection__number">ERC-1155</span>-->
                    <!--                        </div>-->
                    <!--                    </div>-->

                    <!--                    <div class="collection">-->
                    <!--                        <a href="collection.html" class="collection__cover" data-bg="img/bg/bg-small4.png"></a>-->
                    <!--                        <div class="collection__meta">-->
                    <!--                            <a href="author.html" class="collection__avatar">-->
                    <!--                                <img src="img/avatars/avatar15.jpg" alt="">-->
                    <!--                            </a>-->
                    <!--                            <h3 class="collection__name"><a href="collection.html">ProphecyNFT</a></h3>-->
                    <!--                            <span class="collection__number">ERC-721</span>-->
                    <!--                        </div>-->
                    <!--                    </div>-->

                    <!--                    <div class="collection">-->
                    <!--                        <a href="collection.html" class="collection__cover" data-bg="img/bg/bg-small5.png"></a>-->
                    <!--                        <div class="collection__meta">-->
                    <!--                            <a href="author.html" class="collection__avatar collection__avatar&#45;&#45;verified">-->
                    <!--                                <img src="img/avatars/avatar4.jpg" alt="">-->
                    <!--                            </a>-->
                    <!--                            <h3 class="collection__name"><a href="collection.html">Hashavatars</a></h3>-->
                    <!--                            <span class="collection__number">ERC-1155</span>-->
                    <!--                        </div>-->
                    <!--                    </div>-->

                    <!--                    <div class="collection">-->
                    <!--                        <a href="collection.html" class="collection__cover" data-bg="img/bg/bg-small6.png"></a>-->
                    <!--                        <div class="collection__meta">-->
                    <!--                            <a href="author.html" class="collection__avatar">-->
                    <!--                                <img src="img/avatars/avatar11.jpg" alt="">-->
                    <!--                            </a>-->
                    <!--                            <h3 class="collection__name"><a href="collection.html">Clap Token</a></h3>-->
                    <!--                            <span class="collection__number">ERC-1155</span>-->
                    <!--                        </div>-->
                    <!--                    </div>-->

                    <!--                    <div class="collection">-->
                    <!--                        <a href="collection.html" class="collection__cover"></a>-->
                    <!--                        <div class="collection__meta">-->
                    <!--                            <a href="author.html" class="collection__avatar collection__avatar&#45;&#45;verified">-->
                    <!--                                <img src="img/avatars/avatar15.jpg" alt="">-->
                    <!--                            </a>-->
                    <!--                            <h3 class="collection__name"><a href="collection.html">InventoryNFT</a></h3>-->
                    <!--                            <span class="collection__number">ERC-721</span>-->
                    <!--                        </div>-->
                    <!--                    </div>-->
                </div>

                <button class="main__nav main__nav--prev" data-nav="#collections" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M17,11H9.41l3.3-3.29a1,1,0,1,0-1.42-1.42l-5,5a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l5,5a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L9.41,13H17a1,1,0,0,0,0-2Z"/>
                    </svg>
                </button>
                <button class="main__nav main__nav--next" data-nav="#collections" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"/>
                    </svg>
                </button>
            </div>
        </div>
        <!-- end carousel -->
    </section>
</div>


<style>

    /*==============================
        Сollection
    ==============================*/
    .collection {
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

    .collection__cover {
        width: 100%;
        height: 110px;
        background-color: #222227;
    }

    .collection__meta {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        padding: 0 20px 20px;
        background-color: #16151a;
        border-radius: 0 0 16px 16px;
        border: 1px solid #222227;
    }

    .collection__avatar {
        display: block;
        width: 60px;
        height: 60px;
        border-radius: 16px;
        margin-top: -30px;
        margin-bottom: 10px;
        position: relative;
    }

    .collection__avatar img {
        width: 100%;
        border-radius: 16px;
        border: 1px solid #16151a;
    }

    .collection__avatar--verified:after {
        content: '';
        position: absolute;
        display: block;
        width: 20px;
        height: 20px;
        border: 2px solid #fff;
        bottom: -2px;
        right: -2px;
        border-radius: 50%;
        background: url("../img/verified.svg") no-repeat center #2f80ed;
        background-size: 14px auto;
        z-index: 1;
        pointer-events: none;
    }

    .collection__name {
        display: block;
        width: 100%;
        text-align: center;
        font-size: 16px;
        color: #fff;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        margin-bottom: 5px;
    }

    .collection__name a {
        color: #fff;
    }

    .collection__name a:hover {
        color: #AC1E21;
    }

    .collection__number {
        display: block;
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #bdbdbd;
        font-weight: 400;
    }

    @media (min-width: 768px) {
        .collection {
            margin-top: 30px;
        }
    }

</style>
