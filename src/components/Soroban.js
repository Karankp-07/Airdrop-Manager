import {
    Contract,
    TransactionBuilder,
    Networks,
    BASE_FEE,
    nativeToScVal,
    scValToNative,
    rpc as StellarRpc,
} from "@stellar/stellar-sdk";

import { userSignTransaction } from "./Freighter";

const RPC_URL = "https://soroban-testnet.stellar.org:443";
const NETWORK = Networks.TESTNET;
const CONTRACT_ADDRESS = "CD763ITNHCRXXUANJDM4I4ES2KH6JLLXS2M5WZRW4C6I6RCNS2E6YJQX";

const server = new StellarRpc.Server(RPC_URL);

const TX_PARAMS = {
    fee: BASE_FEE,
    networkPassphrase: NETWORK,
};

const numberToU64 = (value) => nativeToScVal(Number(value), { type: "u64" });

async function contractInt(caller, fnName, values) {
    const sourceAccount = await server.getAccount(caller);
    const contract = new Contract(CONTRACT_ADDRESS);
    const builder = new TransactionBuilder(sourceAccount, TX_PARAMS);

    if (Array.isArray(values)) {
    builder.addOperation(contract.call(fnName, ...values));
    } else if (values !== undefined && values !== null) {
    builder.addOperation(contract.call(fnName, values));
    } else {
    builder.addOperation(contract.call(fnName));
    }

    const tx = builder.setTimeout(30).build();
    const preparedTx = await server.prepareTransaction(tx);
    const xdr = preparedTx.toXDR();

    const signed = await userSignTransaction(xdr, caller);
    const signedTx = TransactionBuilder.fromXDR(signed.signedTxXdr, NETWORK);

    const send = await server.sendTransaction(signedTx);

    for (let i = 0; i < 15; i += 1) {
        const res = await server.getTransaction(send.hash);

        if (res.status === "SUCCESS") {
        if (res.returnValue) {
            return scValToNative(res.returnValue);
        }
        return null;
        }

        if (res.status === "FAILED") {
        throw new Error("Transaction failed");
        }

        await new Promise((r) => setTimeout(r, 1000));
    }

    throw new Error("Transaction timeout");
}

async function createCampaign(caller, tokenAmount, totalSupply) {
    const args = [numberToU64(tokenAmount), numberToU64(totalSupply)];
    const result = await contractInt(caller, "create_campaign", args);
    return Number(result);
}

async function claimAirdrop(caller, campaignId) {
    const args = [numberToU64(campaignId), nativeToScVal(caller, { type: "address" })];
    await contractInt(caller, "claim_airdrop", args);
    return true;
}

async function deactivateCampaign(caller, campaignId) {
    const args = [numberToU64(campaignId)];
    await contractInt(caller, "deactivate_campaign", args);
    return true;
}

async function viewCampaign(caller, campaignId) {
    const args = [numberToU64(campaignId)];
    const result = await contractInt(caller, "view_campaign", args);
    return result;
}

async function viewStats(caller) {
    const result = await contractInt(caller, "view_stats");
    return result;
}

async function hasClaimed(caller, campaignId, addressToCheck) {
    const args = [
        numberToU64(campaignId),
        nativeToScVal(addressToCheck, { type: "address" }),
    ];

    const result = await contractInt(caller, "has_claimed", args);
    return Boolean(result);
}

export {
    createCampaign,
    claimAirdrop,
    deactivateCampaign,
    viewCampaign,
    viewStats,
    hasClaimed,
};
