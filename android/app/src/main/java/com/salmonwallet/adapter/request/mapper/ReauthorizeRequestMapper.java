package com.salmonwallet.adapter.request.mapper;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.solana.mobilewalletadapter.walletlib.scenario.ReauthorizeRequest;

import java.nio.charset.StandardCharsets;

public class ReauthorizeRequestMapper implements ScenarioRequestMapper<ReauthorizeRequest> {
    @Override
    public ReadableMap toReadableMap(ReauthorizeRequest request) {
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
        return map;
    }
}
