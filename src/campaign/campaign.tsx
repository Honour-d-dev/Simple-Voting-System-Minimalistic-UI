import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CampaignObject } from "./campaignList";

type CampaignProp = {
  index: number;
  contract: ethers.Contract | undefined;
  campaign: CampaignObject;
  inRequest: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Campaign = ({ index, contract, campaign, inRequest }: CampaignProp) => {
  const [results, setResults] = useState<number[]>();
  const [viewResults, setViewResult] = useState(false);

  useEffect(() => {
    const getResults = async () => {
      setResults(await contract?.getCampaignResults(index));
      inRequest(false);
    };

    getResults();

    contract?.once("Voted", getResults);
  }, [index, contract, inRequest]);

  const vote = async (party: string) => {
    await contract?.vote(index, party);
    inRequest(true);
  };

  const endCampaign = async () => {
    await contract?.endCampaign(index);
    inRequest(true);
  };

  return (
    <div className="flex w-[90vw] min-w-[350px] max-w-md flex-col items-center gap-2 rounded p-4 shadow-md dark:shadow-slate-400">
      <h1 className="border-b border-zinc-500 text-3xl font-medium">{campaign.title}</h1>
      <div className="max-h-32 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2 p-4">
          {campaign.parties.map((party, index) => {
            return (
              <button className="flex justify-center rounded bg-zinc-500 p-2" key={index} onClick={() => vote(party)}>
                Vote {party}
              </button>
            );
          })}
        </div>
      </div>
      <button
        className="flex w-full max-w-xs justify-center rounded bg-zinc-500 p-2"
        onClick={() => setViewResult(!viewResults)}
      >
        View Results
      </button>
      {viewResults && results && (
        <div className="overflow-x-auto">
          <table>
            <thead className=" border-b border-zinc-500">
              <tr>
                <th></th>
                {campaign.parties.map((party) => (
                  <th className="p-1" key={party}>
                    {party}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>votes</td>
                {results.map((result, i) => (
                  <td className="text-center" key={i}>
                    {result.toString()}
                  </td> //toString because result is a Bigint, js can't parse it
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <button className="flex w-full max-w-xs justify-center rounded bg-zinc-500 p-2" onClick={() => endCampaign()}>
        End Campaign
      </button>
    </div>
  );
};
