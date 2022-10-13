package com.salmonwallet.adapter.request.mapper;

import android.util.Base64;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.solana.mobilewalletadapter.walletlib.scenario.ScenarioRequest;

public interface ScenarioRequestMapper<Request extends ScenarioRequest> {
    ReadableMap toReadableMap(Request request);

    default String getType(Request request) {
        return request.getClass().getSimpleName();
    }

    default String toBase64(byte[] input) {
        return Base64.encodeToString(input, Base64.DEFAULT);
    }

    default ReadableArray toBase64(byte[][] input) {
        WritableArray output = Arguments.createArray();
        for (byte[] array : input) {
            output.pushString(toBase64(array));
        }
        return output;
    }
}
