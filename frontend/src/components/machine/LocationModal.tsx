"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Search, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Location {
  district: string;
  state: string;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
  currentLocation: string;
}

export default function LocationModal({ isOpen, onClose, onSelect, currentLocation }: LocationModalProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchLocations = async () => {
        try {
          setLoading(true);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/locations`);
          const data = await res.json();
          if (data.success) {
            setLocations(data.data);
          }
        } catch (error) {
          console.error("Failed to fetch locations:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchLocations();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLocations = locations.filter(
    (loc) =>
      loc.district.toLowerCase().includes(search.toLowerCase()) ||
      loc.state.toLowerCase().includes(search.toLowerCase())
  );

  // Group by state
  const groupedLocations = filteredLocations.reduce((acc, loc) => {
    if (!acc[loc.state]) acc[loc.state] = [];
    acc[loc.state].push(loc.district);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
        <div className="bg-green-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Select Location</h2>
              <p className="text-green-100 text-[12px] font-bold uppercase tracking-widest">Find machinery near you</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-700" />
            <Input 
              placeholder="Search city, district or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/95 border-0 rounded-full pl-11 h-12 text-gray-900 font-medium placeholder:text-gray-400 focus-visible:ring-0 shadow-lg"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <div className="w-8 h-8 border-3 border-gray-100 border-t-green-600 rounded-full animate-spin"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Fetching Areas...</span>
            </div>
          ) : filteredLocations.length > 0 ? (
            <div className="space-y-8">
              {currentLocation !== "Select City" && (
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Currently Selected</h3>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-black text-gray-900">{currentLocation}</span>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 uppercase">Active</span>
                  </div>
                </div>
              )}

              {/* ALL LOCATIONS */}
              <div className="space-y-6">
                {Object.entries(groupedLocations).map(([state, districts]) => (
                  <div key={state}>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{state}</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {districts.map((district) => (
                        <button
                          key={district}
                          onClick={() => onSelect(`${district}, ${state}`)}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 group ${
                            currentLocation === `${district}, ${state}` 
                              ? 'bg-green-50 border-green-200 ring-2 ring-green-100' 
                              : 'bg-gray-50/50 border-gray-100 hover:bg-white hover:border-green-200 hover:shadow-lg hover:shadow-green-900/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors ${
                              currentLocation === `${district}, ${state}` ? 'bg-green-600 text-white' : 'bg-white text-gray-400'
                            }`}>
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{district}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-200" />
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-1">No areas found</h4>
              <p className="text-[13px] font-medium text-gray-400 max-w-[200px]">We don't have any machinery listed in "{search}" yet.</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => onSelect("Select City")}
            className="text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50"
          >
            Clear Selection
          </Button>
          <Button 
            onClick={onClose}
            className="h-11 px-8 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
