import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Fuel, Calculator, TrendingUp, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FuelCalcPage() {
  const { user } = useAuth();
  const [distance, setDistance] = useState('');
  const [fuelPrice, setFuelPrice] = useState('4.50');
  const [speed, setSpeed] = useState('');
  const [consumption, setConsumption] = useState('');

  const { data: vessel } = useQuery({
    queryKey: ['vessel', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('vessel_profiles').select('*').eq('user_id', user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const cruisingSpeed = parseFloat(speed) || vessel?.cruising_speed || 8;
  const fuelConsumption = parseFloat(consumption) || vessel?.fuel_consumption || 2;
  const fuelRange = vessel?.fuel_range || 300;
  const distanceNm = parseFloat(distance) || 0;
  const pricePerGallon = parseFloat(fuelPrice) || 4.50;

  const totalFuel = distanceNm > 0 ? (distanceNm / cruisingSpeed) * fuelConsumption : 0;
  const totalCost = totalFuel * pricePerGallon;
  const travelHours = distanceNm > 0 ? distanceNm / cruisingSpeed : 0;
  const fuelStops = fuelRange > 0 ? Math.floor(distanceNm / fuelRange) : 0;

  // Great Loop total: ~6,000 nm
  const fullLoopFuel = (6000 / cruisingSpeed) * fuelConsumption;
  const fullLoopCost = fullLoopFuel * pricePerGallon;

  const statCard = (icon: React.ReactNode, label: string, value: string, sub?: string) => (
    <Card className="border-[#e5e7eb]">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#002b49]/8 flex items-center justify-center text-[#002b49]">{icon}</div>
          <div>
            <div className="text-xs text-[#6b7280] uppercase tracking-wider font-medium">{label}</div>
            <div className="text-2xl font-bold text-[#002b49] mt-0.5">{value}</div>
            {sub && <div className="text-xs text-[#9ca3af] mt-0.5">{sub}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-[#002b49]">Fuel Calculator</h1>
          <p className="text-[#6b7280] text-sm mt-1">Estimate fuel costs and plan fuel stops for your voyage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <Card className="border-[#e5e7eb]">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg text-[#002b49]">Voyage Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#374151] uppercase tracking-wider">Distance (nautical miles)</Label>
                <Input value={distance} onChange={e => setDistance(e.target.value)} placeholder="e.g. 450" type="number" className="border-[#d1d5db]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#374151] uppercase tracking-wider">Cruising Speed (knots)</Label>
                <Input value={speed} onChange={e => setSpeed(e.target.value)} placeholder={`${cruisingSpeed} (from vessel profile)`} type="number" className="border-[#d1d5db]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#374151] uppercase tracking-wider">Fuel Consumption (gal/hr)</Label>
                <Input value={consumption} onChange={e => setConsumption(e.target.value)} placeholder={`${fuelConsumption} (from vessel profile)`} type="number" className="border-[#d1d5db]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#374151] uppercase tracking-wider">Fuel Price ($/gallon)</Label>
                <Input value={fuelPrice} onChange={e => setFuelPrice(e.target.value)} placeholder="4.50" type="number" step="0.01" className="border-[#d1d5db]" />
              </div>
              {vessel && (
                <div className="bg-[#f0f4f8] rounded-lg p-3 text-xs text-[#6b7280]">
                  <span className="font-medium text-[#002b49]">Vessel profile loaded:</span> {vessel.boat_name || 'Your vessel'} · Fuel range: {fuelRange} nm
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {statCard(<Fuel className="w-4 h-4" />, 'Fuel Required', distanceNm > 0 ? `${totalFuel.toFixed(0)} gal` : '—', 'for this voyage')}
              {statCard(<Calculator className="w-4 h-4" />, 'Estimated Cost', distanceNm > 0 ? `$${totalCost.toFixed(0)}` : '—', `@ $${pricePerGallon}/gal`)}
              {statCard(<TrendingUp className="w-4 h-4" />, 'Travel Time', distanceNm > 0 ? `${travelHours.toFixed(1)} hrs` : '—', `at ${cruisingSpeed} knots`)}
              {statCard(<Droplets className="w-4 h-4" />, 'Fuel Stops', distanceNm > 0 ? `${fuelStops}` : '—', `every ${fuelRange} nm`)}
            </div>

            {/* Full Loop estimate */}
            <Card className="border-[#002b49]/20 bg-[#002b49]/5">
              <CardContent className="p-5">
                <div className="text-xs font-medium text-[#002b49] uppercase tracking-wider mb-3">Full Great Loop Estimate</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><div className="text-[#6b7280] text-xs">Total Distance</div><div className="font-bold text-[#002b49]">~6,000 nm</div></div>
                  <div><div className="text-[#6b7280] text-xs">Fuel Required</div><div className="font-bold text-[#002b49]">{fullLoopFuel.toFixed(0)} gal</div></div>
                  <div><div className="text-[#6b7280] text-xs">Estimated Cost</div><div className="font-bold text-[#002b49]">${fullLoopCost.toFixed(0)}</div></div>
                  <div><div className="text-[#6b7280] text-xs">Travel Time</div><div className="font-bold text-[#002b49]">{(6000/cruisingSpeed).toFixed(0)} hrs underway</div></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

