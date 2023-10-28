import { ethers } from "ethers";

type NewCampaignProp = {
  contract: ethers.Contract | undefined;
  creatingCampaign: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NewCampaign = ({ contract, creatingCampaign }: NewCampaignProp) => {
  const create = async () => {
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const parties = (document.getElementById("parties") as HTMLInputElement).value
      .trim()
      .split(",")
      .filter((party) => party !== "");
    await contract?.createCampaign(title, parties);
    creatingCampaign(true);
  };
  return (
    <div className="flex min-w-[350px] flex-col rounded p-4 shadow-md dark:shadow-slate-500">
      <h1 className="mb-4 border-b border-zinc-500 text-3xl">Create a voting campaign</h1>
      <label className="font-medium" htmlFor="title">
        Title
      </label>
      <input
        className="mb-4 h-8 rounded placeholder:text-center"
        id="title"
        type="text"
        placeholder="The title of the voting Campaign"
      />
      <label className="font-medium" htmlFor="parties">
        Parties
      </label>
      <input
        className="mb-4 h-8 rounded placeholder:text-center"
        id="parties"
        type="text"
        placeholder="Comma seperated e.g. party A, party B, "
      />
      <button className="flex grow justify-center rounded bg-zinc-500 p-2" onClick={() => create()}>
        create
      </button>
    </div>
  );
};
