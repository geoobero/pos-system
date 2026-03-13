"use client";

import { useState } from "react";

export default function UsersPage() {
    const [users, setUsers] = useState([
        { id: 1, name: "Admin", email: "admin@pos.com", role: "admin", active: true },
        { id: 2, name: "Cashier 1", email: "cashier1@pos.com", role: "cashier", active: true },
    ]);

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        role: "cashier",
    });

    function addUser(e) {
        e.preventDefault();

        if (!newUser.name || !newUser.email) return;

        setUsers([
            ...users,
            {
                id: Date.now(),
                ...newUser,
                active: true,
            },
        ]);

        setNewUser({ name: "", email: "", role: "cashier" });
    }

    function toggleUser(id) {
        setUsers(
            users.map((u) =>
                u.id === id ? { ...u, active: !u.active } : u
            )
        );
    }

    function deleteUser(id) {
        setUsers(users.filter((u) => u.id !== id));
    }

    return (
        <div className="text-gray-600">
            <h1 className="text-2xl font-bold mb-6">Users</h1>

            {/* Add User */}
            <form
                onSubmit={addUser}
                className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6"
            >
                <input
                    type="text"
                    placeholder="Full name"
                    className="border border-gray-300 rounded px-3 py-2"
                    value={newUser.name}
                    onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                    }
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 rounded px-3 py-2"
                    value={newUser.email}
                    onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                    }
                />

                <select
                    className="border border-gray-300 rounded px-3 py-2"
                    value={newUser.role}
                    onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                    }
                >
                    <option value="cashier">Cashier</option>
                    <option value="admin">Admin</option>
                </select>

                <button
                    type="submit"
                    className="bg-blue-600 text-white rounded px-4 hover:bg-blue-700"
                >
                    Add User
                </button>
            </form>

            {/* Users Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b">
                                <td className="px-4 py-2">{user.name}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2 capitalize">{user.role}</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`text-sm font-medium ${user.active ? "text-green-600" : "text-gray-400"
                                            }`}
                                    >
                                        {user.active ? "Active" : "Disabled"}
                                    </span>
                                </td>
                                <td className="px-4 py-2 space-x-3">
                                    <button
                                        onClick={() => toggleUser(user.id)}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        {user.active ? "Disable" : "Enable"}
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        className="text-red-600 hover:underline text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
