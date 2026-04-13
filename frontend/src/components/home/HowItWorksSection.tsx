import { Search, CalendarCheck, Sprout } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section className="pt-10 pb-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 font-sans">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter mb-1">
            How AgroShare Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto font-black uppercase text-[9px] tracking-widest leading-relaxed opacity-60">
            Three simple steps to access modern agricultural machinery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 bg-green-100/50 rounded-2xl flex items-center justify-center mb-6 text-green-600">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-2 tracking-tight">
              Browse & Discover
            </h3>
            <p className="text-gray-500 text-[12px] font-medium leading-relaxed px-4">
              Explore a wide range of machines tailored to your farming needs.
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-green-600/20">
              <CalendarCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-2 tracking-tight">
              Book with Ease
            </h3>
            <p className="text-gray-500 text-[12px] font-medium leading-relaxed px-4">
              Select your duration and book securely through our platform.
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 bg-green-100/50 rounded-2xl flex items-center justify-center mb-6 text-green-600">
              <Sprout className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-2 tracking-tight">
              Grow Your Yield
            </h3>
            <p className="text-gray-500 text-[12px] font-medium leading-relaxed px-4">
              Get the equipment delivered and focus on farming efficiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
