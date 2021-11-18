import Landing from "./pages/Main.svelte";
import NFT from "./pages/NFT.svelte";
import FAQ from "./pages/FAQ.svelte";
import Marketplace from "./pages/Marketplace.svelte";
import NotFound from "./pages/NotFound.svelte";
import MyNFTs from "./pages/MyNFTs.svelte";
import MyCollections from "./pages/MyCollections.svelte";
import CreateCollection from "./pages/CreateCollection.svelte";
import Mint from "./pages/Mint.svelte";

export const routes = {
    '/': Landing,
    '/explore': Marketplace,
    '/mint': Mint,
    '/createCollection': CreateCollection,
    '/faq': FAQ,
    '/myNFTs': MyNFTs,
    '/myCollections': MyCollections,
    '/nft/:contract/:id': NFT,
    '*': NotFound,
}
