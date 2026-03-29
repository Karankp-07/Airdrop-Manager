import React, { useState } from "react";
import {
    checkConnection,
    retrievePublicKey,
    getBalance,
    getRequestAccess,
} from "./Freighter";

const Header = ({ pubKey, setPubKey, theme, setTheme }) => {
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState("0");

    const connectWallet = async () => {
        try {
            await getRequestAccess();
            const allowed = await checkConnection();

            if (!allowed) {
            alert("Permission denied by wallet");
            return;
        }

        const key = await retrievePublicKey();
        const bal = await getBalance();

        setPubKey(key);
        setBalance(Number(bal).toFixed(2));
        setConnected(true);
        } catch (e) {
            console.error(e);
            alert("Wallet connection failed");
        }
    };

    return (
        <header className="app-header">
            <div className="brand-block">
                <div className="brand-title">Airdrop Manager</div>
                <div className="brand-subtitle">Soroban campaign console</div>
            </div>

            <div className="header-actions">
                {pubKey && (
                    <>
                        <div className="info-chip">
                            {`${pubKey.slice(0, 4)}...${pubKey.slice(-4)}`}
                        </div>

                        <div className="info-chip">
                            Balance: {balance} XLM
                        </div>
                    </>
                )}

                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="theme-toggle"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>

                <button
                    onClick={connectWallet}
                    disabled={connected}
                    className={`wallet-btn ${connected ? "wallet-btn-connected" : "wallet-btn-connect"}`}
                >
                    {connected ? "Connected" : "Connect Wallet"}
                </button>
            </div>
        </header>
    );
};

export default Header;
