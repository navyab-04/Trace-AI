'use client';

import React from 'react';
import { 
  Award, CheckCircle2, AlertTriangle, Lightbulb, 
  ShieldCheck, ExternalLink, Activity, UserCheck 
} from 'lucide-react';
import { InvestigationEvaluation } from '../../../lib/api';

interface Props {
  evaluation: InvestigationEvaluation | null;
}

export default function ProfileEvaluationTab({ evaluation }: Props) {
  if (!evaluation) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        No evaluation data available yet. Run investigation analysis first.
      </div>
    );
  }

  const { overall_authenticity_score, overall_completeness_score, face_match, digilocker_status, evaluations } = evaluation;

  return (
    <div className="space-y-8">
      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Overall Authenticity</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{Math.round(overall_authenticity_score * 100)}%</div>
          <p className="text-[11px] text-slate-400">Cross-source trust & verified platform signals</p>
        </div>

        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Profile Completeness</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{Math.round(overall_completeness_score * 100)}%</div>
          <p className="text-[11px] text-slate-400">Metadata fill rate across discovered handles</p>
        </div>

        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>e-KYC Face Vector Match</span>
            <UserCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">{Math.round(face_match.match_confidence * 100)}%</div>
          <p className="text-[11px] text-slate-400">{face_match.status}</p>
        </div>

        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>DigiLocker Status</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-white">
            {digilocker_status.is_verified ? (
              <span className="text-emerald-400">AUTHENTICATED</span>
            ) : (
              <span className="text-amber-400">UNVERIFIED ANCHOR</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            {digilocker_status.verified_credentials_count} Govt Credentials
          </p>
        </div>
      </div>

      {/* Per-Profile Evaluation Breakdown Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Discovered Profile Audit & Evaluation Cards ({evaluations.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evaluations.map((item, idx) => (
            <div key={idx} className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold">
                      {item.platform}
                    </span>
                    {item.is_digilocker_verified && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold">
                        GOVT VERIFIED
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-lg text-white mt-1">{item.display_name}</h4>
                  <span className="text-xs font-mono text-slate-400">@{item.username}</span>
                </div>

                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Authenticity</span>
                  <span className="text-lg font-black text-emerald-400">{Math.round(item.authenticity_score * 100)}%</span>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Metadata Completeness</span>
                    <span className="font-bold text-cyan-400">{Math.round(item.completeness_score * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${item.completeness_score * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Discrepancy Risk</span>
                    <span className={`font-bold ${item.discrepancy_score > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {Math.round(item.discrepancy_score * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.discrepancy_score > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${item.discrepancy_score * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Discrepancies */}
              {item.discrepancies.length > 0 && (
                <div className="space-y-1 pt-2">
                  <h5 className="text-[11px] font-bold text-amber-400 uppercase flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Detected Discrepancies</span>
                  </h5>
                  {item.discrepancies.map((disc, dIdx) => (
                    <p key={dIdx} className="text-xs text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-900/50">
                      {disc}
                    </p>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              {item.recommendations.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-slate-900">
                  <h5 className="text-[11px] font-bold text-cyan-400 uppercase flex items-center space-x-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Investigation Recommendation</span>
                  </h5>
                  {item.recommendations.map((rec, rIdx) => (
                    <p key={rIdx} className="text-xs text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
                      {rec}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
