export default function Error({ message = "Something went wrong." }) {
    return (
        <div className="bg-red-100 text-red-700 p-4 rounded-md text-center">
            {message}
        </div>
    );
}
