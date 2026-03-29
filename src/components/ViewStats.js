import React, { useContext, useState } from "react";
import { pubKeyData } from "../App";
import { viewStats } from "./Soroban";

export const ViewStats = () => {
    const pubKey = useContext(pubKeyData);
    const [stats, setStats] = useState(null);

    const statRows = stats
        ? [
            ["Total Campaigns", stats.total_campaigns],
            ["Total Claimed", stats.total_claimed],
            ["Total Tokens Distributed", stats.total_tokens_dist],
        ]
        : [];

    const handleViewStats = async () => {
        if (!pubKey) return alert("Connect wallet first");

        try {
        const data = await viewStats(pubKey);
        setStats(data);
        } catch (error) {
        console.error(error);
        alert("Stats fetch failed");
        }
    };

    return (
        <div className="card">
        <div className="title">View Global Stats</div>
        <button className="btn" onClick={handleViewStats}>
            Load Stats
        </button>
        <div className="result-box">
            {stats ? (
            <div>
                {statRows.map(([label, value]) => (
                <div
                    key={label}
                    className="flex justify-between border-b border-blue-100 py-1 text-sm"
                >
                    <span className="font-semibold">{label}</span>
                    <span>{String(value)}</span>
                </div>
                ))}
            </div>
            ) : (
            "No stats loaded"
            )}
        </div>
        </div>
    );
};
