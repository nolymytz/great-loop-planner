import AppLayout from '@/components/AppLayout';
import { ExternalLink, Users, BookOpen, Anchor, Radio, Youtube, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const RESOURCES = [
  {
    category: 'Official Organizations',
    icon: Anchor,
    items: [
      { label: 'America\'s Great Loop Cruisers\' Association (AGLCA)', url: 'https://www.greatloop.org', desc: 'The official organization for Great Loop cruisers. Events, resources, burgee program.' },
      { label: 'Waterway Guide', url: 'https://www.waterwayguide.com', desc: 'The definitive guide to US waterways. Marina info, anchorages, bridge data.' },
      { label: 'Active Captain', url: 'https://activecaptain.garmin.com', desc: 'Community-sourced marina reviews, hazards, and waypoints.' },
    ]
  },
  {
    category: 'Forums & Communities',
    icon: Users,
    items: [
      { label: 'AGLCA Facebook Group', url: 'https://www.facebook.com/groups/greatloop', desc: 'Active community of Loopers sharing tips, questions, and trip reports.' },
      { label: 'Cruisers Forum – Great Loop', url: 'https://www.cruisersforum.com', desc: 'In-depth discussions on boats, routes, and cruising life.' },
      { label: 'The Looper Magazine', url: 'https://www.greatloop.org/looper-magazine', desc: 'AGLCA\'s official publication with trip reports and cruising tips.' },
    ]
  },
  {
    category: 'Podcasts & YouTube',
    icon: Youtube,
    items: [
      { label: 'Loopers on the Water (Podcast)', url: 'https://www.greatloop.org/podcast', desc: 'Stories and advice from Loopers who have completed the journey.' },
      { label: 'Krogen Cruisers YouTube', url: 'https://www.youtube.com/@KrogenCruisers', desc: 'Trawler cruising content and Great Loop trip videos.' },
      { label: 'Gone With the Wynns', url: 'https://www.gonewiththewynns.com', desc: 'Popular cruising lifestyle channel with liveaboard content.' },
    ]
  },
  {
    category: 'Navigation & Charts',
    icon: Globe,
    items: [
      { label: 'NOAA Chart Viewer', url: 'https://charts.noaa.gov', desc: 'Free official US nautical charts for all Great Loop waterways.' },
      { label: 'Navionics Web App', url: 'https://webapp.navionics.com', desc: 'Interactive charts with marina, anchorage, and depth data.' },
      { label: 'Army Corps of Engineers', url: 'https://www.mvs.usace.army.mil/Missions/Navigation/', desc: 'River levels, lock status, and navigation notices for inland waterways.' },
    ]
  },
  {
    category: 'Reference Books',
    icon: BookOpen,
    items: [
      { label: 'The Great Loop Experience (Ron & Eva Stob)', url: 'https://www.amazon.com/s?k=great+loop+experience', desc: 'The classic guide to planning and completing the Great Loop.' },
      { label: 'Skipper Bob Anchorages (Series)', url: 'https://www.amazon.com/s?k=skipper+bob+anchorages', desc: 'Detailed anchorage guides for the ICW and Great Loop route.' },
      { label: 'Waterway Guide (Annual Editions)', url: 'https://www.waterwayguide.com/store', desc: 'Printed cruising guides for the Atlantic ICW, Great Lakes, and Gulf.' },
    ]
  },
  {
    category: 'VHF & Radio',
    icon: Radio,
    items: [
      { label: 'USCG Boating Safety', url: 'https://www.uscgboating.org', desc: 'Safety requirements, float plans, and emergency procedures.' },
      { label: 'Lock & Bridge Radio Channels', url: 'https://www.waterwayguide.com/knowledge-center', desc: 'VHF channel reference for locks, bridges, and marinas along the route.' },
      { label: 'Sea Tow & TowBoatUS', url: 'https://www.seatow.com', desc: 'On-water towing and assistance membership — essential for the Loop.' },
    ]
  },
];

export default function CommunityPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-[#002b49]">Community & Resources</h1>
          <p className="text-[#6b7280] text-sm mt-1">Essential links, communities, and references for Great Loop planning and cruising</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {RESOURCES.map(section => {
            const Icon = section.icon;
            return (
              <div key={section.category}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-[#002b49]" />
                  <h2 className="font-serif text-base font-semibold text-[#002b49]">{section.category}</h2>
                </div>
                <div className="space-y-2">
                  {section.items.map(item => (
                    <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3.5 bg-white rounded-lg border border-[#e5e7eb] hover:border-[#002b49]/30 hover:shadow-sm transition-all group">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#002b49] group-hover:underline">{item.label}</div>
                        <div className="text-xs text-[#6b7280] mt-0.5">{item.desc}</div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#9ca3af] flex-shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

