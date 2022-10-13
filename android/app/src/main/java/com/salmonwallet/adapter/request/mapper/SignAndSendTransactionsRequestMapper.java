package com.salmonwallet.adapter.request.mapper;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.solana.mobilewalletadapter.walletlib.scenario.SignAndSendTransactionsRequest;

import java.nio.charset.StandardCharsets;

public class SignAndSendTransactionsRequestMapper implements ScenarioRequestMapper<SignAndSendTransactionsRequest> {
    @Override
    public ReadableMap toReadableMap(SignAndSendTransactionsRequest request) {
        WritableMap map = Arguments.createMap();
        map.putString("type", getType(request));
        map.putString("cluster", request.getCluster());
        map.putString("identityName", request.getIdentityName());
        if (request.getIdentityUri() != null) {
            map.putString("identityUri", request.getIdentityUri().toString());
        }
        if (request.getIconRelativeUri() != null) {
            map.putString("iconRelativeUri", request.getIconRelativeUri().toString());
        }
        map.putString("authorizationScope", new String(request.getAuthorizationScope(), StandardCharsets.UTF_8));
        map.putString("publicKey", toBase64(request.getPublicKey()));
        map.putArray("payloads", toBase64(request.getPayloads()));
        if (request.getMinContextSlot() != null) {
            map.putInt("minContextSlot", request.getMinContextSlot());
        }
        return map;
    }
}
