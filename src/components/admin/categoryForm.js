"use client";

import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";

export default function CategoryForm({ isOpen, onClose, onSubmit, initialData }) {
    const [name, setName] = useState(initialData?.name || "");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Category name is required");
            return;
        }

        onSubmit?.({ id: initialData?.id, name: name.trim() });
        setName("");
        setError("");
        onClose?.();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Category" : "Add Category"}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error}
                />

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        {initialData ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
