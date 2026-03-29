import React, { useContext, useState } from "react";
import { pubKeyData } from "../App";
import { viewCampaign } from "./Soroban";

export const ViewCampaign = () => {
    const pubKey = useContext(pubKeyData);
    const [campaignId, setCampaignId] = useState("");
    const [campaignData, setCampaignData] = useState(null);

    const viewRows = campaignData
        ? [
            ["Campaign ID", campaignData.campaign_id],
            ["Token Amount", campaignData.token_amount],
            ["Total Supply", campaignData.total_supply],
            ["Distributed", campaignData.distributed],
            ["Is Active", campaignData.is_active ? "Yes" : "No"],
            ["Created At", campaignData.created_at],
        ]
        : [];

    const handleView = async () => {
        if (!pubKey) return alert("Connect wallet first");

        try {
        const data = await viewCampaign(pubKey, campaignId);
        setCampaignData(data);
        } catch (error) {
        console.error(error);
        alert("Fetch campaign failed");
        }
    };

    return (
        <div className="card">
        <div className="title">View Campaign</div>
        <input
            type="number"
            className="input"
            placeholder="Campaign ID"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
        />
        <button className="btn" onClick={handleView}>
            View
        </button>
        <div className="result-box">
            {campaignData ? (
            <div>
                {viewRows.map(([label, value]) => (
                    <div key={label} className="kv-row">
                        <span className="kv-label">{label}</span>
                        <span className="kv-value">{String(value)}</span>
                    </div>
                ))}
            </div>
            ) : (
            "No data"
            )}
        </div>
        </div>
    );
};
