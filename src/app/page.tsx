import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-8">
      {/* Logo / Title */}
      <h1 className="text-6xl font-extrabold tracking-tight">☕ Coffee SNOB</h1>

      {/* Tagline */}
      <p className="mt-4 text-lg text-gray-600 text-center max-w-md">
        Discover the best specialty coffee shops near you — curated and Coffee SNOB approved.
      </p>

      {/* Call to Action */}
      <div className="mt-8">
        <a
          href="/shops"
          className="rounded-md border border-black px-6 py-3 text-black font-semibold hover:bg-black hover:text-white transition"
        >
          Find Coffee Shops
        </a>
      </div>
    </main>
  );
}
