package com.salmonwallet.adapter;

import static java.nio.charset.StandardCharsets.UTF_8;

import android.content.pm.PackageManager;
import android.net.Uri;
import android.util.Log;

import com.salmonwallet.adapter.request.event.RequestEventListener;
import com.salmonwallet.adapter.trust.ClientTrustVerifier;
import com.salmonwallet.adapter.trust.VerificationState;
import com.solana.mobilewalletadapter.walletlib.association.AssociationUri;
import com.solana.mobilewalletadapter.walletlib.scenario.AuthorizeRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.ReauthorizeRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.ScenarioRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.SignAndSendTransactionsRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.SignPayloadsRequest;
import com.solana.mobilewalletadapter.walletlib.scenario.VerifiableIdentityRequest;

import java.util.ArrayList;
import java.util.List;

public class MobileWalletAdapter {
    private final String TAG = getClass().getSimpleName();
    private final List<RequestEventListener> listeners = new ArrayList<>();
    private final ClientTrustVerifier clientTrustVerifier;

    private ScenarioRequest request;

    public MobileWalletAdapter(PackageManager packageManager, String callingPackage, AssociationUri associationUri) {
        clientTrustVerifier = new ClientTrustVerifier(packageManager, callingPackage, associationUri);
    }

    public VerificationState verifyAuthorizationSource(Uri clientIdentityUri) {
        return clientTrustVerifier.verifyAuthorizationSource(clientIdentityUri);
    }

    public VerificationState verifyReauthorizationSource(String authorizationScope, Uri clientIdentityUri) {
        return clientTrustVerifier.verifyReauthorizationSource(authorizationScope, clientIdentityUri);
    }

    public boolean verifyPrivilegedMethodSource(VerifiableIdentityRequest request) {
        return clientTrustVerifier.verifyPrivilegedMethodSource(new String(request.getAuthorizationScope(), UTF_8), request.getIdentityUri());
    }

    public void addRequestEventListener(RequestEventListener listener) {
        if (!this.listeners.contains(listener)) {
            this.listeners.add(listener);

            // work-around to deal with race-condition: JS React listener component may be mounted after first request event
            if (this.request != null) {
                Log.i(TAG, "---> Launching previous request: " + request);
                listener.onRequest(this.request);
            }
        }
    }

    public void dispatchRequest(ScenarioRequest request) {
        if (this.request != null) {
            Log.w(TAG, "Cancelling previous scenario request!");
            this.request.cancel();
        }
        this.request = request;
        for (RequestEventListener listener : this.listeners) {
            try {
                listener.onRequest(request);
            } catch (Exception e) {
                Log.e(TAG, "Request event listener failed", e);
            }
        }
    }

    public void cancel() {
        this.request.cancel();
        this.request = null;
    }

    private void invalidOperation(String operation) {
        throw new RuntimeException("Cannot " + operation + " on " + (this.request != null ? this.request.getClass().getSimpleName() : "null request"));
    }

    public void completeWithDecline() {
        if (this.request instanceof AuthorizeRequest) {
            ((AuthorizeRequest) this.request).completeWithDecline();
        } else if (this.request instanceof ReauthorizeRequest) {
            ((ReauthorizeRequest) this.request).completeWithDecline();
        } else if (this.request instanceof SignPayloadsRequest) {
            ((SignPayloadsRequest) this.request).completeWithDecline();
        } else if (this.request instanceof SignAndSendTransactionsRequest) {
            ((SignAndSendTransactionsRequest) this.request).completeWithDecline();
        } else {
            invalidOperation("completeWithDecline");
        }
        this.request = null;
    }

    public void completeWithAuthorize(byte[] publicKey, String accountLabel, Uri walletUriBase, byte[] scope) {
        if (this.request instanceof AuthorizeRequest) {
            ((AuthorizeRequest) this.request).completeWithAuthorize(publicKey, accountLabel, walletUriBase, scope);
        } else {
            invalidOperation("completeWithAuthorize");
        }
        this.request = null;
    }

    public void completeWithReauthorize() {
        if (this.request instanceof ReauthorizeRequest) {
            ((ReauthorizeRequest) this.request).completeWithReauthorize();
        } else {
            invalidOperation("completeWithReauthorize");
        }
        this.request = null;
    }

    public void completeWithSignedPayloads(byte[][] signedPayloads) {
        if (this.request instanceof SignPayloadsRequest) {
            ((SignPayloadsRequest) this.request).completeWithSignedPayloads(signedPayloads);
        } else {
            invalidOperation("completeWithSignedPayloads");
        }
        this.request = null;
    }

    public void completeWithInvalidPayloads(boolean[] valid) {
        if (this.request instanceof SignPayloadsRequest) {
            ((SignPayloadsRequest) this.request).completeWithInvalidPayloads(valid);
        } else {
            invalidOperation("completeWithInvalidPayloads");
        }
        this.request = null;
    }

    public void completeWithSignatures(byte[][] signatures) {
        if (this.request instanceof SignAndSendTransactionsRequest) {
            ((SignAndSendTransactionsRequest) this.request).completeWithSignatures(signatures);
        } else {
            invalidOperation("completeWithSignatures");
        }
        this.request = null;
    }

    public void completeWithInvalidSignatures(boolean[] valid) {
        if (this.request instanceof SignAndSendTransactionsRequest) {
            ((SignAndSendTransactionsRequest) this.request).completeWithInvalidSignatures(valid);
        } else {
            invalidOperation("completeWithInvalidSignatures");
        }
        this.request = null;
    }

    public void completeWithNotSubmitted(byte[][] signatures) {
        if (this.request instanceof SignAndSendTransactionsRequest) {
            ((SignAndSendTransactionsRequest) this.request).completeWithNotSubmitted(signatures);
        } else {
            invalidOperation("completeWithNotSubmitted");
        }
        this.request = null;
    }

    public void completeWithTooManyPayloads() {
        if (this.request instanceof SignPayloadsRequest) {
            ((SignPayloadsRequest) this.request).completeWithTooManyPayloads();
        } else if (this.request instanceof SignAndSendTransactionsRequest) {
            ((SignAndSendTransactionsRequest) this.request).completeWithTooManyPayloads();
        } else {
            invalidOperation("completeWithTooManyPayloads");
        }
        this.request = null;
    }

    public void completeWithAuthorizationNotValid() {
        if (this.request instanceof SignPayloadsRequest) {
            ((SignPayloadsRequest) this.request).completeWithAuthorizationNotValid();
        } else if (this.request instanceof SignAndSendTransactionsRequest) {
            ((SignAndSendTransactionsRequest) this.request).completeWithAuthorizationNotValid();
        } else {
            invalidOperation("completeWithAuthorizationNotValid");
        }
        this.request = null;
    }

    public void close() {
        this.listeners.clear();
        this.request = null;
    }
}
