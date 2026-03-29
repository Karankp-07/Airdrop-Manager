import React, { useContext, useState } from "react";
import { pubKeyData } from "../App";
import { deactivateCampaign } from "./Soroban";

export const DeactivateCampaign = () => {
    const pubKey = useContext(pubKeyData);
    const [campaignId, setCampaignId] = useState("");
    const [status, setStatus] = useState("");

    const handleDeactivate = async () => {
        if (!pubKey) return alert("Connect wallet first");

        try {
        await deactivateCampaign(pubKey, campaignId);
        setStatus("Campaign deactivated");
        } catch (error) {
        console.error(error);
        setStatus("Deactivation failed");
        }
    };

    return (
        <div className="card">
        <div className="title">Deactivate Campaign</div>
        <input
            type="number"
            className="input"
            placeholder="Campaign ID"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
        />
        <button className="btn" onClick={handleDeactivate}>
            Deactivate
        </button>
        <div className="result-box">{status || "No action yet"}</div>
        </div>
    );
};
