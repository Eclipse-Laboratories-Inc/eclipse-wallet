package com.salmonwallet.adapter.request.event;

import com.solana.mobilewalletadapter.walletlib.scenario.ScenarioRequest;

public interface RequestEventListener {
    void onRequest(ScenarioRequest request);
}
