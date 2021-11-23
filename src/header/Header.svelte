<script lang="ts">
    import Web3Modal from "web3modal";
    import { ethers } from "ethers";
    import { connectedAccount, connectedSigner, ceramicProvider } from "../stores/connection.store.ts";
    import { toTokenUnitAmount } from "../utils";
    import { login, logOut, isLogged } from "../scripts/moralis";
    import { CHAIN_IDS } from "../constants";
    import SwalW from 'sweetalert2';
    import { authenticatedClient } from "../scripts/ceramic";

    const Swal: any = SwalW;

    let buttonText = "Connect";
    let moralisButton = "Sign In";

    let isConnected = false;
    let account = "";
    let matic = "";
    let accountSubstr = "";
    let callback = () => {
    };
    let web3ModalProvider;

    let wc = (window as any).WalletConnectProvider.default;

    let user;

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })


    const onButtonClick = () => {
        callback();
    };

    let loggedInMoralis = isLogged();

    console.log("loggedInMoralis", loggedInMoralis, isConnected);

    const moralisLogin = async () => {
        moralisButton = "Logging ..."

        user = await login()
        Toast.fire({
            icon: 'success',
            title: "Connected to Ceramic & Moralis !"
        })

        moralisButton = "Sign Out"
        loggedInMoralis = true;
    }

    const onSign = async () => {
        console.log("<< LOGG IN", loggedInMoralis);
        if (!loggedInMoralis) {
            await moralisLogin()
            loggedInMoralis = true;
        } else {
            await logOut()
            moralisButton = "Sign In"
            loggedInMoralis = false;
        }
    }

    try {
        const web3Modal = new Web3Modal({
            network: "polygon",
            cacheProvider: true,
            providerOptions: {
                walletconnect: {
                    package: wc,
                    options: {
                        // bridge: 'wss://pancakeswap.bridge.walletconnect.org/',
                        // rpc: {
                        //     0x38: "https://bsc-dataseed.binance.org/", https://polygon-rpc.com , https://rpc-mumbai.matic.today
                        // },
                    }
                },
            },
            disableInjectedProvider: false,
        });

        const signIn = async () => {
            authenticatedClient().then((cer) => {
                ceramicProvider.update(() => cer);
                console.log("<<< CONNECTED TO CERAMIC >>>", cer);
            })

            moralisLogin();
        }

        const fetchAccountData = async () => {
            const provider = new ethers.providers.Web3Provider(
                web3ModalProvider
            );
            const { chainId } = await provider.getNetwork();
            console.log("<<< CHAIN >>> ", chainId);
            if (!CHAIN_IDS.includes("" + chainId)) {
                console.error("Wrong Chain !", chainId);
                Toast.fire({
                    icon: 'error',
                    title: "Must be on Polygon Mumbai"
                })
                return;
            }
            Swal.close();
            const signer = provider.getSigner();

            connectedSigner.update(() => signer);
            const myAccount = await signer.getAddress();
            connectedAccount.update(() => myAccount);
            account = myAccount;
            const firstSubstr = account.substr(0, 6);
            const secondSubstr = account.substr(account.length - 5, account.length);
            accountSubstr = firstSubstr + "..." + secondSubstr;
            matic = toTokenUnitAmount((await signer.getBalance()).toString()).toFixed(4);
        }

        const connectCallback = async () => {
            try {
                web3ModalProvider = await web3Modal.connect();
            } catch (error) {
                alert(error.message || error);
                return;
            }

            buttonText = "Disconnect";
            callback = disconnectCallback;

            web3ModalProvider.on("accountsChanged", async () => {
                if (isConnected) {
                    await fetchAccountData();
                }
            });

            // Subscribe to chainId change
            web3ModalProvider.on("chainChanged", async (chainId: number) => {
                console.log("<<< CHAIN CHANGED >>> ", chainId);
                if (isConnected) {
                    await fetchAccountData();
                }
            });

            await fetchAccountData();
            await signIn()
            isConnected = true;
        };

        const disconnectCallback = async () => {
            await web3Modal.clearCachedProvider();
            delete localStorage.walletconnect;

            if (web3ModalProvider.close) {
                await web3ModalProvider.close();
                web3ModalProvider = null;
            }

            buttonText = "Connect";
            callback = connectCallback;
            connectedAccount.update(() => "");
            connectedSigner.update(() => undefined);
            isConnected = false;
            account = "";
            accountSubstr = "";
        };

        callback = connectCallback;

        if (web3Modal.cachedProvider) {
            connectCallback();
        }
    } catch (error) {
        console.log(error);
    }


    let expand = false;

    const handle = (event) => {
        if (
            event.target !== document.getElementById("my-menu")
            && event.target !== document.getElementById("ham")
        ) {
            toggleHeader();
        }
    }

    const toggleHeader = () => {
        expand = !expand;

        if (expand) {
            console.log("Subscribing");
            setTimeout(() => {
                window.addEventListener("click", handle, true)
            })
        } else {
            console.log("BB");
            setTimeout(() => {
                window.removeEventListener("click", handle, true);
            });
        }
    }
