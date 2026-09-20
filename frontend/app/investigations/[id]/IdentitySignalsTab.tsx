'use client';

import React from 'react';
import { 
  CheckCircle2, ExternalLink, Building2, GraduationCap, MapPin, 
  Globe, Mail, Phone, User, AtSign, Sparkles, FolderGit2,
  Share2, Shield, Info, Cpu, Layers, Eye
} from 'lucide-react';
import { IdentitySignalsData } from '../../../lib/api';

interface Props {
  identitySignals?: IdentitySignalsData | null;
}

export default function IdentitySignalsTab({ identitySignals }: Props) {
  if (!identitySignals) {
    return (
      <div className="bg-slate-950 p-12 rounded-2xl border border-slate-800 text-center space-y-4">
        <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Identity Signals Found</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Upload an image on the dashboard or run Image Intelligence to extract the 11 core identity signals.
        </p>
      </div>
    );
  }

  const signals = identitySignals;
  const completeness = signals.completeness_percentage || 0;

  // Signal card renderer
  const renderSignalCard = (
    label: string,
    value: string | string[] | null | undefined,
    icon: React.ElementType,
    sourceKey: string,
    isList: boolean = false
  ) => {
    const IconComponent = icon;
    const hasValue = isList ? (Array.isArray(value) && value.length > 0) : Boolean(value);
    const source = signals.signal_sources?.[sourceKey] || (hasValue ? 'Verified Intelligence' : 'Not Detected');

    return (
      <div className={`p-4 rounded-xl border transition ${
        hasValue 
          ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40' 
          : 'bg-slate-950/40 border-slate-900 opacity-60'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <IconComponent className={`w-3.5 h-3.5 ${hasValue ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>{label}</span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
            hasValue 
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/40' 
              : 'bg-slate-900 text-slate-500'
          }`}>
            {source}
          </span>
        </div>

        <div className="mt-1">
          {hasValue ? (
            isList && Array.isArray(value) ? (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {value.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/60 text-xs text-slate-200"
                  >
                    {item.startsWith('http') ? (
                      <a href={item} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 flex items-center space-x-1">
                        <span>{item.replace(/https?:\/\/(www\.)?/, '')}</span>
                        <ExternalLink className="w-2.5 h-2.5 ml-1 opacity-70" />
                      </a>
                    ) : (
                      <span>{item}</span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-white break-words">
                {typeof value === 'string' && value.startsWith('http') ? (
                  <a href={value} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center space-x-1">
                    <span>{value}</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                ) : (
                  value
                )}
              </p>
            )
          ) : (
            <span className="text-xs text-slate-500 italic">None detected</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/60 p-6 rounded-2xl border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold font-mono">
              STAGE 02 &bull; IDENTITY SIGNALS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
              12 Signal Vectors (Biometric + OSINT)
            </span>
          </div>
          <h3 className="text-xl font-black text-white">Discovered Identity Signals Matrix</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Synthesized directly from Image Analysis Face Signals (Branch A) and OCR Text, document layout, EXIF metadata, and QR decoding (Branch B) to seed multi-platform footprint correlation.
          </p>
        </div>

        {/* Completeness Gauge */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center min-w-[220px]">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">
            Signal Completeness
          </span>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl font-black text-cyan-400">{completeness}%</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${completeness}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">
            12 of 12 Vectors Tracked
          </span>
        </div>
      </div>

      {/* 12 Signals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>12 Discovered Identity Signal Vectors</span>
          </h4>
          <span className="text-xs text-slate-400 font-mono">
            Derived from Stage 01 Dual-Branch Visual Intelligence
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderSignalCard("Target Name", signals.name, User, "name")}
          {renderSignalCard("Known Username", signals.username, AtSign, "username")}
          {renderSignalCard("Primary Organization", signals.organization, Building2, "organization")}
          {renderSignalCard("College / University", signals.college, GraduationCap, "college")}
          {renderSignalCard("Facial Biometrics & 128-D Vector", signals.face_detected ? `Hash: ${signals.face_hash || 'Synthesized'} | 128-D Vector (${signals.biometric_status || 'AUTHENTICATED'})` : null, Eye, "face_biometrics")}
          {renderSignalCard("Operating Location", signals.location, MapPin, "location")}
          {renderSignalCard("Email Address", signals.email, Mail, "email")}
          {renderSignalCard("Phone Number", signals.phone, Phone, "phone")}
          {renderSignalCard("Personal Website", signals.website, Globe, "website")}
          {renderSignalCard("Social Profiles", signals.social_urls, Share2, "social_urls", true)}
          {renderSignalCard("Technical Skills", signals.skills, Cpu, "skills", true)}
          {renderSignalCard("Projects & Codebases", signals.projects, FolderGit2, "projects", true)}
        </div>
      </div>
    </div>
  );
}
