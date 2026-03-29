import React, { useContext, useState } from "react";
import { pubKeyData } from "../App";
import { hasClaimed } from "./Soroban";

export const HasClaimed = () => {
    const pubKey = useContext(pubKeyData);
    const [campaignId, setCampaignId] = useState("");
    const [addressToCheck, setAddressToCheck] = useState("");
    const [status, setStatus] = useState("");

    const handleCheck = async () => {
        if (!pubKey) return alert("Connect wallet first");

        try {
        const claimed = await hasClaimed(pubKey, campaignId, addressToCheck);
        setStatus(claimed ? "Address has claimed" : "Address has not claimed");
        } catch (error) {
        console.error(error);
        setStatus("Check failed");
        }
    };

    return (
        <div className="card">
        <div className="title">Has Claimed?</div>
        <input
            type="number"
            className="input"
            placeholder="Campaign ID"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
        />
        <input
            type="text"
            className="input"
            placeholder="Wallet address to check"
            value={addressToCheck}
            onChange={(e) => setAddressToCheck(e.target.value)}
        />
        <button className="btn" onClick={handleCheck}>
            Check
        </button>
        <div className="result-box">{status || "No check yet"}</div>
        </div>
    );
};
