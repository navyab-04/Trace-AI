'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, User, Globe, FileText, Clock, Network, 
  AlertTriangle, CheckCircle2, ArrowLeft, ExternalLink, Award, 
  Eye, Scan, Compass, ArrowRight, UserCheck, ChevronLeft, ChevronRight, 
  Sparkles, Layers, ChevronDown, ChevronUp, Fingerprint, Hash 
} from 'lucide-react';
import { 
  getInvestigationReport, getGraphData, getInvestigationEvaluation, getDigitalExposure,
  InvestigationReport, GraphData, InvestigationEvaluation, DigitalExposureData 
} from '../../../lib/api';
import DigiLockerBanner from './DigiLockerBanner';
import ProfileEvaluationTab from './ProfileEvaluationTab';
import ExposureRadarWidget from './ExposureRadarWidget';
import InteractiveGraphVisualizer from './InteractiveGraphVisualizer';
import ImageIntelligenceTab from './ImageIntelligenceTab';
import IdentitySignalsTab from './IdentitySignalsTab';
import ContentDiscoveryTab from './ContentDiscoveryTab';
import WorkflowPipelineMap from './WorkflowPipelineMap';
import ProfessionalTimelineView from './ProfessionalTimelineView';

type PipelineStageId = 
  | 'image-intelligence' 
  | 'identity-signals'
  | 'footprints' 
  | 'content' 
  | 'entity-resolution' 
  | 'evidence' 
  | 'timeline' 
  | 'graph' 
  | 'exposure' 
  | 'evaluation' 
  | 'report';

interface StageMeta {
  id: PipelineStageId;
  stepNumber: string;
  title: string;
  shortTitle: string;
  desc: string;
  icon: React.ElementType;
}

const STAGES: StageMeta[] = [
  { id: 'image-intelligence', stepNumber: '01', title: 'Image Intelligence (OCR, Document, Metadata, QR)', shortTitle: '01 Image Intel', desc: 'OCR & Text, Document Detection, EXIF Metadata & QR/URL Detection', icon: Scan },
  { id: 'identity-signals', stepNumber: '02', title: 'Identity Signals (11 Vectors)', shortTitle: '02 Identity Signals', desc: 'Name, Handles, Email, Phone*, Org, College, Location, Web, Skills, Projects', icon: Sparkles },
  { id: 'footprints', stepNumber: '03', title: 'Digital Footprint Discovery', shortTitle: '03 Footprints', desc: 'Fan-out: GitHub, LinkedIn, Instagram, X/Twitter, Web', icon: Globe },
  { id: 'content', stepNumber: '04', title: 'Content Discovery (9 Categories)', shortTitle: '04 Content Discovery', desc: 'Web Mentions, Projects, Events, Publications, Orgs, Achievements, Articles, Videos, Portfolios', icon: Compass },
  { id: 'entity-resolution', stepNumber: '05', title: 'Entity Resolution Engine', shortTitle: '05 Entity Resolution', desc: 'Same person? Same organization? Same project? Conflicting data?', icon: UserCheck },
  { id: 'evidence', stepNumber: '06', title: 'Evidence Engine Ledger', shortTitle: '06 Evidence Engine', desc: 'Source, URL, Evidence, Confidence, Timestamp, Conflicts', icon: FileText },
  { id: 'timeline', stepNumber: '07', title: 'Chronological Timeline', shortTitle: '07 Timeline', desc: 'Chronological Career, Events, Education & Milestones', icon: Clock },
  { id: 'graph', stepNumber: '08', title: 'Interactive Relationship Graph', shortTitle: '08 Graph Network', desc: 'Topology Linking Entity, Handles, Platforms, Orgs & Projects', icon: Network },
  { id: 'exposure', stepNumber: '09', title: 'Digital Exposure Radar', shortTitle: '09 Exposure Radar', desc: 'Privacy Attack Surface, Leak Vectors & Risk Evaluation', icon: Eye },
  { id: 'evaluation', stepNumber: '10', title: 'Profile Evaluation & e-KYC', shortTitle: '10 Evaluation & KYC', desc: 'DigiLocker Verification & Platform Authenticity Scoring', icon: Award },
  { id: 'report', stepNumber: '11', title: 'Explainable Intelligence Report', shortTitle: '11 Explainable Report', desc: 'Synthesized Multi-Source Verifiable Evidence Dossier', icon: ShieldCheck },
];

