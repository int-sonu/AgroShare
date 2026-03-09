import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">Products</CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">Orders</CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">Revenue</CardContent>
      </Card>
    </div>
  );
}
