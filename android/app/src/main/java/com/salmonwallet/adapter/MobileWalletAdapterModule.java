package com.salmonwallet.adapter;

import static android.util.Base64.NO_WRAP;
import static com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import static java.nio.charset.StandardCharsets.UTF_8;

import android.net.Uri;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.salmonwallet.MobileWalletAdapterActivity;
import com.salmonwallet.adapter.request.event.RequestEventListener;
import com.salmonwallet.adapter.request.mapper.ScenarioRequestMapper;
import com.salmonwallet.adapter.request.mapper.ScenarioRequestMapperImpl;
import com.salmonwallet.adapter.trust.VerificationState;
import com.salmonwallet.adapter.trust.mapper.VerificationStateMapper;
import com.solana.mobilewalletadapter.walletlib.scenario.ScenarioRequest;

@ReactModule(name = "AdapterModule")
public class MobileWalletAdapterModule extends ReactContextBaseJavaModule implements RequestEventListener {

    private final String TAG = getClass().getSimpleName();
    private final ScenarioRequestMapper<ScenarioRequest> requestMapper = new ScenarioRequestMapperImpl();
    private final VerificationStateMapper verificationStateMapper = new VerificationStateMapper();

    MobileWalletAdapterModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "AdapterModule";
    }

    private MobileWalletAdapter adapter() {
        return ((MobileWalletAdapterActivity) getCurrentActivity()).getMobileWalletAdapter();
    }

    @ReactMethod
    public void addListener(String eventName) {
        Log.i(TAG, "Listen to " + eventName);
        if (eventName.equals("onRequest")) {
            try {
                adapter().addRequestEventListener(this);
            } catch (Exception e) {
                Log.e(TAG, "", e);
            }
        }
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        Log.i(TAG, "Remove listeners: " + count);
    }

    @Override
    public void onRequest(ScenarioRequest request) {
        Log.i(TAG, "New request: " + request.getClass().getSimpleName());
        getReactApplicationContext()
                .getJSModule(RCTDeviceEventEmitter.class)
                .emit("onRequest", requestMapper.toReadableMap(request));
    }

    @ReactMethod
    public void verifyAuthorizationSource(String identityUri, Promise promise) {
        Log.i(TAG, "Verify authorization source for " + identityUri);
        try {
            VerificationState verification = adapter().verifyAuthorizationSource(parseUri(identityUri));
            promise.resolve(verificationStateMapper.toReadableMap(verification));
        } catch (Exception e) {
            Log.e(TAG, "", e);
            promise.reject(e);
        }
    }

    @ReactMethod
    public void cancel() {
        Log.i(TAG, "Cancel current request");
        try {
            adapter().cancel();
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithInternalError(String error) {
        Log.i(TAG, "Complete current request with internal error: " + error);
        try {
            adapter().completeWithInternalError(error);
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithDecline() {
        Log.i(TAG, "Complete current request with decline");
        try {
            adapter().completeWithDecline();
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithAuthorize(String publicKey, String accountLabel, String walletUriBase, String scope) {
        Log.i(TAG, "Complete current request with authorize");
        try {
            adapter().completeWithAuthorize(parseBase64(publicKey), accountLabel, parseUri(walletUriBase), parseUtf8(scope));
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithReauthorize() {
        Log.i(TAG, "Complete current request with reauthorize");
        try {
            adapter().completeWithReauthorize();
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithSignedPayloads(ReadableArray signedPayloads) {
        Log.i(TAG, "Complete current request with signed payloads");
        try {
            adapter().completeWithSignedPayloads(parseBase64Array(signedPayloads));
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithInvalidPayloads(ReadableArray valid) {
        Log.i(TAG, "Complete current request with invalid payloads");
        try {
            adapter().completeWithInvalidPayloads(parseBooleanArray(valid));
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithSignatures(ReadableArray signatures) {
        Log.i(TAG, "Complete current request with signatures");
        try {
            adapter().completeWithSignatures(parseBase64Array(signatures));
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithInvalidSignatures(ReadableArray valid) {
        Log.i(TAG, "Complete current request with invalid signatures");
        try {
            adapter().completeWithInvalidSignatures(parseBooleanArray(valid));
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithNotSubmitted(ReadableArray signatures) {
        Log.i(TAG, "Complete current request with not submitted");
        try {
            adapter().completeWithNotSubmitted(parseBase64Array(signatures));
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithTooManyPayloads() {
        Log.i(TAG, "Complete current request with too many payloads");
        try {
            adapter().completeWithTooManyPayloads();
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithAuthorizationNotValid() {
        Log.i(TAG, "Complete current request with authorization not valid");
        try {
            adapter().completeWithAuthorizationNotValid();
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    private static Uri parseUri(String input) {
        return input != null ? Uri.parse(input) : null;
    }

    private static byte[] parseUtf8(String input) {
        return input != null ? input.getBytes(UTF_8) : null;
    }

    private static byte[] parseBase64(String input) {
        return Base64.decode(input, NO_WRAP);
    }

    private static byte[][] parseBase64Array(ReadableArray input) {
        byte[][] result = new byte[input.size()][];
        for (int i = 0; i < input.size(); i++) {
            result[i] = parseBase64(input.getString(i));
        }
        return result;
    }

    private static boolean[] parseBooleanArray(ReadableArray input) {
        boolean[] result = new boolean[input.size()];
        for (int i = 0; i < input.size(); i++) {
            result[i] = input.getBoolean(i);
        }
        return result;
    }
}
