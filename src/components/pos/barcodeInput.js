"use client";

import { useEffect, useRef, useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function BarcodeInput({ onScan }) {
    const [barcode, setBarcode] = useState("");
    const inputRef = useRef(null);

    // Auto-focus on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!barcode.trim()) return;

        onScan(barcode.trim());
        setBarcode("");

        // Re-focus after scan
        inputRef.current?.focus();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex gap-2 items-end text-gray-600"
        >
            <Input
                ref={inputRef}
                label="Scan or Enter Barcode"
                placeholder="e.g. 123456789"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1"
            />

            <Button type="submit">
                Add
            </Button>
        </form>
    );
}
