import { writable } from 'svelte/store';
import type { Proposition } from "../types";

export const collection = writable({
    contract: "",
    title: "",
    description: "",
    royalties: 0
})


export const nftMint = writable({
    name: "",
    file: "",
    description: ""
})

export const proposition = writable({} as Proposition)
