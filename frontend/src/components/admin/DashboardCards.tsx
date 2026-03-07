import { Card, CardContent } from "@/components/ui/card";
import { Users, Store, Tractor, ShoppingCart } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalCategories: number;
  pendingSellers: number;
  totalMachines?: number;
  totalOrders?: number;
}

export default function DashboardCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      <Card className="hover:shadow-lg transition">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Users</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <Users className="text-green-600" size={28} />
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Sellers</p>
            <p className="text-2xl font-bold">{stats.totalSellers}</p>
          </div>
          <Store className="text-green-600" size={28} />
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Machines</p>
            <p className="text-2xl font-bold">{stats.totalMachines}</p>
          </div>
          <Tractor className="text-green-600" size={28} />
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Orders</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <ShoppingCart className="text-green-600" size={28} />
        </CardContent>
      </Card>

    </div>
  );
}