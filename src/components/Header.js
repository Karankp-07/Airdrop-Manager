import React, { useState } from "react";
import {
    checkConnection,
    retrievePublicKey,
    getBalance,
    getRequestAccess,
} from "./Freighter";

const Header = ({ pubKey, setPubKey }) => {
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
        <div className="bg-gray-300 h-20 flex justify-between items-center px-4 sm:px-10">
        <div className="text-xl sm:text-3xl font-bold">Airdrop Manager</div>

        <div className="flex items-center gap-2 sm:gap-4">
            {pubKey && (
            <>
                <div className="p-2 bg-gray-50 border rounded-md text-sm">
                {`${pubKey.slice(0, 4)}...${pubKey.slice(-4)}`}
                </div>

                <div className="p-2 bg-gray-50 border rounded-md text-sm">
                Balance: {balance} XLM
                </div>
            </>
            )}

            <button
            onClick={connectWallet}
            disabled={connected}
            className={`text-sm sm:text-xl w-36 sm:w-52 rounded-md p-2 sm:p-4 font-bold text-white ${
                connected
                ? "bg-green-500 cursor-not-allowed"
                : "bg-blue-400 hover:bg-blue-500"
            }`}
            >
            {connected ? "Connected" : "Connect Wallet"}
            </button>
        </div>
        </div>
    );
};

export default Header;
