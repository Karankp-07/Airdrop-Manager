import React, { useContext, useState } from "react";
import { pubKeyData } from "../App";
import { claimAirdrop } from "./Soroban";

export const ClaimAirdrop = () => {
    const pubKey = useContext(pubKeyData);
    const [campaignId, setCampaignId] = useState("");
    const [status, setStatus] = useState("");

    const handleClaim = async () => {
        if (!pubKey) return alert("Connect wallet first");

        try {
        await claimAirdrop(pubKey, campaignId);
        setStatus("Claim successful");
        } catch (error) {
        console.error(error);
        setStatus("Claim failed");
        }
    };

    return (
        <div className="card">
        <div className="title">Claim Airdrop</div>
        <input
            type="number"
            className="input"
            placeholder="Campaign ID"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
        />
        <button className="btn" onClick={handleClaim}>
            Claim
        </button>
        <div className="result-box">{status || "No claim attempted"}</div>
        </div>
    );
};
