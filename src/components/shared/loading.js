export default function Loading({ message = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600">{message}</p>
        </div>
    );
}
