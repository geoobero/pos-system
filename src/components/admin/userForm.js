"use client";

import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";

export default function UserForm({ isOpen, onClose, onSubmit, initialData }) {
    const [name, setName] = useState(initialData?.name || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [role, setRole] = useState(initialData?.role || "staff");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || (!initialData && !password)) {
            setError("Please fill in all required fields");
            return;
        }

        onSubmit?.({
            id: initialData?.id,
            name: name.trim(),
            email: email.trim(),
            role,
            password: password || undefined,
        });

        // Reset form
        setName("");
        setEmail("");
        setRole("staff");
        setPassword("");
        setError("");
        onClose?.();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit User" : "Add User"}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                {!initialData && (
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                )}

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring border-gray-300 focus:ring-blue-300"
                    >
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

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
