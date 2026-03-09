import { Card, CardContent } from '@/components/ui/card';

export default function PendingPage() {
  return (
    <div className="flex justify-center mt-20">
      <Card className="w-[400px]">
        <CardContent className="p-6 text-center">
          <h2 className="text-xl font-bold">Waiting for Admin Approval</h2>

          <p className="text-gray-500 mt-2">Your seller profile is under review.</p>
        </CardContent>
      </Card>
    </div>
  );
}
