package com.salmonwallet.adapter.trust.mapper;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.salmonwallet.adapter.trust.VerificationState;

public class VerificationStateMapper {
    public ReadableMap toReadableMap(VerificationState verification) {
        WritableMap map = Arguments.createMap();
        map.putString("result", verification.getResult().name());
        map.putString("scope", verification.getAuthorizationScope());
        return map;
    }
}
