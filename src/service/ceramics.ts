import { mainAxios } from "./api";
import type { Collections, PropositionBody, Propositions } from "../types";

export async function getServerDID() {
    try {
        const response = await mainAxios({
            method: "get",
            url: "/api/server-did",
        });

        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error };
    }
}

export async function getJsonModel() {
    try {
        const response = await mainAxios({
            method: "get",
            url: "/api/json-model",
        });

        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error };
    }
}

export const getCollections = async (): Promise<Collections> => {
    try {
        const response = await mainAxios({
            method: "get",
            url: "/api/collection",
        });

        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }

    // const { ceramic, idx, serverDid } = client;
    // console.log("DID", serverDid)
    //
    // try {
    //     const { list } = await idx.get("collectionsList", serverDid);
    //
    //     console.log("list", list);
    //
    //     const result = [];
    //     for (const item of list) {
    //         const { content } = await ceramic.loadStream(item.id);
    //         result.push(content);
    //     }
    //
    //     return result;
    // } catch (error) {
    //     console.log(error);
    // }
};

export const addCollection = async (body) => {
    console.log("<<< addCollection >>>", body);
    try {
        const response = await mainAxios.post("/api/collection", { ...body })

        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error };
    }
};

export const addProposition = async (body: PropositionBody) => {
    console.log("<<< addProposition >>>", body);
    try {
        const response = await mainAxios.post("/api/proposition", { ...body })

        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error };
    }
};

export const deletePropositon = async (contract: string, id: string) => {
    console.log("<<< deletePropositon >>>", contract, id);
    try {
        const response = await mainAxios.delete("/api/proposition", { params: { contract, id, index: 0 } })

        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error };
    }
};

export const getPropositions = async (params: { id: string, contract: string }): Promise<Propositions> => {
    try {
        console.log("calling getPropositions", params);

        const response = await mainAxios.get("/api/proposition", { params });
        console.log("Res", response);
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};

