import AppLayout from '@/components/AppLayout';
import { CloudSun, Wind, Waves, Thermometer, Eye, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NOAA_LINKS = [
  { label: 'NOAA Marine Forecasts', url: 'https://www.weather.gov/marine/', desc: 'Official US marine weather forecasts by zone' },
  { label: 'Windy.com', url: 'https://www.windy.com/?35,-80,5', desc: 'Interactive wind, wave, and weather visualization' },
  { label: 'PredictWind', url: 'https://www.predictwind.com/', desc: 'Professional marine weather routing' },
  { label: 'PassageWeather', url: 'https://www.passageweather.com/', desc: 'Wind and wave forecasts for coastal passages' },
  { label: 'NOAA Tides & Currents', url: 'https://tidesandcurrents.noaa.gov/', desc: 'Tide predictions and current data' },
  { label: 'NWS Offshore Forecasts', url: 'https://www.weather.gov/mfl/offshore', desc: 'Offshore and coastal marine forecasts' },
];

const GREAT_LOOP_WEATHER_TIPS = [
  { season: 'Spring (Mar–May)', tip: 'Best time for the northern loop. Avoid the Gulf in hurricane season. Watch for late-season cold fronts on the Great Lakes.' },
  { season: 'Summer (Jun–Aug)', tip: 'Hurricane season begins June 1. Many Loopers head north to the Great Lakes and Canada to avoid Gulf and Atlantic storms.' },
  { season: 'Fall (Sep–Nov)', tip: 'Popular time to head south. Watch for early northeasters on the ICW and late-season hurricanes through October.' },
  { season: 'Winter (Dec–Feb)', tip: 'Ideal for the Gulf Coast and Florida. Avoid the Great Lakes (frozen) and northern rivers (low water/ice).' },
];

export default function WeatherPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-[#002b49]">Weather Resources</h1>
          <p className="text-[#6b7280] text-sm mt-1">Marine weather tools and seasonal planning guidance for the Great Loop</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weather links */}
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#002b49] mb-3">Marine Weather Tools</h2>
            <div className="space-y-2">
              {NOAA_LINKS.map(link => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#e5e7eb] hover:border-[#002b49]/30 hover:shadow-sm transition-all group">
                  <CloudSun className="w-4 h-4 text-[#002b49] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#002b49] group-hover:underline">{link.label}</div>
                    <div className="text-xs text-[#6b7280] mt-0.5">{link.desc}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#9ca3af] flex-shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Seasonal tips */}
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#002b49] mb-3">Seasonal Planning Guide</h2>
            <div className="space-y-3">
              {GREAT_LOOP_WEATHER_TIPS.map(item => (
                <Card key={item.season} className="border-[#e5e7eb]">
                  <CardContent className="p-4">
                    <div className="text-sm font-semibold text-[#002b49] mb-1">{item.season}</div>
                    <div className="text-sm text-[#6b7280]">{item.tip}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-[#002b49]/20 bg-[#002b49]/5 mt-4">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-[#002b49] uppercase tracking-wider mb-2">Key Weather Concepts</div>
                <div className="space-y-2 text-xs text-[#374151]">
                  <div className="flex gap-2"><Wind className="w-3.5 h-3.5 text-[#002b49] mt-0.5 flex-shrink-0" /><span><strong>Weather windows:</strong> Plan passages around 3–5 day forecasts. Never leave on a deteriorating forecast.</span></div>
                  <div className="flex gap-2"><Waves className="w-3.5 h-3.5 text-[#002b49] mt-0.5 flex-shrink-0" /><span><strong>Wave height:</strong> For inland waters, 2–3 ft is manageable. Open Gulf/ocean passages require more caution.</span></div>
                  <div className="flex gap-2"><Thermometer className="w-3.5 h-3.5 text-[#002b49] mt-0.5 flex-shrink-0" /><span><strong>Cold fronts:</strong> The ICW and Gulf see regular cold fronts Oct–Apr. Plan 1–2 day layovers in your schedule.</span></div>
                  <div className="flex gap-2"><Eye className="w-3.5 h-3.5 text-[#002b49] mt-0.5 flex-shrink-0" /><span><strong>Visibility:</strong> Fog is common on the Great Lakes and in the Chesapeake in spring/fall mornings.</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

