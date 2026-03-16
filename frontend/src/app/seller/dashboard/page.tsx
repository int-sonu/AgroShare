import { Card, CardContent } from '@/components/ui/card';
import { Package, ShoppingCart, DollarSign } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-sm border">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <h2 className="text-2xl font-semibold mt-1">24</h2>
          </div>
          <Package className="text-green-600" size={28} />
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Orders</p>
            <h2 className="text-2xl font-semibold mt-1">12</h2>
          </div>
          <ShoppingCart className="text-green-600" size={28} />
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <h2 className="text-2xl font-semibold mt-1">₹18,500</h2>
          </div>
          <DollarSign className="text-green-600" size={28} />
        </CardContent>
      </Card>
    </div>
  );
}
