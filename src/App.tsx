import { useState, useMemo, useEffect } from "react";
import { Campaign, CampaignList, NewCampaign, CampaignObject } from "./campaign";
import { Provider, address, abi } from "./contract/contractUtils";
import { ethers, JsonRpcSigner } from "ethers";
import loadingAnimation from "./assets/Ellipsis.svg";

function App() {
  const [loadedCampaign, setLoadedCampaign] = useState(false);
  const [campaignIndex, setCampaignIndex] = useState(0);

  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [list, setList] = useState<CampaignObject[]>();
  const [loading, setLoading] = useState(false);

  const contract = useMemo(() => {
    if (signer) return new ethers.Contract(address, abi, signer);
  }, [signer]);

  useEffect(() => {
    const getCampaigns = async () => {
      setList(await contract?.getCampaigns());
      setLoading(false);
    };

    getCampaigns();

    contract?.on("CampaignCreated", getCampaigns);

    contract?.on("CampaignEnded", getCampaigns);

    return () => {
      contract?.off("CampaignCreated");
      contract?.off("CampaignEnded");
    };
  }, [contract]);

  const connectWallet = async () => {
    const accounts = await Provider.send("eth_requestAccounts", []);
    if (accounts[0]) {
      setAccount(accounts[0]);
      setSigner(await Provider.getSigner(accounts[0]));
    }
  };

  (async () => console.log(await contract?.listenerCount()))();

  return (
    <div className="relative flex h-screen w-screen flex-col items-center gap-8 self-center p-4 pt-24 md:flex-row md:items-start md:justify-center md:pb-20 md:pt-32">
      <h1 className="fixed left-0 top-4 z-10 w-screen text-center text-4xl font-semibold">VoteDapp</h1>
      <div id="Header Band" className="fixed left-0 right-0 top-0 h-20 w-screen bg-zinc-500"></div>
      <button
        id="connect"
        className="fixed right-2 top-4 z-10 rounded bg-zinc-500 p-2 text-center ring-1 ring-white md:right-4"
        onClick={() => connectWallet()}
      >
        {account ? `${account.slice(0, 6)}...` : "connect"}
      </button>
      <div className="relative">
        <img
          className={`absolute right-[-10px] top-[-5px] ${loading ? "block" : "hidden"} `}
          src={loadingAnimation}
          alt="loading"
        />

        {loadedCampaign ? (
          <Campaign index={campaignIndex} contract={contract} campaign={list![campaignIndex]} inRequest={setLoading} />
        ) : (
          <NewCampaign contract={contract} creatingCampaign={setLoading} />
        )}
      </div>
      <CampaignList setIndex={setCampaignIndex} load={setLoadedCampaign} list={list} />
    </div>
  );
}

export default App;
