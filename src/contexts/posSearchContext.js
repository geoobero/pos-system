"use client";

import { createContext, useContext, useState } from "react";

const POSSearchContext = createContext(null);

export function POSSearchProvider({ children }) {
    const [productSearch, setProductSearch] = useState("");

    return (
        <POSSearchContext.Provider value={{ productSearch, setProductSearch }}>
            {children}
        </POSSearchContext.Provider>
    );
}

export function usePOSSearch() {
    const context = useContext(POSSearchContext);
    if (!context) {
        throw new Error("usePOSSearch must be used within a POSSearchProvider");
    }
    return context;
}
