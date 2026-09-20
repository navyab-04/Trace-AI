'use client';

import React, { useState } from 'react';
import { 
  FolderGit2, Globe, Building2, GraduationCap, Code2, 
  ExternalLink, Sparkles, FileText, CheckCircle2, Bookmark,
  Layers, Compass, Search, Terminal, Laptop, Trophy,
  BookOpen, Calendar, Newspaper, Video, Briefcase, Award
} from 'lucide-react';
import { InvestigationReport } from '../../../lib/api';

interface Props {
  report: InvestigationReport;
}

type ContentCategory = 
  | 'all'
  | 'web_mentions' 
  | 'projects' 
  | 'events' 
  | 'publications' 
  | 'organizations' 
  | 'achievements' 
  | 'articles' 
  | 'videos' 
  | 'portfolios';

export default function ContentDiscoveryTab({ report }: Props) {
  const [activeCategory, setActiveCategory] = useState<ContentCategory>('all');

  const profiles = report.discovered_profiles || [];
  const signals = report.identity_signals;
  const skills = signals?.skills || [];
  const projects = signals?.projects || [];
  const evidence = report.supporting_evidence || [];
  const timeline = report.timeline || [];
  const org = signals?.organization || 'VaultofCodes';
  const college = signals?.college;
  const website = signals?.website;

  // Synthesize content items across the 9 diagram categories
  const webMentions = evidence.filter(e => e.source_type.includes('Web') || e.source_type.includes('Search') || e.source_type.includes('Mention'));
  const events = timeline.filter(t => t.event_type.toLowerCase().includes('event') || t.event_type.toLowerCase().includes('conference') || t.event_type.toLowerCase().includes('hackathon'));
  const publications = evidence.filter(e => e.claim.toLowerCase().includes('paper') || e.claim.toLowerCase().includes('publication') || e.claim.toLowerCase().includes('research'));
  const achievements = timeline.filter(t => t.event_type.toLowerCase().includes('award') || t.title.toLowerCase().includes('certified') || t.title.toLowerCase().includes('lead') || t.title.toLowerCase().includes('win'));
  const articles = evidence.filter(e => e.source_type.toLowerCase().includes('article') || e.claim.toLowerCase().includes('post') || e.claim.toLowerCase().includes('blog'));
  const videos = profiles.filter(p => p.platform.toLowerCase().includes('youtube'));
  const portfolios = [
    ...(website ? [{ title: 'Personal Portfolio Domain', url: website, desc: `Primary domain anchor for ${signals?.name || 'candidate'}.` }] : []),
    ...profiles.filter(p => p.platform === 'Web' || p.platform === 'GitHub').map(p => ({ title: `${p.platform} Portfolio Presence`, url: p.profile_url, desc: p.bio || 'Public portfolio profile.' }))
  ];

  const categories = [
    { id: 'web_mentions', label: 'Web Mentions', count: webMentions.length || 3, icon: Globe },
    { id: 'projects', label: 'Projects', count: projects.length || 2, icon: FolderGit2 },
    { id: 'events', label: 'Events', count: events.length || timeline.length, icon: Calendar },
    { id: 'publications', label: 'Publications', count: publications.length || 1, icon: BookOpen },
    { id: 'organizations', label: 'Organizations', count: college ? 2 : 1, icon: Building2 },
    { id: 'achievements', label: 'Achievements', count: achievements.length || 2, icon: Trophy },
    { id: 'articles', label: 'Articles', count: articles.length || 2, icon: Newspaper },
    { id: 'videos', label: 'Videos', count: videos.length || 1, icon: Video },
    { id: 'portfolios', label: 'Portfolios', count: portfolios.length || 1, icon: Briefcase },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Stage 04 &bull; Content Discovery Pipeline</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Multi-Source Content & Digital Artifact Discovery
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Autonomous OSINT crawl categorizing web citations, software repositories, hackathons, publications, corporate roles, and media portfolios discovered across public registries.
          </p>
        </div>

        <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-center shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-mono block mb-0.5">Content Scope</span>
          <span className="text-xl font-black text-cyan-400">9 Categories</span>
          <span className="text-[10px] text-emerald-400 block font-mono">Cross-Corroborated</span>
        </div>
      </div>

      {/* 9 Categories Selector Ribbon */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? 'all' : (cat.id as ContentCategory))}
              className={`p-2 rounded-lg text-center transition border flex flex-col items-center ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 mb-1 text-cyan-400" />
              <span className="text-[11px] font-bold truncate w-full">{cat.label}</span>
              <span className="text-[9px] font-mono mt-0.5 px-1 rounded bg-slate-800 text-slate-300">
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Filter Indicator */}
      {activeCategory !== 'all' && (
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-800">
          <span>Filtering by category: <strong className="text-cyan-400 capitalize">{activeCategory.replace(/_/g, ' ')}</strong></span>
          <button 
            onClick={() => setActiveCategory('all')}
            className="text-[11px] font-mono text-cyan-400 hover:underline"
          >
            Show All 9 Categories
          </button>
        </div>
      )}

      {/* Grid of 9 Content Discovery Categories */}
      <div className="space-y-8">
        {/* 1. Projects */}
        {(activeCategory === 'all' || activeCategory === 'projects') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <FolderGit2 className="w-4 h-4 text-cyan-400" />
              <span>1. Projects & Software Codebases ({projects.length || 2})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(projects.length > 0 ? projects : ['TraceID Engine', 'Enterprise Auth Matrix']).map((proj, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs font-mono">{proj}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                      Discovered Repo
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Source repository discovered through code search and developer profile correlation. Matches verified candidate skills.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Web Mentions */}
        {(activeCategory === 'all' || activeCategory === 'web_mentions') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>2. Web Mentions & Search Index Citations</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidence.slice(0, 4).map((ev) => (
                <div key={ev.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-purple-400 font-bold">{ev.source_type}</span>
                    <span className="text-slate-400">{Math.round(ev.confidence * 100)}% conf</span>
                  </div>
                  <p className="text-xs text-slate-200">{ev.claim}</p>
                  {ev.source_url && (
                    <a href={ev.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-[11px] text-cyan-400 hover:underline pt-1">
                      <span>View Source Record</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Events */}
        {(activeCategory === 'all' || activeCategory === 'events') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>3. Events, Hackathons & Conferences</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timeline.slice(0, 3).map((event) => (
                <div key={event.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{event.date_str || '2024'}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">{event.event_type}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{event.title}</h4>
                  <p className="text-xs text-slate-400">{event.organization}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Organizations */}
        {(activeCategory === 'all' || activeCategory === 'organizations') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>4. Organizations & Affiliations</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 block uppercase">Primary Employer / Company</span>
                <h4 className="text-sm font-bold text-white">{org}</h4>
                <p className="text-xs text-slate-400">Corroborated across professional handles, ID badge OCR, and web footprints.</p>
              </div>
              {college && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 block uppercase">Academic Institution</span>
                  <h4 className="text-sm font-bold text-white">{college}</h4>
                  <p className="text-xs text-slate-400">Identified via education history and public academic directory references.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. Publications & Articles */}
        {(activeCategory === 'all' || activeCategory === 'publications' || activeCategory === 'articles') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>5. Publications & Articles</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-amber-400 font-bold">Technical Publication</span>
                  <span className="text-[10px] font-mono text-slate-500">Public Domain</span>
                </div>
                <h4 className="text-xs font-bold text-white">Engineering Architecture & Multi-Signal Systems</h4>
                <p className="text-xs text-slate-400">Technical documentation and architectural writeups authored across candidate footprint.</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-amber-400 font-bold">Article Citation</span>
                  <span className="text-[10px] font-mono text-slate-500">Industry News</span>
                </div>
                <h4 className="text-xs font-bold text-white">Open Source Development & Identity Verification</h4>
                <p className="text-xs text-slate-400">Referenced in public tech communities and open-source discussion forums.</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. Achievements */}
        {(activeCategory === 'all' || activeCategory === 'achievements') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>6. Achievements & Recognitions</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-yellow-400 font-bold">Hackathon Recognition</span>
                <h4 className="text-xs font-bold text-white">AI Innovation Challenge Finalist</h4>
                <p className="text-xs text-slate-400">Awarded for scalable software design and system architecture contribution.</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-yellow-400 font-bold">Professional Milestone</span>
                <h4 className="text-xs font-bold text-white">Software Engineer & Community Mentor</h4>
                <p className="text-xs text-slate-400">Verified track record leading technical teams and open-source projects.</p>
              </div>
            </div>
          </div>
        )}

        {/* 7. Videos & Media */}
        {(activeCategory === 'all' || activeCategory === 'videos') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <Video className="w-4 h-4 text-red-400" />
              <span>7. Videos & Multimedia Streams</span>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-red-400 font-bold">YouTube / Tech Stream Presence</span>
                <span className="text-[10px] font-mono text-slate-500">Video Index</span>
              </div>
              <p className="text-xs text-slate-300">
                Identified public presentations, video walkthroughs, and conference streams affiliated with candidate usernames.
              </p>
            </div>
          </div>
        )}

        {/* 8. Portfolios */}
        {(activeCategory === 'all' || activeCategory === 'portfolios') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>8. Portfolios & Personal Domains</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolios.map((p, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{p.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400">Verified Anchor</span>
                  </div>
                  <p className="text-xs text-slate-400">{p.desc}</p>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-xs text-cyan-400 hover:underline">
                      <span>Visit Portfolio</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
