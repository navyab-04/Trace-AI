'use client';

import React from 'react';
import { ShieldAlert, AlertCircle, CheckCircle2, Lock, Eye } from 'lucide-react';
import { DigitalExposureData } from '../../../lib/api';

interface Props {
  exposure: DigitalExposureData | null;
}

export default function ExposureRadarWidget({ exposure }: Props) {
  if (!exposure) return null;

  const getRiskColor = (badge: string) => {
    switch (badge) {
      case 'HIGH':
        return 'text-red-400 bg-red-950/80 border-red-800';
      case 'MODERATE':
        return 'text-amber-400 bg-amber-950/80 border-amber-800';
      default:
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    }
  };

  return (
    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            <span>Digital Footprint Threat & Exposure Radar</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Surface Exposure Analysis for {exposure.target_name}</h3>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`px-3.5 py-1.5 rounded-full border text-xs font-mono font-extrabold tracking-wider ${getRiskColor(exposure.risk_badge)}`}>
            {exposure.exposure_level.toUpperCase()}
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Exposure Index</span>
            <span className="text-2xl font-black text-amber-400">{exposure.surface_score} / 100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vulnerability Vectors */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Vulnerability & Impersonation Vectors</span>
          </h4>
          <div className="space-y-2">
            {exposure.vulnerability_vectors.map((vec, idx) => (
              <div key={idx} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200 flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{vec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Privacy Mitigations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Recommended Privacy Mitigations</span>
          </h4>
          <div className="space-y-2">
            {exposure.recommended_mitigations.map((mit, idx) => (
              <div key={idx} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{mit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
