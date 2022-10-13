package com.salmonwallet.adapter.request.mapper;

import com.facebook.react.bridge.ReadableMap;
import com.solana.mobilewalletadapter.walletlib.scenario.AuthorizeRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.ReauthorizeRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.ScenarioRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.SignAndSendTransactionsRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.SignMessagesRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.SignTransactionsRequest;

public class ScenarioRequestMapperImpl implements ScenarioRequestMapper<ScenarioRequest> {

    private final AuthorizeRequestMapper authorizeRequestMapper = new AuthorizeRequestMapper();
    private final ReauthorizeRequestMapper reauthorizeRequestMapper = new ReauthorizeRequestMapper();
    private final SignTransactionsRequestMapper signTransactionsRequestMapper = new SignTransactionsRequestMapper();
    private final SignMessagesRequestMapper signMessagesRequestMapper = new SignMessagesRequestMapper();
    private final SignAndSendTransactionsRequestMapper signAndSendTransactionsRequestMapper = new SignAndSendTransactionsRequestMapper();

    @Override
    public ReadableMap toReadableMap(ScenarioRequest request) {
        if (request instanceof AuthorizeRequest) {
            return authorizeRequestMapper.toReadableMap((AuthorizeRequest) request);
        }
        if (request instanceof ReauthorizeRequest) {
            return reauthorizeRequestMapper.toReadableMap((ReauthorizeRequest) request);
        }
        if (request instanceof SignTransactionsRequest) {
            return signTransactionsRequestMapper.toReadableMap((SignTransactionsRequest) request);
        }
        if (request instanceof SignMessagesRequest) {
            return signMessagesRequestMapper.toReadableMap((SignMessagesRequest) request);
        }
        if (request instanceof SignAndSendTransactionsRequest) {
            return signAndSendTransactionsRequestMapper.toReadableMap((SignAndSendTransactionsRequest) request);
        }
        throw new RuntimeException("Unknown scenario request type: " + request.getClass());
    }
}
