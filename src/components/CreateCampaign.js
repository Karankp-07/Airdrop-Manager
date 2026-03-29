import React, { useContext, useState } from "react";
import { pubKeyData } from "../App";
import { createCampaign } from "./Soroban";

export const CreateCampaign = () => {
    const pubKey = useContext(pubKeyData);
    const [tokenAmount, setTokenAmount] = useState("");
    const [totalSupply, setTotalSupply] = useState("");
    const [campaignId, setCampaignId] = useState("");

    const handleCreateCampaign = async () => {
        if (!pubKey) return alert("Connect wallet first");

    try {
        const id = await createCampaign(pubKey, tokenAmount, totalSupply);
        setCampaignId(String(id));
    } catch (error) {
        console.error(error);
        alert("Failed to create campaign");
    }
    };

    return (
        <div className="card">
        <div className="title">Create Campaign</div>
        <input
            type="number"
            className="input"
            placeholder="Token amount per claim"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
        />
        <input
            type="number"
            className="input"
            placeholder="Total supply"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
        />
        <button className="btn" onClick={handleCreateCampaign}>
            Create
        </button>
        <div className="result-box">Campaign ID: {campaignId || "-"}</div>
        </div>
    );
};
