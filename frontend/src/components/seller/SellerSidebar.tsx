import Link from 'next/link';

export default function SellerSidebar() {
  return (
    <aside className="w-64 bg-white border-r p-6">
      <h2 className="text-xl font-bold mb-6">Seller Panel</h2>

      <nav className="flex flex-col gap-4">
        <Link href="/seller/dashboard">Dashboard</Link>

        <Link href="/seller/products">Products</Link>

        <Link href="/seller/orders">Orders</Link>
      </nav>
    </aside>
  );
}
