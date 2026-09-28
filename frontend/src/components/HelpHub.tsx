'use client';

import { useState, useMemo } from 'react';
import { REGIONAL_HELPLINES, Region, HelplineResource } from '@/lib/helplines';
import { 
  Phone, Globe, ShieldAlert, 
  Stethoscope, Video, MapPin, 
  ChevronRight, ExternalLink, MessageSquare,
  ArrowLeft, Info, HelpCircle, Zap
} from 'lucide-react';
import { Button } from './ui/button';

interface HelpHubProps {
  onBack: () => void;
}

export default function HelpHub({ onBack }: HelpHubProps) {
  const [selectedRegion, setSelectedRegion] = useState<Region>('India');

  const resources = REGIONAL_HELPLINES[selectedRegion];
  
  const tier1Crisis = resources.filter(r => r.type === 'Crisis');
  const professionalCare = resources.filter(r => r.type !== 'Crisis');

  const regions: Region[] = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Global'];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header section with region selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-red-400 mb-2">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Support & Care Pathways</span>
          </div>
          <h2 className="text-4xl font-bold dark:text-white text-zinc-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Professional Help Hub
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 text-lg">
            Reliable resources for when you need more than a conversation.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="text-xs text-zinc-500 font-medium">Select your region:</span>
          <div className="flex flex-wrap gap-2">
            {regions.map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                  selectedRegion === region 
                    ? 'bg-red-500/20 border-red-500/50 dark:text-white text-red-600' 
                    : 'dark:bg-white/5 dark:border-white/10 dark:text-zinc-500 dark:hover:text-white dark:hover:bg-white/10 bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Tier-1: Immediate Response */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 flex items-center justify-center border border-red-500/30">
              <Phone className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white text-zinc-900">Immediate Support</h3>
              <p className="dark:text-zinc-500 text-zinc-600 text-sm">Tier-1 First Response (Audio/Chat)</p>
            </div>
          </div>

          <div className="space-y-4">
            {tier1Crisis.map((resource, i) => (
              <div key={i} className="glass-card p-6 border-l-4 border-l-red-500 dark:hover:bg-white/10 hover:bg-zinc-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 dark:bg-white/5 bg-zinc-50 dark:border-white/10 border-zinc-200">
                <div className="flex-1">
                  <h4 className="text-lg font-bold dark:text-white text-zinc-900 mb-1">{resource.name}</h4>
                  <p className="dark:text-zinc-400 text-zinc-600 text-sm leading-relaxed">{resource.description}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {resource.phone && (
                    <a href={`tel:${resource.phone}`} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-500/20">
                      <Phone className="w-4 h-4" />
                      {resource.phone}
                    </a>
                  )}
                  {resource.text && (
                    <div className="flex items-center gap-2 dark:bg-white/10 dark:text-white bg-zinc-100 text-zinc-900 px-5 py-2 rounded-xl text-sm font-bold border dark:border-white/10 border-zinc-200">
                      <MessageSquare className="w-4 h-4" />
                      Text: {resource.text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier-2: Professional & Specialist Care */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
              <Stethoscope className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white text-zinc-900">Professional Guidance</h3>
              <p className="dark:text-zinc-500 text-zinc-600 text-sm">Tier-1/2 Assessments & Referrals</p>
            </div>
          </div>

          <div className="space-y-4">
            {professionalCare.map((resource, i) => (
              <div key={i} className="glass-card p-6 border-l-4 border-l-blue-500 dark:hover:bg-white/10 hover:bg-zinc-100 transition-all dark:bg-white/5 bg-zinc-50 dark:border-white/10 border-zinc-200">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold dark:text-white text-zinc-900">{resource.name}</h4>
                      {resource.isTier2 && (
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded border border-blue-500/30 uppercase font-black">Specilaist</span>
                      )}
                    </div>
                    <p className="dark:text-zinc-400 text-zinc-600 text-sm leading-relaxed">{resource.description}</p>
                  </div>
                  <div className="w-10 h-10 dark:bg-white/5 bg-zinc-200 rounded-xl flex items-center justify-center shrink-0 border dark:border-white/10 border-zinc-300">
                    <Video className="w-5 h-5 dark:text-zinc-400 text-zinc-600" />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {resource.phone && (
                    <a href={`tel:${resource.phone}`} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                      <Phone className="w-4 h-4" />
                      {resource.phone}
                    </a>
                  )}
                  {resource.website && (
                    <a href={resource.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm dark:text-zinc-400 text-zinc-600 dark:hover:text-white hover:text-zinc-900 transition-colors font-medium">
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            ))}
            
            {/* General Tier-2 info card */}
            <div className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-3xl border border-blue-500/20 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold text-white">In-Person Clinical Care</h4>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                For complex behavioral concerns or symptoms requiring physical evaluation, we recommend seeking help at registered mental health clinics or hospitals in your city.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                <Info className="w-3.5 h-3.5" />
                Search for &quot;Mental Health Clinics near me&quot;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="p-10 bg-white/5 rounded-[40px] border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h5 className="font-bold dark:text-white text-zinc-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" /> 
              Early Intervention
            </h5>
            <p className="dark:text-zinc-500 text-zinc-600 text-sm">Identifying challenges early prevents escalation into severe distress.</p>
          </div>
          <div className="space-y-3">
            <h5 className="font-bold dark:text-white text-zinc-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Safety First
            </h5>
            <p className="dark:text-zinc-500 text-zinc-600 text-sm">If you feel at immediate risk, please bypass digital tools and call emergency services.</p>
          </div>
          <div className="space-y-3">
            <h5 className="font-bold dark:text-white text-zinc-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              Global Reach
            </h5>
            <p className="dark:text-zinc-500 text-zinc-600 text-sm">We provide pathways for learners across all major regions and global fallback systems.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={onBack} variant="outline" className="dark:border-white/10 dark:hover:bg-white/10 dark:text-white border-zinc-200 text-zinc-900 hover:bg-zinc-100 gap-2 px-8 h-12 rounded-2xl transition-all">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
