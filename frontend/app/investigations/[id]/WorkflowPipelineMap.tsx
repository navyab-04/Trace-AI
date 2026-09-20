'use client';

import React from 'react';
import { 
  Camera, Scan, Sparkles, Globe, Compass, 
  UserCheck, FileText, Clock, Network, Eye, ShieldCheck,
  ChevronDown, ArrowDown
} from 'lucide-react';

interface Props {
  activeStage: string;
  onSelectStage: (stageId: any) => void;
}

export default function WorkflowPipelineMap({ activeStage, onSelectStage }: Props) {
  const isNodeActive = (id: string) => activeStage === id;

  const nodeStyle = (id: string) => `
    cursor-pointer p-2.5 rounded-xl border transition flex items-center justify-between
    ${isNodeActive(id) 
      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/50' 
      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'}
  `;

  return (
    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            TRACEID-AI Active Execution Architecture
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          Click any block to jump directly to that pipeline stage
        </span>
      </div>

      <div className="max-w-3xl mx-auto space-y-3 font-sans">
        {/* Node 1: Consented Image Top Block */}
        <div 
          onClick={() => onSelectStage('image-intelligence')}
          className="max-w-md mx-auto p-3 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-center cursor-pointer hover:bg-cyan-950/70 transition shadow-lg"
        >
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>Consented Profile Image</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">JPG / PNG Authorized Input Image</span>
        </div>

        {/* Fork Split Connectors */}
        <div className="flex justify-center items-center space-x-16 text-slate-600 font-mono text-xs">
          <span>┌──────────────┴──────────────┐</span>
        </div>
        <div className="flex justify-between max-w-lg mx-auto text-slate-600 font-mono text-xs px-8">
          <span>▼</span>
          <span>▼</span>
        </div>

        {/* Dual Branch: Branch A (Image Analysis / Face Signals) & Branch B (OCR / Text Signals) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Branch A: Image Analysis / Face Signals */}
          <div 
            onClick={() => onSelectStage('image-intelligence')}
            className={nodeStyle('image-intelligence')}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block text-white">Image Analysis / Face Signals</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Face Detection &bull; Landmarks &bull; Clarity &bull; dHash
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-400">BRANCH A</span>
          </div>

          {/* Branch B: OCR / Text Signals */}
          <div 
            onClick={() => onSelectStage('image-intelligence')}
            className={nodeStyle('image-intelligence')}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                <Scan className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block text-white">OCR / Text Signals</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  OCR Text &bull; Doc Type &bull; EXIF &bull; QR Detection
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400">BRANCH B</span>
          </div>
        </div>

        {/* Convergence Connector */}
        <div className="flex justify-between max-w-lg mx-auto text-slate-600 font-mono text-xs px-8">
          <span>└──────────────┬──────────────┘</span>
        </div>
        <div className="flex justify-center">
          <ArrowDown className="w-4 h-4 text-cyan-400" />
        </div>

        {/* Node 2: Converged Identity Signals (12 Vectors) */}
        <div 
          onClick={() => onSelectStage('identity-signals')}
          className={nodeStyle('identity-signals')}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-white">Identity Signals Matrix (12 Vectors)</span>
              <span className="text-[10px] text-slate-400 font-mono">
                Face Biometrics &bull; Name &bull; Username &bull; Email &bull; Phone &bull; Org &bull; College &bull; Location &bull; Website &bull; Socials &bull; Skills &bull; Projects
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-cyan-400">CONVERGED</span>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center">
          <ArrowDown className="w-4 h-4 text-slate-600" />
        </div>

        {/* Node 3: Candidate Generation (Public / Approved Sources) */}
        <div 
          onClick={() => onSelectStage('footprints')}
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2.5 cursor-pointer hover:border-cyan-500/40 transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Candidate Generation &bull; Public / Approved Sources</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300">9 Core Sources</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-1 text-center">
            {[
              'GitHub', 'LinkedIn', 'Instagram', 
              'X / Twitter', 'YouTube', 'Web', 
              'Events', 'Projects', 'Publications'
            ].map((p, idx) => (
              <div key={idx} className="p-1.5 rounded-md bg-slate-950 border border-slate-800/80 text-[10px] font-mono font-bold text-slate-300 truncate">
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center">
          <ArrowDown className="w-4 h-4 text-slate-600" />
        </div>

        {/* Node 5: Entity Resolution */}
        <div 
          onClick={() => onSelectStage('entity-resolution')}
          className={nodeStyle('entity-resolution')}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-950/80 text-purple-400 border border-purple-800/40">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">6. Entity Resolution</span>
              <span className="text-[10px] text-slate-400 font-mono">
                Same person? &bull; Same organization? &bull; Same project? &bull; Conflicting data?
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-purple-400">CLUSTERING</span>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center">
          <ArrowDown className="w-4 h-4 text-slate-600" />
        </div>

        {/* Node 6: Evidence Engine */}
        <div 
          onClick={() => onSelectStage('evidence')}
          className={nodeStyle('evidence')}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">7. Evidence Engine</span>
              <span className="text-[10px] text-slate-400 font-mono">
                Source &bull; URL &bull; Evidence Claim &bull; Confidence &bull; Timestamp &bull; Conflicts Audit
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400">LEDGER</span>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center">
          <ArrowDown className="w-4 h-4 text-slate-600" />
        </div>

        {/* Node 7: Triad Synthesis (Timeline, Relationship Graph, Exposure Radar) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div 
            onClick={() => onSelectStage('timeline')}
            className={nodeStyle('timeline')}
          >
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold">8. Timeline</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">CHRONO</span>
          </div>

          <div 
            onClick={() => onSelectStage('graph')}
            className={nodeStyle('graph')}
          >
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold">9. Relationship Graph</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">TOPOLOGY</span>
          </div>

          <div 
            onClick={() => onSelectStage('exposure')}
            className={nodeStyle('exposure')}
          >
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">10. Exposure Radar</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400">RISK</span>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center">
          <ArrowDown className="w-4 h-4 text-slate-600" />
        </div>

        {/* Node 8: Explainable Report */}
        <div 
          onClick={() => onSelectStage('report')}
          className={nodeStyle('report')}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold block text-white">11. Explainable Intelligence Report</span>
              <span className="text-[10px] text-slate-300 font-mono">
                Synthesized Multi-Source Verifiable Evidence Dossier &amp; Confidence Breakdown
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
            FINAL DOSSIER
          </span>
        </div>
      </div>
    </div>
  );
}
