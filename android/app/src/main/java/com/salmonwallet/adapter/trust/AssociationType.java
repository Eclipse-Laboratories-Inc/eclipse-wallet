package com.salmonwallet.adapter.trust;

public enum AssociationType {

    LOCAL_FROM_BROWSER("web"),
    LOCAL_FROM_APP("app"),
    REMOTE("rem");

    private final String scopeTag;

    AssociationType(String scopeTag) {
        this.scopeTag = scopeTag;
    }

    public String getScopeTag() {
        return scopeTag;
    }
}