import { Contract } from "ethers";
import { DYNAMIC_NFT_ABI } from "../abi";
import { getJSON } from "../utils";

export const getNFTInfo = async (rpc, moralisRes, contract) => {
    const DYContract = new Contract(contract.trim(), DYNAMIC_NFT_ABI, rpc.signer);

    const nfts = await Promise.all(
        moralisRes.map(async (res) => {
            let metadata = JSON.parse(res.metadata);
            if (!metadata) {
                metadata = await getJSON(res.token_uri);
            }

            const raw = await DYContract.tokenURI(res.token_id);
            if (!raw) {
                return;
            }

            console.log("-=raw", raw);
            const meta = await getJSON(raw.replace("ipfs://", "https://ipfs.io/ipfs/")) as any;
            const imageUri = meta.image.replace("ipfs://", "https://ipfs.io/ipfs/")

            // const imageUri = metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/");

            return {
                tokenURI: res.token_uri,
                metadata,
                imageUri,
                owner: res,
                name: res.name,
                id: res.token_id
            }
        })
    );

    return nfts;
}
