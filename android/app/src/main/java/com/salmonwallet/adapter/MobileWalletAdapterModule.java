package com.salmonwallet.adapter;

import static android.util.Base64.DEFAULT;
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
    }

    @Override
    public void onRequest(ScenarioRequest request) {
        getReactApplicationContext()
                .getJSModule(RCTDeviceEventEmitter.class)
                .emit("onRequest", requestMapper.toReadableMap(request));
    }

    @ReactMethod
    public void verifyAuthorizationSource(String identityUri, Promise promise) {
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
        try {
            adapter().cancel();
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithDecline() {
        try {
            adapter().completeWithDecline();
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithAuthorize(String publicKey, String accountLabel, String walletUriBase, String scope) {
        try {
            adapter().completeWithAuthorize(parseBase64(publicKey), accountLabel, parseUri(walletUriBase), parseUtf8(scope));
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithReauthorize() {
        try {
            adapter().completeWithReauthorize();
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithSignedPayloads(ReadableArray signedPayloads) {
        try {
            adapter().completeWithSignedPayloads(parseBase64Array(signedPayloads));
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithInvalidPayloads(ReadableArray valid) {
        try {
            adapter().completeWithInvalidPayloads(parseBooleanArray(valid));
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithSignatures(ReadableArray signatures) {
        try {
            adapter().completeWithSignatures(parseBase64Array(signatures));
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithInvalidSignatures(ReadableArray valid) {
        try {
            adapter().completeWithInvalidSignatures(parseBooleanArray(valid));
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithNotSubmitted(ReadableArray signatures) {
        try {
            adapter().completeWithNotSubmitted(parseBase64Array(signatures));
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithTooManyPayloads() {
        try {
            adapter().completeWithTooManyPayloads();
        } catch (Exception e) {
            Log.e(TAG, "", e);
        }
    }

    @ReactMethod
    public void completeWithAuthorizationNotValid() {
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
        return Base64.decode(input, DEFAULT);
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
