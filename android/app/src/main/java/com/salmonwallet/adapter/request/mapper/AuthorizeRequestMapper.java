package com.salmonwallet.adapter.request.mapper;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.solana.mobilewalletadapter.walletlib.scenario.AuthorizeRequest;

public class AuthorizeRequestMapper implements ScenarioRequestMapper<AuthorizeRequest> {
    @Override
    public ReadableMap toReadableMap(AuthorizeRequest request) {
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
        return map;
    }
}
