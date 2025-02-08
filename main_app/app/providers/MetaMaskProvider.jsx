'use client';

import { MetaMaskProvider } from "@metamask/sdk-react";
import { useState, useEffect } from "react";

export function MetaMaskUIProvider({ children }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    return (
        <>
            {ready ? (
                <MetaMaskProvider
                    debug={false}
                    sdkOptions={{
                        dappMetadata: {
                            name: "Voxora",
                            url: typeof window !== 'undefined' ? window.location.href : '',
                        },
                        checkInstallationImmediately: false,
                    }}
                >
                    {children}
                </MetaMaskProvider>
            ) : (
                children
            )}
        </>
    );
}