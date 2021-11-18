import { writable, derived } from 'svelte/store';
import { isNotZeroAddr } from "../utils";
import type { Connection } from "../types";
import { Contract } from "ethers";
import { FACTORY_ABI } from "../abi";
import { DY_FACTORY_ADDRESS } from "../constants";

export const connectedSigner = writable(undefined);
export const connectedAccount = writable("No account selected");
export const ceramicProvider = writable(undefined);

export const connectionProvider = derived([connectedSigner, connectedAccount], ([signer, account]): Connection => {
    if (!signer || !account || !isNotZeroAddr(account) || account === "No account selected") {
        return undefined;
    }

    const Factory = new Contract(DY_FACTORY_ADDRESS, FACTORY_ABI, signer);

    console.log("<<My Account>>", account);

    return {
        signer, account, Factory,
    };
})
