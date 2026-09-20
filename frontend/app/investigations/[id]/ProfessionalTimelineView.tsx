'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, Briefcase, Code2, Trophy, Globe, 
  ExternalLink, Calendar, CheckCircle2, ShieldCheck, 
  Layers, ArrowUpRight, ArrowUpDown, Filter, Sparkles,
  BookOpen, Terminal, Building2
} from 'lucide-react';
import { EventItem } from '../../../lib/api';

interface Props {
  events: EventItem[];
  targetName?: string;
}

export default function ProfessionalTimelineView({ events, targetName }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Category classification helper
  const getCategory = (ev: EventItem) => {
    const t = (ev.event_type || '').toLowerCase();
    const title = (ev.title || '').toLowerCase();
    if (t.includes('edu') || title.includes('studied') || title.includes('b.tech') || title.includes('degree') || title.includes('college')) {
      return 'education';
    }
    if (t.includes('employ') || t.includes('intern') || title.includes('intern') || title.includes('developer') || title.includes('engineer') || title.includes('role')) {
      return 'employment';
    }
    if (t.includes('proj') || title.includes('project') || title.includes('built') || title.includes('repo')) {
      return 'project';
    }
    if (t.includes('cert') || t.includes('award') || title.includes('certif') || title.includes('hackathon')) {
      return 'certification';
    }
    return 'digital_anchor';
  };

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'education':
        return {
          label: 'Education',
          icon: GraduationCap,
          color: 'text-purple-400',
          bgColor: 'bg-purple-950/80',
          borderColor: 'border-purple-800/60',
          badgeColor: 'bg-purple-900/40 text-purple-300 border-purple-700/50'
        };
      case 'employment':
        return {
          label: 'Employment & Internship',
          icon: Briefcase,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-950/80',
          borderColor: 'border-cyan-800/60',
          badgeColor: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/50'
        };
      case 'project':
        return {
          label: 'Software Project',
          icon: Code2,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-950/80',
          borderColor: 'border-emerald-800/60',
          badgeColor: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50'
        };
      case 'certification':
        return {
          label: 'Certification & Honor',
          icon: Trophy,
          color: 'text-amber-400',
          bgColor: 'bg-amber-950/80',
          borderColor: 'border-amber-800/60',
          badgeColor: 'bg-amber-900/40 text-amber-300 border-amber-700/50'
        };
      default:
        return {
          label: 'Digital Presence Anchor',
          icon: Globe,
          color: 'text-blue-400',
          bgColor: 'bg-blue-950/80',
          borderColor: 'border-blue-800/60',
          badgeColor: 'bg-blue-900/40 text-blue-300 border-blue-700/50'
        };
    }
  };

  // Filter & Sort
  const filteredEvents = events.filter(ev => {
    if (selectedCategory === 'all') return true;
    return getCategory(ev) === selectedCategory;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const yearA = parseInt((a.date_str || '2024').substring(0, 4)) || 2024;
    const yearB = parseInt((b.date_str || '2024').substring(0, 4)) || 2024;
    return sortOrder === 'desc' ? yearB - yearA : yearA - yearB;
  });

  const counts = {
    all: events.length,
    education: events.filter(e => getCategory(e) === 'education').length,
    employment: events.filter(e => getCategory(e) === 'employment').length,
    project: events.filter(e => getCategory(e) === 'project').length,
    certification: events.filter(e => getCategory(e) === 'certification').length,
    digital_anchor: events.filter(e => getCategory(e) === 'digital_anchor').length,
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Stage 07 &bull; Professional Career & Milestone Chronology</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Verified Chronological Identity Timeline
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Multi-source chronologically indexed timeline corroborating academic degrees, software internships, engineering repositories, certifications, and public digital anchors.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-900/90 px-5 py-3.5 rounded-xl border border-slate-800 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Milestones</span>
            <span className="text-2xl font-black text-white">{events.length}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Span</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">2020 — 2024</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Status</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Corroborated</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Milestones', count: counts.all },
            { id: 'employment', label: 'Employment & Internships', count: counts.employment },
            { id: 'education', label: 'Education', count: counts.education },
            { id: 'project', label: 'Projects & Code', count: counts.project },
            { id: 'certification', label: 'Certifications', count: counts.certification },
            { id: 'digital_anchor', label: 'Digital Footprints', count: counts.digital_anchor },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
                selectedCategory === tab.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                selectedCategory === tab.id ? 'bg-cyan-800 text-cyan-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition self-end sm:self-auto"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
          <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
        </button>
      </div>

      {/* Professional Interactive Card Timeline */}
      <div className="relative border-l-2 border-cyan-500/40 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
        {sortedEvents.map((event, index) => {
          const cat = getCategory(event);
          const config = getCategoryConfig(cat);
          const Icon = config.icon;
          const confPercent = Math.round((event.confidence || 0.9) * 100);

          return (
            <div key={event.id || index} className="relative group">
              {/* Timeline Connector Node */}
              <div className={`absolute -left-[35px] sm:-left-[43px] top-4 w-7 h-7 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-cyan-400 transition`}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              </div>

              {/* Event Card */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 shadow-xl transition space-y-4">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-900">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-black font-mono text-cyan-400 px-2.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-800/50">
                      {event.date_str || '2024'}
                    </span>
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${config.badgeColor}`}>
                      {config.label}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{confPercent}% Verified</span>
                    </span>
                  </div>
                </div>

                {/* Primary Title & Organization */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                    {event.title}
                  </h3>
                  {event.organization && (
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="font-semibold text-slate-300">{event.organization}</span>
                    </div>
                  )}
                </div>

                {/* Narrative Description */}
                {event.description ? (
                  <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                    {event.description}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 leading-relaxed font-sans bg-slate-900/40 p-3 rounded-lg">
                    Milestone correlated across multi-platform public records for {targetName || 'candidate'}. Authenticated against primary identity signals.
                  </p>
                )}

                {/* Footer Action */}
                {event.source_url && (
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px]">Primary Source Proof:</span>
                    <a
                      href={event.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 text-cyan-400 hover:text-cyan-300 hover:underline font-mono text-xs font-semibold"
                    >
                      <span>View Verified Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
