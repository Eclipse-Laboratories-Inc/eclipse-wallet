package com.salmonwallet.adapter.trust;

import static android.content.pm.PackageManager.NameNotFoundException;
import static com.salmonwallet.adapter.trust.AssociationType.LOCAL_FROM_APP;
import static com.salmonwallet.adapter.trust.AssociationType.LOCAL_FROM_BROWSER;
import static com.salmonwallet.adapter.trust.AssociationType.REMOTE;
import static com.salmonwallet.adapter.trust.VerificationState.SCOPE_DELIMITER;
import static com.salmonwallet.adapter.trust.VerificationState.failed;
import static com.salmonwallet.adapter.trust.VerificationState.notVerifiable;
import static com.salmonwallet.adapter.trust.VerificationState.succeeded;
import static com.solana.digitalassetlinks.AndroidAppPackageVerifier.CouldNotVerifyPackageException;
import static java.util.Objects.requireNonNullElse;

import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import com.solana.digitalassetlinks.AndroidAppPackageVerifier;
import com.solana.mobilewalletadapter.walletlib.association.AssociationUri;
import com.solana.mobilewalletadapter.walletlib.association.LocalAssociationUri;
import com.solana.mobilewalletadapter.walletlib.association.RemoteAssociationUri;

import java.net.URI;

public class ClientTrustVerifier {

    private final String TAG = getClass().getSimpleName();
    private final AssociationType associationType;
    private final PackageManager packageManager;
    private final String callingPackage;

    public ClientTrustVerifier(PackageManager packageManager, String callingPackage, AssociationUri associationUri) {
        this.packageManager = packageManager;
        this.callingPackage = callingPackage;

        if (associationUri instanceof LocalAssociationUri) {
            if (callingPackage != null) {
                this.associationType = LOCAL_FROM_APP;
            } else {
                this.associationType = LOCAL_FROM_BROWSER;
            }
        } else if (associationUri instanceof RemoteAssociationUri) {
            this.associationType = REMOTE;
        } else {
            throw new UnsupportedOperationException("Unrecognized association URI type");
        }
    }

    public VerificationState verifyAuthorizationSource(Uri clientIdentityUri) {
        switch (associationType) {
            case LOCAL_FROM_BROWSER:
                if (clientIdentityUri != null) {
                    // TODO: kick off web-based client verification here
                    Log.d(TAG, "Web-scoped authorization verification not yet implemented");
                    return succeeded(associationType.getScopeTag(), clientIdentityUri.getAuthority());
                } else {
                    Log.d(TAG, "Client did not provide an identity URI; not verifiable");
                    return notVerifiable(associationType.getScopeTag());
                }
            case LOCAL_FROM_APP:
                if (clientIdentityUri != null) {
                    AndroidAppPackageVerifier verifier = new AndroidAppPackageVerifier(packageManager);
                    boolean verified;
                    try {
                        verified = verifier.verify(callingPackage, URI.create(clientIdentityUri.toString()));
                    } catch (CouldNotVerifyPackageException e) {
                        Log.w(TAG, "Package verification failed for callingPackage=" + callingPackage + ", clientIdentityUri=" + clientIdentityUri);
                        verified = false;
                    }
                    if (verified) {
                        int callingUid;
                        try {
                            callingUid = getCallingUid();
                        } catch (NameNotFoundException e) {
                            Log.w(TAG, "Calling package is invalid");
                            return VerificationState.failed(associationType.getScopeTag());
                        }
                        Log.d(TAG, "App-scoped authorization succeeded for '" + callingPackage + "'");
                        return succeeded(associationType.getScopeTag(), Integer.toString(callingUid));
                    } else {
                        Log.w(TAG, "App-scoped authorization failed for '" + callingPackage + "'");
                        return failed(associationType.getScopeTag());
                    }
                } else {
                    Log.d(TAG, "Client did not provide an identity URI; not verifiable");
                    return notVerifiable(associationType.getScopeTag());
                }
            case REMOTE:
                Log.w(TAG, "Remote authorizations are not verifiable");
                return notVerifiable(associationType.getScopeTag());
        }

        return failed(associationType.getScopeTag());
    }

