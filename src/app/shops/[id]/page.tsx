import shops from "@/data/shops.json";
import Link from "next/link";

export default function ShopDetail({ params }: { params: { id: string } }) {
    const shop = shops.find((s) => s.id === Number(params.id));

    if (!shop) {
        return (
            <main className="p-8">
                <h1 className="text-2xl font-bold">Shop not found</h1>
                <Link href="/shops" className="text-blue-600 hover:underline">
                    Back to Shops
                </Link>
            </main>
        );
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold">{shop.name}</h1>
            <p className="text-gray-600">{shop.city}</p>
            <p className="mb-4">{shop.address}</p>
            <a
                href={shop.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
            >
                Visit Website
            </a>
            <div className="mt-6">
                <Link
                    href="/shops" className="text-black border px-3 py-1 rounded">
                    Back to Shops
                </Link>
            </div>
        </main>
    );
}