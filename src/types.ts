import type { Signer, Contract } from "ethers";

export interface Collection {
    title: string;
    description: string;
    contract: string;
}

export type Collections = Array<Collection>;

export interface Connection {
    signer: Signer;
    account: string;
    Factory: Contract;
}

export interface Upgrade {
    src: string;
    index: number;
}

export interface MyNFT {
    contract: string;
    id: string;
    tokenUri: string;
    imageUri: string;
    metadata: any;
    name: string;
    upgrades: Upgrade[];
}

// TODO define metadata
export interface NFT extends MyNFT {
    metadata: any;
    imageUri: string;
}

export interface Image {
    mimeType: string;
    src: string;
}

export interface ImageResult {
    original: {
        mimeType: string;
        src: string;
    },
    alternatives: []
}

export interface PropositionBody {
    id: string;
    contract: string;
    image: Image
};


export interface Proposition {
    id: string;
    contract: string;
    image: ImageResult,
    imageUri: string;
};

export type Propositions = Array<Proposition>;