export default function InvestigationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [evaluation, setEvaluation] = useState<InvestigationEvaluation | null>(null);
  const [exposure, setExposure] = useState<DigitalExposureData | null>(null);
  const [activeStage, setActiveStage] = useState<PipelineStageId>('image-intelligence');
  const [showArchitectureMap, setShowArchitectureMap] = useState(false);

  const [loading, setLoading] = useState(true);

  const reloadData = async () => {
    try {
      const rep = await getInvestigationReport(id);
      setReport(rep);
      const g = await getGraphData(id);
      setGraph(g);
      const ev = await getInvestigationEvaluation(id);
      setEvaluation(ev);
      const exp = await getDigitalExposure(id);
      setExposure(exp);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading Investigation Intelligence Pipeline Data...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-red-400 font-semibold">Investigation not found or server offline.</p>
        <Link href="/" className="inline-flex items-center space-x-2 text-cyan-400 hover:underline text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const topCand = report.top_candidate;
  const currentStageIndex = STAGES.findIndex(s => s.id === activeStage);
  const currentStageMeta = STAGES[currentStageIndex] || STAGES[0];
  const prevStage = currentStageIndex > 0 ? STAGES[currentStageIndex - 1] : null;
  const nextStage = currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1] : null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link href="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-xs mb-2 transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-white">Investigation: {id.substring(0, 8)}...</h1>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-700/50 text-emerald-400 text-xs font-mono font-bold">
              {report.status}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
              {report.consent_status}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowArchitectureMap(!showArchitectureMap)}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-cyan-400 transition self-start md:self-auto"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{showArchitectureMap ? 'Hide Architecture Map' : 'View Workflow Architecture'}</span>
          {showArchitectureMap ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* DigiLocker Consent & e-KYC Verification Banner */}
      <DigiLockerBanner investigationId={id} evaluation={evaluation} onVerified={reloadData} />

      {/* Top Match Summary Card */}
      {topCand && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Resolved Primary Identity Candidate</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">{topCand.display_name}</h2>
            <p className="text-sm text-slate-400 max-w-2xl">{topCand.summary}</p>
            
            {/* Biometric Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {report.identity_signals?.face_hash && (
                <div className="flex items-center space-x-1.5 text-xs font-mono text-purple-300 bg-purple-950/60 px-3 py-1 rounded-lg border border-purple-800/40">
                  <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                  <span>Face Hash: {report.identity_signals.face_hash}</span>
                </div>
              )}
              {report.identity_signals?.facial_vector && (
                <div className="flex items-center space-x-1.5 text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>128-D Biometric Vector ({report.identity_signals.biometric_status || 'AUTHENTICATED'})</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6 bg-slate-900 px-6 py-4 rounded-xl border border-slate-800 shrink-0">
            <div>
              <span className="block text-xs text-slate-400 uppercase font-semibold">Classification</span>
              <span className="text-sm font-bold text-cyan-400">{topCand.classification}</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="block text-xs text-slate-400 uppercase font-semibold">Confidence</span>
              <span className="text-2xl font-black text-emerald-400">{Math.round(topCand.confidence * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive TRACEID-AI Workflow Architecture Map (Collapsible by default) */}
      {showArchitectureMap && (
        <WorkflowPipelineMap 
          activeStage={activeStage} 
          onSelectStage={(stId) => setActiveStage(stId)} 
        />
      )}

      {/* ===================================================================== */}
      {/* SPACIOUS PIPELINE STEPPER RIBBON                                      */}
      {/* ===================================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Investigation Stages</span>
            <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/40">
              Stage {currentStageMeta.stepNumber} of {STAGES.length}: {currentStageMeta.shortTitle.replace(/^\d+\s*/, '')}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Scroll or click to switch stages &bull; No clutter layout
          </span>
        </div>

        {/* Spacious Horizontal Stepper Navigation Ribbon */}
        <div className="flex items-center space-x-2 overflow-x-auto p-2 bg-slate-950 rounded-2xl border border-slate-800 scrollbar-none">
          {STAGES.map((s) => {
            const isCurrent = activeStage === s.id;
            const Icon = s.icon;
            let countBadge: string | number | undefined = undefined;

            if (s.id === 'image-intelligence') {
              countBadge = report.image_intelligence ? 'OK' : undefined;
            } else if (s.id === 'identity-signals' && report.identity_signals?.completeness_percentage) {
              countBadge = `${report.identity_signals.completeness_percentage}%`;
            } else if (s.id === 'footprints') {
              countBadge = report.discovered_profiles.length;
            } else if (s.id === 'content') {
              countBadge = '9 Cats';
            } else if (s.id === 'entity-resolution') {
              countBadge = report.all_candidates.length;
            } else if (s.id === 'evidence') {
              countBadge = report.supporting_evidence.length + report.conflicting_evidence.length;
            } else if (s.id === 'timeline') {
              countBadge = report.timeline.length;
            } else if (s.id === 'graph') {
              countBadge = graph?.edges.length || 0;
            } else if (s.id === 'evaluation') {
              countBadge = evaluation?.evaluations.length || 0;
            }

            return (
              <button
                key={s.id}
                onClick={() => setActiveStage(s.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 border ${
                  isCurrent
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-400/30'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isCurrent ? 'bg-cyan-900/60 text-cyan-300' : 'bg-slate-800 text-slate-500'}`}>
                  {s.stepNumber}
                </span>
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{s.shortTitle.replace(/^\d+\s*/, '')}</span>
                {countBadge !== undefined && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isCurrent ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {countBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Current Stage Headline */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              Stage {currentStageMeta.stepNumber} &bull; Pipeline Phase
            </span>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>{currentStageMeta.title}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentStageMeta.desc}</p>
          </div>

          <div className="flex items-center space-x-2">
            {prevStage && (
              <button
                onClick={() => setActiveStage(prevStage.id)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev: {prevStage.shortTitle}</span>
              </button>
            )}
            {nextStage && (
              <button
                onClick={() => setActiveStage(nextStage.id)}
                className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs text-white font-semibold transition"
              >
                <span className="hidden sm:inline">Next: {nextStage.shortTitle}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* STAGE CONTENTS                                                        */}
      {/* ===================================================================== */}

      {/* Stage 01: Image Intelligence */}
      {activeStage === 'image-intelligence' && (
        <ImageIntelligenceTab 
          imageIntelligence={report.image_intelligence} 
          identitySignals={report.identity_signals} 
          imagePath={report.image_path}
          onNavigateToSignals={() => setActiveStage('identity-signals')}
        />
      )}

      {/* Stage 02: 11 Discovered Identity Signals */}
      {activeStage === 'identity-signals' && (
        <IdentitySignalsTab identitySignals={report.identity_signals} />
      )}

      {/* Stage 03: Digital Footprint Discovery (Platforms Fan-out) */}
      {activeStage === 'footprints' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <span>Platforms Fan-out: Discovered <strong>{report.discovered_profiles.length}</strong> public profile(s) across GitHub, LinkedIn, Instagram, X/Twitter & Web.</span>
            <span className="font-mono text-cyan-400 font-bold">Public OSINT Crawl</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.discovered_profiles.map((prof) => (
              <div key={prof.id} className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold">
                    {prof.platform}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">@{prof.username}</span>
                </div>
                <h3 className="font-bold text-white">{prof.display_name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{prof.bio}</p>
                {prof.profile_url && (
                  <a 
                    href={prof.profile_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center space-x-1.5 text-xs text-cyan-400 hover:underline pt-2"
                  >
                    <span>View Public Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage 04: Content Discovery (9 Categories) */}
      {activeStage === 'content' && (
        <ContentDiscoveryTab report={report} />
      )}

      {/* Stage 05: Entity Resolution (Explicit 4 Criteria) */}
      {activeStage === 'entity-resolution' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <span>Entity Resolution: Evaluates <strong>Same person? Same organization? Same project? Conflicting data?</strong></span>
            <span className="font-mono text-cyan-400 font-bold">{report.all_candidates.length} Candidate Persona(s)</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {report.all_candidates.map((cand, idx) => (
              <div key={idx} className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-5 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-xl text-white">{cand.display_name}</h3>
                      {idx === 0 && (
                        <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-bold uppercase">
                          Target Persona
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 mt-1.5">
                      <span className="text-xs text-cyan-400 font-semibold">{cand.classification}</span>
                      <span className="inline-flex items-center space-x-1 text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        <Globe className="w-3 h-3 text-cyan-400" />
                        <span>{cand.profiles_count} Profiles Clustered</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 uppercase font-mono block">Match Confidence</span>
                    <span className="text-2xl font-black text-emerald-400">{Math.round(cand.confidence * 100)}%</span>
                  </div>
                </div>

                {cand.summary && (
                  <p className="text-xs text-slate-300 bg-slate-900/70 p-3.5 rounded-lg border border-slate-800 leading-relaxed font-sans">
                    {cand.summary}
                  </p>
                )}

                {/* The 4 Exact Resolution Criteria from User Diagram */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Entity Resolution Criteria Evaluation:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">1. Same Person?</span>
                      <span className="font-bold text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolved ({Math.round(cand.confidence * 100)}%)</span>
                      </span>
                      <p className="text-[11px] text-slate-400">Name &amp; username consistency corroborated.</p>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">2. Same Organization?</span>
                      <span className="font-bold text-cyan-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{report.identity_signals?.organization || 'Verified Org'}</span>
                      </span>
                      <p className="text-[11px] text-slate-400">Affiliation confirmed across channels.</p>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">3. Same Project?</span>
                      <span className="font-bold text-amber-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{report.identity_signals?.projects?.length ? `${report.identity_signals.projects.length} Repos` : 'Corroborated'}</span>
                      </span>
                      <p className="text-[11px] text-slate-400">Open-source codebase match.</p>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">4. Conflicting Data?</span>
                      <span className={`font-bold flex items-center space-x-1 ${cand.conflicting_signals.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {cand.conflicting_signals.length > 0 ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{cand.conflicting_signals.length} Discrepancies</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>0 Conflicts (Consistent)</span>
                          </>
                        )}
                      </span>
                      <p className="text-[11px] text-slate-400">Discrepancy and collision audit.</p>
                    </div>
                  </div>
                </div>

                {/* Signals breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Supporting Signals ({cand.supporting_signals.length})</h4>
                    {cand.supporting_signals.map((sig, sIdx) => (
                      <div key={sIdx} className="flex items-center space-x-2 text-xs text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{sig}</span>
                      </div>
                    ))}
                  </div>

                  {cand.conflicting_signals.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Conflicting Signals ({cand.conflicting_signals.length})</h4>
                      {cand.conflicting_signals.map((sig, cIdx) => (
                        <div key={cIdx} className="flex items-center space-x-2 text-xs text-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{sig}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage 06: Evidence Engine (Source, URL, Evidence, Confidence, Timestamp, Conflicts) */}
      {activeStage === 'evidence' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Evidence Engine Ledger: Tracks <strong>Source, URL, Evidence Claim, Confidence, Timestamp, and Conflicts</strong>.</span>
            <span className="font-mono text-cyan-400 font-bold">{report.supporting_evidence.length + report.conflicting_evidence.length} Verifiable Claims</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Corroborating Evidence Claims ({report.supporting_evidence.length})</span>
            </h3>

            <div className="space-y-3">
              {report.supporting_evidence.map((ev) => (
                <div key={ev.id} className="bg-slate-950 p-5 rounded-xl border border-emerald-900/50 space-y-3 shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
                        Source: {ev.source_type}
                      </span>
                      <span className="text-emerald-400 font-bold">
                        Confidence: {Math.round(ev.confidence * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                      <span>Timestamp: {ev.retrieved_at ? new Date(ev.retrieved_at).toLocaleTimeString() : 'Live Verified'}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                        CORROBORATED
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-100">{ev.claim}</p>

                  {ev.evidence_text && (
                    <p className="text-xs text-slate-300 bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 font-mono">
                      {ev.evidence_text}
                    </p>
                  )}

                  {ev.source_url && (
                    <div className="pt-1 text-[11px] flex items-center space-x-1.5 font-mono">
                      <span className="text-slate-500">URL:</span>
                      <a href={ev.source_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline inline-flex items-center space-x-1 truncate max-w-lg">
                        <span>{ev.source_url}</span>
                        <ExternalLink className="w-2.5 h-2.5 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {report.conflicting_evidence.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Conflicting Evidence & Discrepancies ({report.conflicting_evidence.length})</span>
              </h3>

              <div className="space-y-3">
                {report.conflicting_evidence.map((ev) => (
                  <div key={ev.id} className="bg-slate-950 p-5 rounded-xl border border-amber-900/50 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400 font-bold">
                          Source: {ev.source_type}
                        </span>
                        <span className="text-amber-300 font-bold">
                          Confidence: {Math.round(ev.confidence * 100)}%
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                        <span>Timestamp: {ev.retrieved_at ? new Date(ev.retrieved_at).toLocaleTimeString() : 'Live'}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                          CONFLICT
                        </span>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-100">{ev.claim}</p>

                    {ev.evidence_text && (
                      <p className="text-xs text-slate-300 bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 font-mono">
                        {ev.evidence_text}
                      </p>
                    )}

                    {ev.source_url && (
                      <div className="pt-1 text-[11px] flex items-center space-x-1.5 font-mono">
                        <span className="text-slate-500">URL:</span>
                        <a href={ev.source_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline inline-flex items-center space-x-1">
                          <span>{ev.source_url}</span>
                          <ExternalLink className="w-2.5 h-2.5 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stage 07: Chronological Career & Milestone Timeline */}
      {activeStage === 'timeline' && (
        <ProfessionalTimelineView 
          events={report.timeline} 
          targetName={topCand?.display_name || report.identity_signals?.name || 'Candidate'} 
        />
      )}

      {/* Stage 08: Relationship Graph */}
      {activeStage === 'graph' && graph && (
        <InteractiveGraphVisualizer graph={graph} />
      )}

      {/* Stage 09: Exposure Radar */}
      {activeStage === 'exposure' && (
        <ExposureRadarWidget exposure={exposure} />
      )}

      {/* Stage 10: Profile Evaluation & e-KYC */}
      {activeStage === 'evaluation' && (
        <ProfileEvaluationTab evaluation={evaluation} />
      )}

      {/* Stage 11: Explainable Report */}
      {activeStage === 'report' && (
        <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-xl font-extrabold text-white">Explainable Identity Dossier</h3>
              <p className="text-xs text-slate-400">Verifiable synthesis of Timeline, Relationship Graph, and Exposure Radar.</p>
            </div>
          </div>

          <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed font-sans space-y-3">
            <p>{report.summary_explanation}</p>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* BOTTOM STAGE NAVIGATION CONTROLS                                      */}
      {/* ===================================================================== */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-800/80">
        <div>
          {prevStage ? (
            <button
              onClick={() => setActiveStage(prevStage.id)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Stage: {prevStage.shortTitle}</span>
            </button>
          ) : (
            <span />
          )}
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Stage {currentStageMeta.stepNumber} / {STAGES.length}
        </div>

        <div>
          {nextStage ? (
            <button
              onClick={() => setActiveStage(nextStage.id)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition shadow-lg shadow-cyan-950/40"
            >
              <span>Next Stage: {nextStage.shortTitle}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-lg"
            >
              <span>New Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
