package com.salmonwallet.adapter.trust;

import static com.salmonwallet.adapter.trust.VerificationResult.FAILED;
import static com.salmonwallet.adapter.trust.VerificationResult.NOT_VERIFIABLE;
import static com.salmonwallet.adapter.trust.VerificationResult.SUCCEEDED;

public class VerificationState {
    public static final char SCOPE_DELIMITER = ',';

    private final VerificationResult result;
    private final String scopeTag;
    private final String qualifier;

    VerificationState(VerificationResult result, String scopeTag, String qualifier) {
        this.result = result;
        this.scopeTag = scopeTag;
        this.qualifier = qualifier;
    }

    VerificationState(VerificationResult result, String scopeTag) {
        this(result, scopeTag, null);
    }

    public static VerificationState succeeded(String scopeTag, String qualifier) {
        return new VerificationState(SUCCEEDED, scopeTag, qualifier);
    }

    public static VerificationState failed(String scopeTag) {
        return new VerificationState(FAILED, scopeTag);
    }

    public static VerificationState notVerifiable(String scopeTag) {
        return new VerificationState(NOT_VERIFIABLE, scopeTag);
    }

    public VerificationResult getResult() {
        return result;
    }

    public String getAuthorizationScope() {
        return scopeTag + (qualifier != null ? SCOPE_DELIMITER + qualifier : "");
    }
}
