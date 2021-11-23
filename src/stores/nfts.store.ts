import type { Writable } from 'svelte/store';
import { writable, get } from 'svelte/store';
import { connectionProvider } from "./connection.store";
import type { Propositions, Collections, MyNFT, NFT } from "../types";
import { getCollections, getPropositions } from "../service/ceramics";
import { DYNAMIC_NFT_ABI } from "../abi";
import { Contract } from "ethers";
import { getJSON } from "../utils";
import { getNFTInfo } from "../service/helpers";
import { isLogged } from "../scripts/moralis";

declare const Moralis: any;

export const BATCH_SIZE = 15;

export type NFTStore = Writable<NFT[]> & {
    setInitial,
    getAll,
    clear
}

export type MyInfoStore = Writable<MyNFT[]> & {
    getInfo,
    getMyNFTs,
    clear
}

export type CollectionsStore = Writable<Collections> & {
    getAll,
    clear
}

export type PropositionsStore = Writable<Propositions> & {
    get,
    clear
}

export const nftStore = createNftStore();
export const totalNFTsCount = writable(0);

export let myInfoStore = createMyInfoStore();
export let collectionsStore = createCollectionsStore();
export let propositionsStore = createPropositionsStore();

function createNftStore(): NFTStore {
    const { subscribe, update, set } = writable([]);

    const setInitial = async () => {
        const rpc = get(connectionProvider);
        if (!rpc) {
            return;
        }
    }


    // https://ipfs.io/ipfs/bafybeihjwgphdmd2kuiggtjbp2het3rfhn5wcvhmp4i223ue454llonxfq/7237d93bfb0429d3f0abd5fccf0dff6f.jpg
    const getAll = async () => {
        const collections = get(collectionsStore);
        if (!collections || collections.length === 0) {
            return;
        }

        const rpc = get(connectionProvider);

        if (!rpc) {
            console.log("NOT CONNECTED !!!");
        }

        const isLoggedMoralis = isLogged();

        console.log("GET moralis logged ?", isLoggedMoralis);

        const collectionsData = await Promise.all(
            collections.map(async (coll, i) => {
                const options = { address: coll.contract, chain: "mumbai" };

                console.log("GET ALL NFTS", i, options);

                try {
                    const res = await Moralis.Web3API.token.getAllTokenIds(options);
                    console.log("->>> response", i, res);
                    const result = res.result;
                    console.log("result", i, result);

                    const nfts = await getNFTInfo(rpc, result, coll.contract);

                    return {
                        contract: coll.contract,
                        nfts
                    }
                } catch (err) {
                    console.error("MORALIS ERR", err)
                }
                return undefined;
            })
        );

        console.log("collectionsData", collectionsData);

        const res: MyNFT[] = collectionsData.reduce((arr, obj) => {
            if (obj) {
                obj.nfts.forEach((info) => {
                    if(info){
                        arr.push({
                            contract: obj.contract,
                            ...info
                        });
                    }
                })
                return arr;
            }
        }, [])
        console.log("========= FINAL RESULT NFTs =========", res);
        set(res);
    }

    const clear = () => set(undefined);

    return {
        subscribe, update, set,
        setInitial,
        getAll,
        clear,
    }
}


function createMyInfoStore(): MyInfoStore {
    const { subscribe, update, set } = writable([]);

    const getInfo = async () => {
        const rpc = get(connectionProvider);
        if (!rpc) {
            return;
        }


    }

    const getMyNFTs = async () => {
        const collections = get(collectionsStore);
        if (!collections) {
            return;
        }

        const rpc = get(connectionProvider);

        const nftMap = await Promise.all(
            collections.map(async (coll, i) => {

                const options = { chain: 'mumbai', address: rpc.account, token_address: coll.contract };
                console.log("-= Calling morallis", i, options);

                try {
                    const res = await Moralis.Web3API.account.getNFTsForContract(options);
                    console.log("-=>>> response", i, res);

                    const result = res?.result;
                    if (!result || result.length === 0) {
                        return;
                    }
                    console.log("-=polynftsonNFTs", i, result);

                    const nfts = await getNFTInfo(rpc, result, coll.contract);

                    return {
                        contract: coll.contract,
                        nfts
                    }
                } catch (err) {
                    console.error("MORALIS ERR", err)
                    return undefined;
                }
                // [
                //     {
                //         "token_address": "0x057Ec652A4F150f7FF94f089A38008f49a0DF88e",
                //         "token_id": "15",
                //         "contract_type": "ERC721",
                //         "owner_of": "0x057Ec652A4F150f7FF94f089A38008f49a0DF88e",
                //         "block_number": "88256",
                //         "block_number_minted": "88256",
                //         "token_uri": "string",
                //         "metadata": "string",
                //         "synced_at": "string",
                //         "amount": "1",
                //         "name": "CryptoKitties",
                //         "symbol": "RARI"
                //     }
                // ]
            })
        );

        if (!nftMap) {
            console.error("No NFTs yet !");
        }

        console.log("-=nftMap", nftMap);

        const flat: MyNFT[] = nftMap.filter(a => a !== undefined)
            .reduce((arr, obj) => {
                if (obj) {
                    obj.nfts.forEach((rest) => {
                        arr.push({
                            contract: obj.contract,
                            ...rest
                        });
                    })
                    return arr;
                }
            }, []);


        console.log("-=flat", flat);
        const withUpgrades = await Promise.all(flat.map(async (nft, i) => {
            const DYContract = new Contract(nft.contract.trim(), DYNAMIC_NFT_ABI, rpc.signer);

            const upgrades = await DYContract.getUpgrades(nft.id);
            console.log("-=upgrades", upgrades, i);

            const extended = await Promise.all(upgrades.map(async (str, i) => {
                const src = str.replace("ipfs://", "https://ipfs.io/ipfs/")

                const meta = (await getJSON(src));
                return {
                    src,
                    imageUri: (meta as any)?.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
                    index: i
                }
            }))
            return {
                ...nft,
                upgrades: extended
            }
        }));
        console.log("========= MY FINAL RESULT =========", withUpgrades);
        set(withUpgrades);
    }


    const clear = () => set([]);

    return {
        subscribe, update, set,
        getInfo,
        getMyNFTs,
        clear,
    }
}

function createCollectionsStore(): CollectionsStore {
    const { subscribe, update, set } = writable([] as Collections);

    const getAll = async () => {
        console.log("<<< FETCHING >>> ")
        const collections: Collections = await getCollections();

        console.log("{GET ALL} collections", collections);
        set(collections);
    }


    const clear = () => set([]);

    return {
        subscribe, update, set,
        getAll,
        clear,
    }
}

function createPropositionsStore(): PropositionsStore {
    const { subscribe, update, set } = writable([] as Propositions);

    const get = async ({ contract, id }) => {
        console.log("<<< FETCHING >>> ")
        const propositions: Propositions = await getPropositions({ contract, id });

        console.log("{GET} propositions", propositions);
        const props = propositions.map((prop) => ({
            ...prop,
            imageUri: prop.image.original.src.replace("ipfs://", "https://ipfs.io/ipfs/")
        }))
        return set(props);
    }


    const clear = () => set([]);

    return {
        subscribe, update, set,
        get,
        clear,
    }
}
