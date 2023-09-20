'use strict';

let promise;

const jsonData = {
    "ethereum-mainnet": {
        "enable": true,
        "sections": {
            "overview": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true,
                    "list_tokens": true,
                    "import_tokens": true,
                    "nfts": true
                }
            },
            "token_detail": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true
                }
            },
            "nfts": {
                "active": true,
                "list_in_marketplace": {
                    "active": false,
                    "marketplaces": {
                        "hyperspace": {
                            "delist": false
                        }
                    }
                },
                "list_by_owner": true,
                "send": true,
                "burn": false
            },
            "swap": {
                "active": true
            },
            "transactions": {
                "active": true
            }
        }
    },
    "ethereum-goerli": {
        "enable": true,
        "sections": {
            "overview": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true,
                    "list_tokens": true,
                    "import_tokens": true,
                    "nfts": true
                }
            },
            "token_detail": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true
                }
            },
            "nfts": {
                "active": true,
                "list_in_marketplace": {
                    "active": false,
                    "marketplaces": {
                        "hyperspace": {
                            "delist": false
                        }
                    }
                },
                "list_by_owner": true,
                "send": true,
                "burn": false
            },
            "swap": {
                "active": true
            },
            "transactions": {
                "active": true
            }
        }
    },
    "solana-mainnet": {
        "enable": true,
        "sections": {
            "overview": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true,
                    "list_tokens": true,
                    "import_tokens": false,
                    "nfts": true
                }
            },
            "token_detail": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true
                }
            },
            "nfts": {
                "active": true,
                "list_in_marketplace": {
                    "active": true,
                    "marketplaces": {
                        "hyperspace": {
                            "delist": true
                        }
                    }
                },
                "list_by_owner": true,
                "send": true,
                "burn": true
            },
            "swap": {
                "active": true
            },
            "transactions": {
                "active": true
            }
        }
    },
    "solana-testnet": {
        "enable": true,
        "sections": {
            "overview": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true,
                    "list_tokens": true,
                    "import_tokens": false,
                    "nfts": true
                }
            },
            "token_detail": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true
                }
            },
            "nfts": {
                "active": true,
                "list_in_marketplace": {
                    "active": true,
                    "marketplaces": {
                        "hyperspace": {
                            "delist": true
                        }
                    }
                },
                "list_by_owner": true,
                "send": true,
                "burn": true
            },
            "swap": {
                "active": true
            },
            "transactions": {
                "active": true
            }
        }
    },
    "solana-devnet": {
        "enable": true,
        "sections": {
            "overview": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true,
                    "list_tokens": true,
                    "import_tokens": false,
                    "nfts": true
                }
            },
            "token_detail": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true
                }
            },
            "nfts": {
                "active": true,
                "list_in_marketplace": {
                    "active": true,
                    "marketplaces": {
                        "hyperspace": {
                            "delist": true
                        }
                    }
                },
                "list_by_owner": true,
                "send": true,
                "burn": true
            },
            "swap": {
                "active": true
            },
            "transactions": {
                "active": true
            }
        }
    },
    "near-mainnet": {
        "enable": true,
        "sections": {
            "overview": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true,
                    "list_tokens": true,
                    "import_tokens": false,
                    "nfts": true
                }
            },
            "token_detail": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true
                }
            },
            "nfts": {
                "active": true,
                "list_in_marketplace": {
                    "active": false,
                    "marketplaces": {
                        "hyperspace": {
                            "delist": false
                        }
                    }
                },
                "list_by_owner": false,
                "send": true,
                "burn": false
            },
            "swap": {
                "active": true
            },
            "transactions": {
                "active": true
            }
        }
    },
    "near-testnet": {
        "enable": true,
        "sections": {
            "overview": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true,
                    "list_tokens": true,
                    "import_tokens": false,
                    "nfts": true
                }
            },
            "token_detail": {
                "active": true,
                "features": {
                    "send": true,
                    "receive": true
                }
            },
            "nfts": {
                "active": true,
                "list_in_marketplace": {
                    "active": false,
                    "marketplaces": {
                        "hyperspace": {
                            "delist": false
                        }
                    }
                },
                "list_by_owner": false,
                "send": true,
                "burn": false
            },
            "swap": {
                "active": true
            },
            "transactions": {
                "active": true
            }
        }
    }
  };

const getSwitches = async () => {
  if (promise) {
    return promise;
  }

  promise = Promise.resolve(jsonData);

  try {
    return await promise;
  } catch (error) {
    promise = null;
    throw error;
  }
};


module.exports = { getSwitches };

