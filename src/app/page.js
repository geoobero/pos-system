export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl text-gray-600 font-bold mb-4">
          POS System
        </h1>

        <p className="text-gray-600 mb-6">
          Welcome to the Online Point of Sale System
        </p>

        <div className="space-y-3">
          <a
            href="/login"
            className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </a>
        </div>
      </div>
    </main>
  );
}
