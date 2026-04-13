import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { InventorySection } from '@/components/home/InventorySection';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="font-sans">
      <HeroSection />
      <CategorySection />
      <HowItWorksSection />
      <InventorySection />
      <Footer />
    </div>
  );
}
