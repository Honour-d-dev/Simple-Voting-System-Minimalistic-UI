import { useState } from "react";
import { IoChevronUpSharp } from "react-icons/io5";

export type CampaignObject = {
  title: string;
  parties: string[];
  campaignmanager: string;
  ongoing: boolean;
};

type CampaignListProp = {
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  load: React.Dispatch<React.SetStateAction<boolean>>;
  list: CampaignObject[] | undefined;
};

export const CampaignList = ({ setIndex, load, list }: CampaignListProp) => {
  const [showlist, setShowlist] = useState(false);

  return (
    <div className="relative flex max-h-full min-h-[140px] w-[70vw] max-w-sm flex-col overflow-y-auto">
      <button
        className="sticky top-0 z-10 flex items-center justify-center gap-2 rounded bg-zinc-500 p-2 ring-1 ring-zinc-100/75"
        onClick={() => setShowlist(!showlist)}
      >
        Campaigns
        <IoChevronUpSharp className={`${showlist && "rotate-180 transform"}`} />
      </button>
      {showlist && (
        <div className=" flex flex-col items-center bg-zinc-100/75 p-1">
          {list?.map((campaign, index) => {
            return (
              <div
                className={`${campaign.ongoing ? "flex" : "hidden"} w-full flex-col items-center justify-center p-2`}
                key={index}
              >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
                  {campaign.title}
                </span>
                <button
                  className="flex w-full justify-center rounded bg-zinc-500 p-2"
                  onClick={() => {
                    setIndex(index);
                    load(true);
                  }}
                >
                  load
                </button>
              </div>
            );
          })}
          <button
            className="sticky bottom-0 mt-4 w-full justify-center rounded bg-zinc-500 p-2 ring-1 ring-zinc-100/75"
            onClick={() => load(false)}
          >
            create new
          </button>
        </div>
      )}
    </div>
  );
};
