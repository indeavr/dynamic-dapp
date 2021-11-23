import axios from "axios";
import { NFTStorage, FormData } from "nft.storage";

const nftStorageApiKey = import.meta.env.VITE_NFT_STORAGE_KEY as any;
const apiUrl = import.meta.env.VITE_API_URL as any;

const client = new NFTStorage({ token: nftStorageApiKey });


console.log("apiUrl", apiUrl)
export const mainAxios = axios.create({
    baseURL: apiUrl,
});

export const generateMetadata = async (body, file): Promise<string> => {
    try {
        const metadata = await client.store({
            ...body,
            image: file
        })

        console.log("metadata", metadata)
        console.log("file", metadata.url)

        return metadata.url;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const generateMetadataWithoutImage = async (body): Promise<string> => {
    const { image, ...rest } = body;
    const parsedBody = { ...rest, file_url: image };

    console.log("<<< generateMetadataWithoutImage >>>", parsedBody);
    try {
        const response = await axios.create().post("https://api.nftport.xyz/v0/metadata", parsedBody, {
            headers: {
                "Authorization": import.meta.env.VITE_NFT_PORT_KEY as any,
            },
        })

        console.log("RESPONSE gen2", response);
        const { metadata_uri } = response.data;

        console.log(metadata_uri);
        if (!metadata_uri) {
            console.error("NADA2");
            return undefined;
        }

        return metadata_uri

    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export const generateMetadataImage = async (file: File): Promise<string | undefined> => {
    console.log("<<< generateMetadataImage >>>", file);
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.create().post("https://api.nftport.xyz/v0/files", formData, {
            headers: {
                "Authorization": import.meta.env.VITE_NFT_PORT_KEY as any,
            },
        })

        console.log("RESPONSE gen", response);
        const { ipfs_url } = response.data;

        if (!ipfs_url) {
            console.error("NADA");
            return undefined;
        }
        const uri = `${ipfs_url.replace("https://ipfs.io/ipfs/", "ipfs://")}/`;
        return uri

    } catch (error) {
        console.error(error);
        return undefined;
    }
};
