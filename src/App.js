import "./App.css";
import Header from "./components/Header";
import { useState, createContext } from "react";
import { CreateCampaign } from "./components/CreateCampaign";
import { ClaimAirdrop } from "./components/ClaimAirdrop";
import { DeactivateCampaign } from "./components/DeactivateCampaign";
import { ViewCampaign } from "./components/ViewCampaign";
import { ViewStats } from "./components/ViewStats";
import { HasClaimed } from "./components/HasClaimed";

const pubKeyData = createContext();

function App() {
    const [pubKey, _setPubKey] = useState("");

    return (
        <div className="App">
        <Header pubKey={pubKey} setPubKey={_setPubKey} />
        <pubKeyData.Provider value={pubKey}>
            <div className="main-container">
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
