import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-amber-50 p-8">
      {/* Logo / Title */}
      <h1 className="text-5xl font-bold text-amber-900">☕ Coffee SNOB</h1>

      {/* Tagline */}
      <p className="mt-4 text-lg text-gray-700 text-center max-w-md">
        Discover the best specialty coffee shops near you — curated and Coffee SNOB approved.
      </p>

      {/* Call to Action */}
      <div className="mt-8">
        <a
          href="/shops"
          className="rounded-xl bg-amber-700 px-6 py-3 text-white font-semibold shadow-md hover:bg-amber-800 transition"
        >
          Find Coffee Shops
        </a>
      </div>
    </main>
  );
}
