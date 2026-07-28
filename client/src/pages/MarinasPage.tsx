import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Poi } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Anchor, MapPin, Phone, Globe, Star, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

const CATEGORY_LABELS: Record<string, string> = {
  marina: 'Marina', anchorage: 'Anchorage', fuel_dock: 'Fuel Dock',
  restaurant: 'Restaurant', museum: 'Museum', attraction: 'Attraction',
};

export default function MarinasPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  const { data: pois = [], isLoading } = useQuery({
    queryKey: ['pois'],
    queryFn: async () => {
      const { data, error } = await supabase.from('pois').select('*').order('name');
      if (error) throw error;
      return data as Poi[];
    },
  });

  const filtered = pois.filter(p => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.address || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'all' || p.category === category;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', ...Array.from(new Set(pois.map(p => p.category)))];

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-[#002b49]">Marinas & Points of Interest</h1>
          <p className="text-[#6b7280] text-sm mt-1">Discover marinas, anchorages, restaurants, and attractions along the Great Loop route</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or location..." className="border-[#d1d5db] max-w-xs" />
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${category === cat ? 'bg-[#002b49] text-white border-[#002b49]' : 'bg-white text-[#374151] border-[#d1d5db] hover:border-[#002b49]/40'}`}>
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[#9ca3af]">Loading locations...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-[#e5e7eb]">
            <Anchor className="w-10 h-10 text-[#d1d5db] mx-auto mb-3" />
            <div className="text-[#374151] font-medium">No locations found</div>
            <div className="text-[#9ca3af] text-sm mt-1">Try adjusting your search or filters</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(poi => (
              <div key={poi.id} className="bg-white rounded-lg border border-[#e5e7eb] p-4 hover:border-[#002b49]/30 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-medium text-[#002b49] bg-[#002b49]/8 px-2 py-0.5 rounded-full">{CATEGORY_LABELS[poi.category] || poi.category}</span>
                    <h3 className="font-serif font-semibold text-[#002b49] mt-1.5 text-sm leading-tight">{poi.name}</h3>
                  </div>
                  {poi.rating && (
                    <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-medium text-[#374151]">{poi.rating}</span>
                    </div>
                  )}
                </div>
                {poi.address && (
                  <div className="flex items-start gap-1.5 text-xs text-[#6b7280] mb-2">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{poi.address}</span>
                  </div>
                )}
                {poi.description && <p className="text-xs text-[#6b7280] mb-3 line-clamp-2">{poi.description}</p>}
                <div className="flex items-center gap-3 text-xs text-[#9ca3af]">
                  {poi.phone && <a href={`tel:${poi.phone}`} className="flex items-center gap-1 hover:text-[#002b49] transition-colors"><Phone className="w-3 h-3" />{poi.phone}</a>}
                  {poi.website && <a href={poi.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#002b49] transition-colors"><Globe className="w-3 h-3" />Website <ExternalLink className="w-2.5 h-2.5" /></a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