    public VerificationState verifyReauthorizationSource(String authorizationScope, Uri clientIdentityUri) {
        if (!authorizationScope.startsWith(associationType.getScopeTag())) {
            Log.w(TAG, "Reauthorization failed; association type mismatch");
            return failed(associationType.getScopeTag());
        } else if (authorizationScope.length() == associationType.getScopeTag().length()) {
            Log.d(TAG, "Unqualified authorization scopes are not verifiable");
            return notVerifiable(associationType.getScopeTag());
        } else {
            return verifyAuthorizationSource(clientIdentityUri);
        }
    }

    // Note: the authorizationScope and clientIdentityUri parameters should be retrieved from a
    // trusted source (e.g. a local database), as they are used as part of request verification
    public boolean verifyPrivilegedMethodSource(String authorizationScope, Uri clientIdentityUri) {
        if (authorizationScope.startsWith(LOCAL_FROM_BROWSER.getScopeTag())) {
            if (associationType != LOCAL_FROM_BROWSER) {
                Log.w(TAG, "Attempt to use a web-scoped authorization with a non-web client");
                return false;
            } else if (authorizationScope.length() == LOCAL_FROM_BROWSER.getScopeTag().length()) {
                Log.d(TAG, "Unqualified web-scoped authorization, continuing");
                return true;
            } else if (authorizationScope.charAt(LOCAL_FROM_BROWSER.getScopeTag().length()) != SCOPE_DELIMITER) {
                Log.w(TAG, "Unexpected character '" + authorizationScope.charAt(LOCAL_FROM_BROWSER.getScopeTag().length()) + "' in scope; expected '" + SCOPE_DELIMITER + "'");
                return false;
            } else {
                Log.d(TAG, "Treating qualified web-scoped authorization as a bearer token, continuing");
                return true;
            }
        } else if (authorizationScope.startsWith(LOCAL_FROM_APP.getScopeTag())) {
            if (associationType != LOCAL_FROM_APP) {
                Log.w(TAG, "Attempt to use an app-scoped authorization with a non-app client");
                return false;
            } else if (authorizationScope.length() == LOCAL_FROM_APP.getScopeTag().length()) {
                Log.d(TAG, "Unqualified app-scoped authorization, continuing");
                return true;
            } else if (authorizationScope.charAt(LOCAL_FROM_APP.getScopeTag().length()) != SCOPE_DELIMITER) {
                Log.w(TAG, "Unexpected character '" + authorizationScope.charAt(LOCAL_FROM_APP.getScopeTag().length()) + "' in scope; expected '" + SCOPE_DELIMITER + "'");
                return false;
            } else {
                int scopeUid;
                try {
                    scopeUid = Integer.parseInt(authorizationScope.substring(LOCAL_FROM_APP.getScopeTag().length() + 1));
                } catch (NumberFormatException e) {
                    Log.w(TAG, "App-scoped authorization has invalid UID");
                    return false;
                }

                int callingUid;
                try {
                    callingUid = getCallingUid();
                } catch (NameNotFoundException e) {
                    Log.w(TAG, "Calling package is invalid");
                    return false;
                }

                if (scopeUid == callingUid) {
                    Log.d(TAG, "App-scoped authorization matches calling identity, continuing");
                    return true;
                } else {
                    Log.w(TAG, "App-scoped authorization does not match calling identity");
                    return false;
                }
            }
        } else if (authorizationScope.equals(REMOTE.getScopeTag())) {
            if (associationType != REMOTE) {
                Log.w(TAG, "Attempt to use a remote-scoped authorization with a local client");
                return false;
            } else {
                Log.d(TAG, "Authorization with remote source, continuing");
                return true;
            }
        } else {
            Log.w(TAG, "Unknown authorization scope");
            return false;
        }
    }

    private int getCallingUid() throws NameNotFoundException {
        String packageName = requireNonNullElse(callingPackage, "");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            return packageManager.getPackageUid(packageName, 0);
        } else {
            return packageManager.getApplicationInfo(packageName, 0).uid;
        }
    }
}
