// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract QIEGrowthProof {
    struct GrowthBrief {
        address subject;
        uint96 readinessScore;
        bytes32 reportHash;
        string ecosystemAction;
        uint256 createdAt;
    }

    string public projectName;
    address public owner;
    uint256 public nextBriefId;

    mapping(uint256 => GrowthBrief) public briefs;

    event GrowthBriefRecorded(
        uint256 indexed briefId,
        address indexed subject,
        uint96 readinessScore,
        bytes32 reportHash,
        string ecosystemAction
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(string memory initialProjectName) {
        projectName = initialProjectName;
        owner = msg.sender;
    }

    function recordBrief(
        address subject,
        uint96 readinessScore,
        bytes32 reportHash,
        string calldata ecosystemAction
    ) external onlyOwner returns (uint256 briefId) {
        require(readinessScore <= 100, "Score too high");
        require(reportHash != bytes32(0), "Missing report hash");

        briefId = nextBriefId;
        briefs[briefId] = GrowthBrief({
            subject: subject,
            readinessScore: readinessScore,
            reportHash: reportHash,
            ecosystemAction: ecosystemAction,
            createdAt: block.timestamp
        });

        nextBriefId += 1;

        emit GrowthBriefRecorded(briefId, subject, readinessScore, reportHash, ecosystemAction);
    }

    function getBrief(uint256 briefId) external view returns (GrowthBrief memory) {
        return briefs[briefId];
    }
}
