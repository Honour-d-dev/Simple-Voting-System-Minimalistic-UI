// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SimpleVotingSystem {

    struct Campaign {
        string title;
        string[] parties;
        address campaignManager;
        bool ongoing;
    }
    
    event Voted(address indexed voter ,uint indexed campaignId );
    event CampaignCreated(uint indexed campaignId );
    event CampaignEnded(uint indexed campaignId );

    Campaign[] campaigns;
    mapping(uint => mapping(string => uint)) votes;
    mapping(uint => mapping(address => bool)) hasVoted;

    function createCampaign (string memory title, string[] memory parties) external {
        require(parties.length > 1, "there must be more than 1 party");
        campaigns.push(Campaign(title, parties, msg.sender, true));
        emit CampaignCreated(campaigns.length-1);
    }

    function vote (uint campaign, string memory party) external {
        require(!hasVoted[campaign][msg.sender], "already voted on this campaign");
        require(campaign < campaigns.length," this campaign does not exist");
        require(campaigns[campaign].ongoing, "this campaign has ended");
        votes[campaign][party] += 1;
        hasVoted[campaign][msg.sender] = true;
        emit Voted(msg.sender,campaign );
    }

    function endCampaign (uint campaign) external {
        require(campaigns[campaign].campaignManager == msg.sender, "not the Campaign Manager");
        campaigns[campaign].ongoing = false;
        emit CampaignEnded(campaign);
    }

    function getCampaigns() external view returns(Campaign[] memory) {
        return campaigns;
    }

    function getCampaignResults(uint campaign) external view returns(uint[] memory) {
        uint[] memory _votes = new uint[](campaigns[campaign].parties.length);
        for(uint i = 0; i < campaigns[campaign].parties.length; i++){
            _votes[i] = votes[campaign][campaigns[campaign].parties[i]];
        }

        return _votes;
    }

    function voted(uint campaign ) external view returns (bool) {
        return hasVoted[campaign][msg.sender];
    }

}