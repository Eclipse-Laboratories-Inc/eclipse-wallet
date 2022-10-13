package com.salmonwallet;

import static java.nio.charset.StandardCharsets.UTF_8;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.salmonwallet.adapter.MobileWalletAdapter;
import com.salmonwallet.adapter.trust.VerificationState;
import com.solana.mobilewalletadapter.walletlib.association.AssociationUri;
import com.solana.mobilewalletadapter.walletlib.association.LocalAssociationUri;
import com.solana.mobilewalletadapter.walletlib.authorization.AuthIssuerConfig;
import com.solana.mobilewalletadapter.walletlib.protocol.MobileWalletAdapterConfig;
import com.solana.mobilewalletadapter.walletlib.scenario.AuthorizeRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.ReauthorizeRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.Scenario;
import com.solana.mobilewalletadapter.walletlib.scenario.SignAndSendTransactionsRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.SignMessagesRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.SignTransactionsRequest;

public class MobileWalletAdapterActivity extends ReactActivity {

    private final String TAG = getClass().getSimpleName();

    private MobileWalletAdapter mobileWalletAdapter;

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SalmonWallet";
    }

    /**
     * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
     * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
     * (Paper)
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new AdapterActivityDelegate(this, getMainComponentName());
    }

    public MobileWalletAdapter getMobileWalletAdapter() {
        return this.mobileWalletAdapter;
    }

    private class AdapterActivityDelegate extends ReactActivityDelegate {
        private Scenario scenario;

        public AdapterActivityDelegate(ReactActivity activity, String mainComponentName) {
            super(activity, mainComponentName);
        }

        @Override
        protected ReactRootView createRootView() {
            ReactRootView reactRootView = new ReactRootView(getContext());
            // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
            return reactRootView;
        }

        @Override
        protected void loadApp(String appKey) {
            super.loadApp(appKey);
        }

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(null);

            Activity activity = getPlainActivity();

            Intent intent = activity.getIntent();
            if (intent == null) {
                Log.e(TAG, "No Intent available");
                activity.finish();
                return;
            }

            Uri data = intent.getData();
            if (data == null) {
                Log.e(TAG, "Intent has no data URI");
                activity.finish();
                return;
            }

            AssociationUri associationUri = AssociationUri.parse(data);
            if (associationUri == null) {
                Log.e(TAG, "Unsupported association URI '" + data + "'");
                activity.finish();
                return;
            }
            if (!(associationUri instanceof LocalAssociationUri)) {
                Log.w(TAG, "Current implementation of SalmonWallet does not support remote clients");
                activity.finish();
                return;
            }

            mobileWalletAdapter = new MobileWalletAdapter(getPackageManager(), getCallingPackage(), associationUri);

            scenario = associationUri.createScenario(
                    activity.getApplicationContext(),
                    new MobileWalletAdapterConfig(true, 10, 10),
                    new AuthIssuerConfig("SalmonWallet"),
                    new MobileWalletAdapterScenarioCallbacks()
            );
            scenario.start();
        }

        @Override
        protected void onDestroy() {
            super.onDestroy();
            if (scenario != null) {
                scenario.close();
                scenario = null;
            }
            if (mobileWalletAdapter != null) {
                mobileWalletAdapter.close();
                mobileWalletAdapter = null;
            }
        }

        @Override
        protected boolean isConcurrentRootEnabled() {
            // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
            // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        private class MobileWalletAdapterScenarioCallbacks implements Scenario.Callbacks {

            @Override
            public void onScenarioReady() {
                Log.i(TAG, "Scenario ready");
            }

            @Override
            public void onScenarioServingClients() {
                Log.i(TAG, "Scenario serving clients");
            }

            @Override
            public void onScenarioServingComplete() {
                Log.i(TAG, "Scenario serving complete");
                if (scenario != null) {
                    scenario.close();
                }
            }

            @Override
            public void onScenarioComplete() {
                Log.i(TAG, "Scenario complete");
            }

            @Override
            public void onScenarioError() {
                Log.e(TAG, "Scenario error");
            }

            @Override
            public void onScenarioTeardownComplete() {
                Log.i(TAG, "Scenario teardown complete");
                // No need to cancel any outstanding request; the scenario is torn down, and so
                // cancelling a request that originated from it isn't actionable
                getPlainActivity().finish();
            }

            @Override
            public void onAuthorizeRequest(@NonNull AuthorizeRequest request) {
                Log.i(TAG, "Authorize request");
                mobileWalletAdapter.dispatchRequest(request);
            }

            @Override
            public void onReauthorizeRequest(@NonNull ReauthorizeRequest request) {
                Log.i(TAG, "Reauthorize request");
                VerificationState verification = mobileWalletAdapter.verifyReauthorizationSource(
                        new String(request.getAuthorizationScope(), UTF_8),
                        request.getIdentityUri()
                );
                switch (verification.getResult()) {
                    case SUCCEEDED:
                        Log.i(TAG, "Reauthorization source verification succeeded");
                        request.completeWithReauthorize();
                        break;
                    case NOT_VERIFIABLE:
                        Log.i(TAG, "Reauthorization source not verifiable; approving");
                        request.completeWithReauthorize();
                    case FAILED:
                        Log.w(TAG, "Reauthorization source verification failed");
                        request.completeWithDecline();
                    default:
                        Log.w(TAG, "Timed out waiting for reauthorization source verification");
                        request.completeWithDecline();
                }
            }

            @Override
            public void onSignTransactionsRequest(@NonNull SignTransactionsRequest request) {
                Log.i(TAG, "Sign transactions request");
                if (mobileWalletAdapter.verifyPrivilegedMethodSource(request)) {
                    mobileWalletAdapter.dispatchRequest(request);
                } else {
                    request.completeWithDecline();
                }
            }

            @Override
            public void onSignMessagesRequest(@NonNull SignMessagesRequest request) {
                Log.i(TAG, "Sign messages request");
                if (mobileWalletAdapter.verifyPrivilegedMethodSource(request)) {
                    mobileWalletAdapter.dispatchRequest(request);
                } else {
                    request.completeWithDecline();
                }
            }

            @Override
            public void onSignAndSendTransactionsRequest(@NonNull SignAndSendTransactionsRequest request) {
                Log.i(TAG, "Sign and send transactions request");
                if (mobileWalletAdapter.verifyPrivilegedMethodSource(request)) {
                    mobileWalletAdapter.dispatchRequest(request);
                } else {
                    request.completeWithDecline();
                }
            }
        }
    }
}
