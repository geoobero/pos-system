export default function Table({ columns = [], data = [] }) {
    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="text-left px-4 py-2 text-sm font-medium text-gray-700"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center py-6 text-gray-500"
                            >
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, i) => (
                            <tr
                                key={i}
                                className="border-t hover:bg-gray-50"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-2 text-sm">
                                        {row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
