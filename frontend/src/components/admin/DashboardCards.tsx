import { Card, CardContent } from '@/components/ui/card';
import { Users, Store, Tractor, ShoppingCart } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalCategories: number;
  pendingSellers: number;
  totalMachines?: number;
  totalOrders?: number;
}

export default function DashboardCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      title: 'Active Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'sage',
    },
    {
      title: 'Merchants',
      value: stats.totalSellers || 0,
      icon: Store,
      color: 'sage',
    },
    {
      title: 'Fleet Size',
      value: stats.totalMachines || 0,
      icon: Tractor,
      color: 'earth',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: ShoppingCart,
      color: 'sage',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300"
        >
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-2.5 rounded-xl ${
                  card.color === 'earth'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-primary/10 text-primary'
                } transition-transform group-hover:scale-110`}
              >
                <card.icon size={20} strokeWidth={2.5} />
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1.5">
                {card.title}
              </p>
              <h3 className="text-2xl font-black text-slate-950 tracking-tighter">
                {(card.value ?? 0).toLocaleString()}
              </h3>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                vs last 30 days
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
