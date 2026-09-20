'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { verifyDigiLocker, InvestigationEvaluation } from '../../../lib/api';

interface Props {
  investigationId: string;
  evaluation: InvestigationEvaluation | null;
  onVerified: () => void;
}

export default function DigiLockerBanner({ investigationId, evaluation, onVerified }: Props) {
  const [loading, setLoading] = useState(false);
  const digiStatus = evaluation?.digilocker_status;
  const faceMatch = evaluation?.face_match;

  const handleTriggerVerification = async () => {
    setLoading(true);
    try {
      await verifyDigiLocker(investigationId);
      onVerified();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-indigo-950 p-6 rounded-2xl border border-blue-500/30 shadow-2xl space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Official Government Identity Verification</span>
          </div>
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <span>DigiLocker Consent & e-KYC Identity Verification</span>
            {digiStatus?.is_verified && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-[10px] font-mono font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>VERIFIED</span>
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Authenticate target identity using DigiLocker consent API. Verifies e-KYC facial vectors, Aadhaar identity credentials, educational qualifications, and official tax/driving records.
          </p>
        </div>

        <div>
          {digiStatus?.is_verified ? (
            <div className="bg-emerald-950/80 px-4 py-3 rounded-xl border border-emerald-500/40 flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="block text-xs font-mono font-bold text-emerald-300">
                  DigiLocker Anchor: {digiStatus.digilocker_id}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  4 Official Credentials Authenticated (100% Trust)
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleTriggerVerification}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-950 flex items-center space-x-2 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>{loading ? 'Authenticating e-KYC...' : 'Authorize DigiLocker Identity'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Verified Details & e-KYC Face Match Banner */}
      {digiStatus?.is_verified && faceMatch && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-blue-900/40">
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-950 border border-blue-800 text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">e-KYC Face Vector</span>
              <span className="text-xs font-bold text-emerald-400">{faceMatch.details}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Visual Facial Match</span>
              <span className="text-xs font-extrabold text-emerald-300">
                {Math.round(faceMatch.match_confidence * 100)}% Match Confidence
              </span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-950 border border-purple-800 text-purple-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Verified Credentials</span>
              <span className="text-xs font-bold text-slate-200">
                Aadhaar, NAD Degrees, PAN & DL
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
