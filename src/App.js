import "./App.css";
import Header from "./components/Header";
import { useState, createContext, useEffect } from "react";
import { CreateCampaign } from "./components/CreateCampaign";
import { ClaimAirdrop } from "./components/ClaimAirdrop";
import { DeactivateCampaign } from "./components/DeactivateCampaign";
import { ViewCampaign } from "./components/ViewCampaign";
import { ViewStats } from "./components/ViewStats";
import { HasClaimed } from "./components/HasClaimed";

const pubKeyData = createContext();

function App() {
    const [pubKey, _setPubKey] = useState("");
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem("airdrop-ui-theme");
        return storedTheme === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("airdrop-ui-theme", theme);
    }, [theme]);

    return (
        <div className="App">
            <Header pubKey={pubKey} setPubKey={_setPubKey} theme={theme} setTheme={setTheme} />
            <pubKeyData.Provider value={pubKey}>
                <div className="main-container">
                    <section className="hero-panel">
                        <p className="hero-eyebrow">Stellar Soroban dApp</p>
                        <h1 className="hero-title">Campaign-driven token distribution, fully on-chain</h1>
                        <p className="hero-subtitle">
                            Create campaigns, process claims, and audit platform activity from one clean control surface.
                        </p>
                    </section>

                    <div className="grid-layout">
                        <CreateCampaign />
                        <ClaimAirdrop />
                        <DeactivateCampaign />
                        <ViewCampaign />
                        <ViewStats />
                        <HasClaimed />
                    </div>
            </div>
            </pubKeyData.Provider>
        </div>
    );
}

export default App;
export { pubKeyData };