</script>

<header class="header">
    <div class="header__content">
        <div class="header__logo">
            <a href="/#">
                <img src="./logo/dylogo1.png" alt="">
            </a>
        </div>

        <div id="my-menu" class={`header__menu ${expand ? "header__menu--active" : ""}`}>
            <ul class="header__nav">
                <li class="header__nav-item">
                    <a href="/#/explore" class="header__nav-link">Explore</a>
                </li>
                <li class="header__nav-item">
                    <a href="/#/collections" class="header__nav-link">Collections</a>
                </li>
                <li class="header__nav-item">
                    <a href="/#/mint" class="header__nav-link">Mint</a>
                </li>
                <li class="header__nav-item">
                    <a href="/#/faq" class="header__nav-link">FAQ</a>
                </li>
            </ul>
        </div>

        <!--connect-->
        <div class="header__actions">
            {#if isConnected}
                <div class="header__action header__action--profile">
                    <a class="header__profile-btn header__profile-btn--verified" href="#" role="button"
                       id="dropdownMenuProfile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src="./img/avatars/avatar5.jpg" alt="">
                        <div>
                            <p id="account">
                                <a>{accountSubstr}</a>
                            </p>
                            <span style="font-size: 11px;">{matic} MATIC </span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59A1,1,0,0,0,17,9.17Z"></path>
                        </svg>
                    </a>

                    <ul class="dropdown-menu header__profile-menu" aria-labelledby="dropdownMenuProfile">
                        <li><a href="/#/myNFTs">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1,1,0,0,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1A10,10,0,0,0,15.71,12.71ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z"/>
                            </svg>
                            <span>My NFTs</span></a></li>
                        <li><a href="/#/myCollections">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1,1,0,0,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1A10,10,0,0,0,15.71,12.71ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z"/>
                            </svg>
                            <span>My Collections</span></a></li>
                        <li><a href={`https://mumbai.polygonscan.com//address/${account}`} target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M3.71,16.29a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21,1,1,0,0,0-.21.33,1,1,0,0,0,.21,1.09,1.15,1.15,0,0,0,.33.21.94.94,0,0,0,.76,0,1.15,1.15,0,0,0,.33-.21,1,1,0,0,0,.21-1.09A1,1,0,0,0,3.71,16.29ZM7,8H21a1,1,0,0,0,0-2H7A1,1,0,0,0,7,8ZM3.71,11.29a1,1,0,0,0-1.09-.21,1.15,1.15,0,0,0-.33.21,1,1,0,0,0-.21.33.94.94,0,0,0,0,.76,1.15,1.15,0,0,0,.21.33,1.15,1.15,0,0,0,.33.21.94.94,0,0,0,.76,0,1.15,1.15,0,0,0,.33-.21,1.15,1.15,0,0,0,.21-.33.94.94,0,0,0,0-.76A1,1,0,0,0,3.71,11.29ZM21,11H7a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2ZM3.71,6.29a1,1,0,0,0-.33-.21,1,1,0,0,0-1.09.21,1.15,1.15,0,0,0-.21.33.94.94,0,0,0,0,.76,1.15,1.15,0,0,0,.21.33,1.15,1.15,0,0,0,.33.21,1,1,0,0,0,1.09-.21,1.15,1.15,0,0,0,.21-.33.94.94,0,0,0,0-.76A1.15,1.15,0,0,0,3.71,6.29ZM21,16H7a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"/>
                            </svg>
                            <span>PolygonScan</span></a></li>
                        <li><a href="/#/createCollection">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M10,13H4a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14A1,1,0,0,0,10,13ZM9,19H5V15H9ZM20,3H14a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V4A1,1,0,0,0,20,3ZM19,9H15V5h4Zm1,7H18V14a1,1,0,0,0-2,0v2H14a1,1,0,0,0,0,2h2v2a1,1,0,0,0,2,0V18h2a1,1,0,0,0,0-2ZM10,3H4A1,1,0,0,0,3,4v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V4A1,1,0,0,0,10,3ZM9,9H5V5H9Z"/>
                            </svg>
                            <span>New Collection</span></a></li>
                        <!-- <li><a href="#/history">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M19.9,12.66a1,1,0,0,1,0-1.32L21.18,9.9a1,1,0,0,0,.12-1.17l-2-3.46a1,1,0,0,0-1.07-.48l-1.88.38a1,1,0,0,1-1.15-.66l-.61-1.83A1,1,0,0,0,13.64,2h-4a1,1,0,0,0-1,.68L8.08,4.51a1,1,0,0,1-1.15.66L5,4.79A1,1,0,0,0,4,5.27L2,8.73A1,1,0,0,0,2.1,9.9l1.27,1.44a1,1,0,0,1,0,1.32L2.1,14.1A1,1,0,0,0,2,15.27l2,3.46a1,1,0,0,0,1.07.48l1.88-.38a1,1,0,0,1,1.15.66l.61,1.83a1,1,0,0,0,1,.68h4a1,1,0,0,0,.95-.68l.61-1.83a1,1,0,0,1,1.15-.66l1.88.38a1,1,0,0,0,1.07-.48l2-3.46a1,1,0,0,0-.12-1.17ZM18.41,14l.8.9-1.28,2.22-1.18-.24a3,3,0,0,0-3.45,2L12.92,20H10.36L10,18.86a3,3,0,0,0-3.45-2l-1.18.24L4.07,14.89l.8-.9a3,3,0,0,0,0-4l-.8-.9L5.35,6.89l1.18.24a3,3,0,0,0,3.45-2L10.36,4h2.56l.38,1.14a3,3,0,0,0,3.45,2l1.18-.24,1.28,2.22-.8.9A3,3,0,0,0,18.41,14ZM11.64,8a4,4,0,1,0,4,4A4,4,0,0,0,11.64,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,11.64,14Z"/>
                            </svg>
                            <span>History</span></a></li> -->
                        <li><a on:click={onButtonClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M4,12a1,1,0,0,0,1,1h7.59l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H5A1,1,0,0,0,4,12ZM17,2H7A3,3,0,0,0,4,5V8A1,1,0,0,0,6,8V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V5A3,3,0,0,0,17,2Z"/>
                            </svg>
                            <span style="cursor: pointer">Disconnect</span></a></li>
                        <li><a on:click={onSign}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M4,12a1,1,0,0,0,1,1h7.59l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H5A1,1,0,0,0,4,12ZM17,2H7A3,3,0,0,0,4,5V8A1,1,0,0,0,6,8V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V5A3,3,0,0,0,17,2Z"/>
                            </svg>
                            <span style="cursor: pointer">Sign Out</span></a></li>
                    </ul>
                </div>
            {:else}
                <div class="header__action header__action--signin">
                    <a class="header__action-btn header__action-btn--signin" on:click={onButtonClick}>
                        <span>{buttonText}</span>
                    </a>
                </div>
            {/if}

            {#if isConnected && !loggedInMoralis}
                <div class="header__action header__action--signin">
                    <a class="header__action-btn header__action-btn--signin" on:click={onSign}>
                        <span>{moralisButton}</span>
                    </a>
                </div>
            {/if}
        </div>

        <button id="ham" on:click={toggleHeader} class={`header__btn ${expand ? "header__btn--active" : ""}`}
                type="button">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</header>

<style>
    #account > a {
        color: white;
        font-size: 12px;
    }

    #account {
        color: white;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 120px;
    }

    .header {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: auto;
        height: 70px;
        background-color: #16151a;
        border-bottom: 1px solid #222227;
        z-index: 101;
    }

    .header__content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 70px;
        width: 100%;
        position: relative;
        padding: 0 15px;
    }

    .header__logo {
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        height: 40px;
    }

    .header__logo img {
        width: auto;
        height: 57px;
        display: block;
    }

    .header__actions {
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        width: auto;
        margin-left: auto;
        margin-right: 42px;
    }

    .header__action {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 22px;
        position: relative;
        margin-left: 20px;
    }

    .header__action:first-child {
        margin-left: 0;
    }

    .header__action--profile {
        width: auto;
    }

    .header__action-btn {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 36px;
        width: 100%;
        cursor: pointer;
    }

    .header__action-btn span {
        display: block;
        white-space: nowrap;
        color: #fff;
        font-size: 14px;
        /*margin-right: 10px;*/
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        transition: color 0.5s ease;
    }

    .header__action-btn svg {
        /*width: 22px;*/
        /*height: auto;*/
        /*fill: #bdbdbd;*/
        /*transition: fill 0.5s ease;*/
    }

    .header__action--signin:before {
        content: '';
        position: absolute;
        display: block;
        width: 1px;
        height: 24px;
        background-color: #222227;
        top: 50%;
        left: 0;
        margin-top: -11px;
    }

    .header__action-btn--signin {
        background-color: #AC1E21;
        border-radius: 12px;
        padding: 0 20px;
    }

    .header__action--signin {
        width: auto;
        padding-left: 22px;
    }

    .header__action-btn:hover svg {
        fill: #fff;
    }

    .header__btn {
        position: absolute;
        width: 22px;
        height: 22px;
        display: block;
        right: 15px;
        top: 24px;
    }

    .header__btn span {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        right: 0;
        width: 22px;
        height: 2px;
        background-color: #bdbdbd;
        border-radius: 2px;
        transition: 0.5s ease;
        transition-property: width, background-color;
    }

    .header__btn span:first-child {
        top: 0;
    }

    .header__btn span:nth-child(2) {
        top: 10px;
        width: 16px;
    }

    .header__btn span:last-child {
        top: 20px;
        width: 10px;
    }

    .header__btn:hover span {
        background-color: #AC1E21;
    }

    .header__btn--active span {
        background-color: #AC1E21;
    }

    .header__btn--active span:nth-child(2) {
        width: 22px;
    }

    .header__btn--active span:last-child {
        width: 22px;
    }

    .header__search {
        position: absolute;
        left: 0;
        top: -71px;
        width: 100%;
        height: 70px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        background-color: #16151a;
        z-index: 1;
        padding: 0 15px;
        border-bottom: 1px solid #222227;
        transition: top 0.5s ease;
    }

    .header__search input {
        width: calc(100% - 30px);
        height: 40px;
        background-color: #222227;
        color: #fff;
        font-size: 14px;
        border-radius: 12px;
        border: none;
        padding: 0 45px 0 20px;
        font-family: 'Inter', sans-serif;
        font-weight: 400;
    }

    .header__search input:focus {
        border-color: #fff;
    }

    .header__search button {
        position: absolute;
        right: 60px;
        top: 15px;
        height: 40px;
        width: auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .header__search button svg {
        width: 20px;
        height: auto;
        fill: #bdbdbd;
        transition: 0.5s ease;
    }

    .header__search button:hover svg {
        fill: #AC1E21;
    }

    .header__search button.close {
        right: 15px;
    }

    .header__search--active {
        top: 0;
    }

    .header__menu {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        position: fixed;
        top: 70px;
        right: 0;
        bottom: 0;
        background-color: #16151a;
        z-index: 99;
        width: 280px;
        padding: 25px 25px 0;
        transform: translate3d(281px, 0, 0);
        transition: transform 0.5s ease;
        border-left: 1px solid #222227;
    }

    .header__menu--active {
        transform: translate3d(0, 0, 0);
    }

    .header__nav {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        position: relative;
    }

    .header__nav-item {
        margin-bottom: 20px;
        position: relative;
    }

    .header__nav-item:last-child {
        margin-bottom: 0;
    }

    .header__nav-link {
        font-size: 14px;
        color: #bdbdbd;
        line-height: 22px;
        height: 22px;
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-weight: 400;
        font-family: 'Inter', sans-serif;
    }

    .header__nav-link svg {
        fill: #bdbdbd;
        width: 14px;
        height: auto;
        transition: fill 0.5s ease;
        margin-left: 1px;
        margin-top: 2px;
    }

    .header__nav-link--menu svg {
        width: 20px;
        margin-top: 0;
        margin-left: 0;
    }

    .header__nav-link--active {
        color: #AC1E21;
        cursor: default;
        font-weight: 500;
    }

    .header__nav-link--active:hover {
        color: #AC1E21 !important;
    }

    .header__nav-link:hover,
    .header__nav-link[aria-expanded="true"] {
        color: #fff;
    }

    .header__nav-link:hover svg,
    .header__nav-link[aria-expanded="true"] svg {
        fill: #AC1E21;
    }

    .header__nav-menu {
        display: block;
        position: absolute !important;
        z-index: -1;
        pointer-events: none;
        opacity: 0;
        top: 0;
        background-color: #16151a;
        border-radius: 16px;
        padding: 0 20px;
        width: 200px;
        transition: opacity 0.5s ease;
        transform: translate3d(0px, 22px, 0px);
        margin-top: 10px;
        height: auto;
        border: 1px solid #222227;
    }

    .header__nav-menu .header__nav-menu {
        margin-top: 5px;
        margin-left: 20px;
    }

    .header__nav-menu li {
        position: relative;
        margin-bottom: 15px;
    }

    .header__nav-menu li:first-child {
        padding-top: 20px;
    }

    .header__nav-menu li:last-child {
        margin-bottom: 0;
        padding-bottom: 20px;
    }

    .header__nav-menu a {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        color: #bdbdbd;
        font-size: 14px;
        font-weight: 400;
        transition: color 0.5s ease;
        position: relative;
        font-family: 'Inter', sans-serif;
    }

    .header__nav-menu a svg {
        fill: #bdbdbd;
        width: 14px;
        height: auto;
        transition: 0.5s ease;
        margin-left: 1px;
        margin-top: 2px;
    }

    .header__nav-menu a:hover,
    .header__nav-menu a[aria-expanded="true"] {
        color: #fff;
    }

    .header__nav-menu a:hover svg,
    .header__nav-menu a[aria-expanded="true"] svg {
        fill: #AC1E21;
    }

    .header__nav-menu.show {
        z-index: 1000;
        pointer-events: auto;
        opacity: 1;
    }

    .header__profile-btn {
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        position: relative;
        padding: 0 6px 0 6px;
        height: 54px;
        border: 1px solid #222227;
        border-radius: 16px;
    }

    .header__profile-btn--verified:after {
        content: '';
        position: absolute;
        display: none;
        width: 18px;
        height: 18px;
        border: 2px solid #fff;
        bottom: 5px;
        left: 30px;
        border-radius: 50%;
        background: url("img/verified.svg") no-repeat center #2f80ed;
        background-size: 14px auto;
        z-index: 1;
        pointer-events: none;
    }

    .header__profile-btn img {
        display: none;
        width: 40px !important;
        height: 40px;
        border-radius: 12px;
        margin-right: 6px;
    }

    .header__profile-btn div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        margin-left: 6px;
    }

    .header__profile-btn p {
        margin-bottom: 0;
        line-height: 22px;
        font-size: 14px;
        color: #fff;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    }

    .header__profile-btn span {
        font-size: 12px;
        color: #bdbdbd;
        line-height: 18px;
    }

    .header__profile-btn svg {
        fill: #bdbdbd;
        width: 16px;
        height: auto;
        transition: fill 0.5s ease;
        margin-left: 6px;
        margin-top: 2px;
    }

    .header__profile-btn:hover {
        border-color: #AC1E21;
    }

    .header__profile-btn:hover svg,
    .header__profile-btn[aria-expanded="true"] svg {
        fill: #AC1E21;
    }

    .header__profile-menu {
        display: block;
        position: absolute !important;
        z-index: -1;
        pointer-events: none;
        opacity: 0;
        top: 0;
        background-color: #16151a;
        border-radius: 16px;
        padding: 20px;
        min-width: 180px;
        transition: opacity 0.5s ease;
        transform: translate3d(0px, 54px, 0px) !important;
        height: auto;
        border: 1px solid #222227;
        right: 0 !important;
        left: auto !important;
        margin-top: 2px;
    }

    .header__profile-menu li {
        margin-bottom: 15px;
        width: 100%;
    }

    .header__profile-menu li:last-child {
        margin-bottom: 0;
    }

    .header__profile-menu li:last-child {
        padding-top: 15px;
        border-top: 1px solid #222227;
    }

    .header__profile-menu a {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        color: #bdbdbd;
        font-size: 14px;
        font-weight: 400;
        transition: color 0.5s ease;
        position: relative;
        font-family: 'Inter', sans-serif;
    }

    .header__profile-menu a svg {
        fill: #fff;
        width: 20px;
        height: auto;
        transition: fill 0.5s ease;
        margin-right: 10px;
    }

    .header__profile-menu a:hover {
        color: #fff;
    }

    .header__profile-menu a:hover svg {
        fill: #AC1E21;
    }

    .header__profile-menu.show {
        z-index: 1000;
        pointer-events: auto;
        opacity: 1;
    }

    @media (min-width: 576px) {
        .header__action--signin {
            width: auto;
            padding-left: 22px;
        }

        .header__action--signin:hover a span,
        .header__action--signin:hover button span {
            color: #fff;
        }

        .header__action--signin:hover a svg,
        .header__action--signin:hover button svg {
            fill: #AC1E21;
        }

        .header__action-btn span {
            display: block;
            white-space: nowrap;
            /*color: #bdbdbd;*/
            font-size: 14px;
            /*margin-right: 10px;*/
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            transition: color 0.5s ease;
        }

        .header__action-btn--signin {
            background-color: #AC1E21;
            border-radius: 12px;
            padding: 0 20px;
        }

        .header__action-btn--signin span {
            margin-right: 0;
            color: #fff;
        }

        .header__action-btn--signin svg {
            display: none;
        }

        .header__action-btn--signin:hover {
            background-color: #222227;
        }

        .header__action-btn--signin:hover span {
            color: #AC1E21;
        }

        .header__content {
            padding: 0 30px;
        }

        .header__search {
            padding: 0 30px;
        }

        .header__search button {
            right: 75px;
        }

        .header__search button.close {
            right: 30px;
        }

        .header__btn {
            right: 30px;
        }

        .header__profile-btn img {
            display: block;
        }

        .header__profile-btn--verified:after {
            display: block;
        }
    }

    @media (min-width: 768px) {
        .header__action {
            margin-left: 30px;
        }

        .header__action--signin {
            padding-left: 32px;
        }

        .header__actions {
            margin-right: 52px;
        }
    }

    @media (min-width: 1200px) {
        .header__logo {
            width: auto;
            margin-right: 50px;
        }

        .header__btn {
            display: none;
        }

        .header__content {
            padding: 0 50px;
        }

        .header__actions {
            margin-right: 0;
        }

        .header__action--search {
            display: none;
        }

        .header__action--signin {
            padding-left: 0;
        }

        .header__action--signin:before {
            display: none;
        }

        .header__action-btn svg {
            fill: #AC1E21;
        }

        .header__action-btn--signin {
            height: 40px;
            min-width: 100px;
        }

        .header__search {
            position: relative;
            top: auto;
            left: auto;
            width: 280px;
            padding: 0;
            border: none;
            background-color: transparent;
        }

        .header__search input {
            padding: 0 60px 0 20px;
            width: 100%;
        }

        .header__search button {
            right: 20px;
        }

        .header__search button.close {
            display: none;
        }

        .header__search--active {
            top: auto;
        }

        .header__menu {
            flex-direction: row;
            align-items: center;
            width: auto;
            padding: 0;
            position: relative;
            top: auto;
            right: auto;
            bottom: auto;
            background-color: transparent;
            transform: translate3d(0, 0, 0);
            border: none;
            transition: transform 0s ease;
        }

        .header__nav {
            flex-direction: row;
            align-items: center;
            width: auto;
        }

        .header__nav-item {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            height: 70px;
            margin-bottom: 0;
            margin-left: 30px;
        }

        .header__nav-menu {
            transform: translate3d(0px, 46px, 0px);
        }

        .header__nav-menu .header__nav-menu {
            transform: translate3d(0px, 22px, 0px);
        }
    }

    @media (min-width: 1440px) {
        .header__search {
            width: 360px;
        }
    }
</style>
