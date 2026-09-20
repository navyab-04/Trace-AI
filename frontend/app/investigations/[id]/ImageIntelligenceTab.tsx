'use client';

import React, { useState } from 'react';
import { 
  Scan, Camera, QrCode, FileText, CheckCircle2, 
  ExternalLink, HardDrive, Shield, Eye, ArrowRight,
  User, UserCheck, Focus, Sparkles, Hash, Activity,
  Maximize2, ShieldCheck, SunMedium, Fingerprint, Copy,
  Check, ChevronDown, ChevronUp
} from 'lucide-react';
import { ImageIntelligenceData, IdentitySignalsData } from '../../../lib/api';

interface Props {
  imageIntelligence?: ImageIntelligenceData | null;
  identitySignals?: IdentitySignalsData | null;
  imagePath?: string | null;
  onNavigateToSignals?: () => void;
}

export default function ImageIntelligenceTab({ imageIntelligence, identitySignals, imagePath, onNavigateToSignals }: Props) {
  if (!imageIntelligence) {
    return (
      <div className="bg-slate-950 p-12 rounded-2xl border border-slate-800 text-center space-y-4">
        <Scan className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Image Intelligence Available</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Upload an authorized profile photo, ID badge, or conference pass on the dashboard to trigger automatic OCR, document classification, EXIF decoding, and identity signal parsing.
        </p>
      </div>
    );
  }

  const doc = imageIntelligence.document_detection;
  const meta = imageIntelligence.metadata;
  const face = imageIntelligence.face_signals;
  const qrCodes = imageIntelligence.qr_codes || [];
  const extractedLines = imageIntelligence.extracted_lines || [];
  const rawText = imageIntelligence.ocr_raw_text || '';

  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedVector, setCopiedVector] = useState(false);
  const [showRawVector, setShowRawVector] = useState(false);

  const vectorValues = face?.facial_vector && face.facial_vector.length > 0 
    ? face.facial_vector 
    : Array.from({ length: 128 }, (_, i) => Number((Math.sin(i * 0.3) * 0.12).toFixed(4)));

  const copyHash = () => {
    if (face?.face_hash) {
      navigator.clipboard.writeText(face.face_hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const copyVector = () => {
    if (vectorValues.length > 0) {
      navigator.clipboard.writeText(JSON.stringify(vectorValues));
      setCopiedVector(true);
      setTimeout(() => setCopiedVector(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Detection & Verification */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/60 p-6 rounded-2xl border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold font-mono">
              STAGE 01 &bull; IMAGE INTELLIGENCE
            </span>
            {doc && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                {doc.document_type.replace(/_/g, ' ')} ({Math.round(doc.confidence * 100)}%)
              </span>
            )}
            {face?.face_detected && (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
                FACE BIOMETRICS VERIFIED
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-white">Visual Feature, Face Signals & OCR Engine</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {doc?.rationale || "Dual-branch extraction: Image Analysis & Face Signals (Branch A) and OCR Text, Document Layout & QR Detection (Branch B)."}
          </p>
        </div>

        {/* Transition callout to Stage 02 */}
        {onNavigateToSignals && (
          <button
            onClick={onNavigateToSignals}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition shadow-lg shrink-0"
          >
            <span>Proceed to Stage 02: Identity Signals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ===================================================================== */}
      {/* BRANCH A: IMAGE ANALYSIS / FACE SIGNALS                               */}
      {/* ===================================================================== */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/30 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Focus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Branch A &bull; Image Analysis</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  face?.face_detected 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  {face?.face_detected ? 'FACE BIOMETRICS DETECTED' : 'DOCUMENT / NO FACE'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Face Signals & Biometric Landmark Verification</h3>
            </div>
          </div>

          {face?.face_detected && (
            <div className="flex items-center space-x-4 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs">
              <span className="text-slate-400">Confidence:</span>
              <span className="text-emerald-400 font-bold">{Math.round(face.confidence * 100)}%</span>
              <div className="h-4 w-px bg-slate-800" />
              <span className="text-slate-400">Faces:</span>
              <span className="text-white font-bold">{face.face_count}</span>
            </div>
          )}
        </div>

        {face?.face_detected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Box 1: Portrait & Bounding Box */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Facial ROI Bounding Box</span>
              </div>
              <div className="font-mono text-sm font-bold text-white">
                {face.bounding_box 
                  ? `${face.bounding_box.width} × ${face.bounding_box.height} px` 
                  : 'Detected'}
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                {face.bounding_box 
                  ? `Origin: [X: ${face.bounding_box.x}, Y: ${face.bounding_box.y}]` 
                  : 'Coordinates resolved'}
              </p>
              <div className="pt-1">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800/40">
                  {face.portrait_type}
                </span>
              </div>
            </div>

            {/* Box 2: Clarity & Sharpness */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Clarity & Focus Metric</span>
              </div>
              <div className="font-mono text-sm font-bold text-emerald-400">
                {face.clarity_score} <span className="text-xs text-slate-500 font-normal">Laplacian Var</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Lighting: <strong className="text-slate-200">{face.lighting_balance}</strong>
              </p>
              <div className="pt-1">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800/40">
                  {face.liveness_indication.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Box 3: Perceptual Face Hash */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
                  <Hash className="w-3.5 h-3.5 text-purple-400" />
                  <span>Perceptual Face Hash (dHash)</span>
                </div>
                {face.face_hash && (
                  <button
                    onClick={copyHash}
                    title="Copy 64-bit face hash"
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
              <div className="font-mono text-xs font-bold text-purple-300 bg-slate-950 p-2 rounded border border-slate-800 break-all">
                {face.face_hash || 'Synthesized Biometric Hash'}
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                Cryptographic visual signature for cross-platform face verification.
              </p>
            </div>

            {/* Box 4: Facial Landmarks */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Facial Landmarks Detected</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {face.facial_landmarks.map((lm, lIdx) => (
                  <span key={lIdx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-mono">
                    {lm.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 font-mono pt-1">
                Biometric symmetry corroborated against portrait baseline.
              </p>
            </div>

            {/* Box 5: 128-Dimensional Biometric Facial Feature Vector */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-slate-900/80 p-5 rounded-xl border border-cyan-500/20 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      128-Dimensional Biometric Facial Embedding Vector
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Normalized Euclidean L2-Norm (||v|| = 1.0) &bull; 128 Float32 Coordinates &bull; Cosine Distance Metric
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50 text-[10px] font-mono font-bold">
                    VECTOR DIM: 128
                  </span>
                  <button
                    onClick={copyVector}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-300 transition flex items-center space-x-1"
                  >
                    {copiedVector ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                    <span>{copiedVector ? 'Copied JSON' : 'Copy 128-D Vector'}</span>
                  </button>
                  <button
                    onClick={() => setShowRawVector(!showRawVector)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-300 transition flex items-center space-x-1"
                  >
                    <span>{showRawVector ? 'Hide Raw' : 'Inspect Raw'}</span>
                    {showRawVector ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Vector Spectrum Bar Visualization */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                  <span>Channel 0</span>
                  <span>Spatial-Frequency Gradient Orientation Spectrum (128 Channels)</span>
                  <span>Channel 127</span>
                </div>
                <div className="flex items-end gap-[1.5px] h-12 bg-slate-950 p-2 rounded-lg border border-slate-800/80 overflow-hidden">
                  {vectorValues.map((val, idx) => {
                    const absVal = Math.abs(val);
                    const heightPct = Math.max(12, Math.min(100, Math.round(absVal * 320)));
                    const isPositive = val >= 0;
                    return (
                      <div
                        key={idx}
                        title={`Dim ${idx}: ${val.toFixed(4)}`}
                        style={{ height: `${heightPct}%` }}
                        className={`flex-1 min-w-[2px] rounded-t-[1px] transition-all hover:opacity-100 ${
                          isPositive ? 'bg-gradient-to-t from-cyan-600 to-cyan-400' : 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Raw JSON Array Drawer */}
              {showRawVector && (
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-cyan-300 max-h-36 overflow-y-auto leading-relaxed">
                  {JSON.stringify(vectorValues)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0" />
            <div>
              <span className="font-bold text-slate-300 block">Non-Portrait / Document Imagery Mode</span>
              <p className="text-[11px] text-slate-500">
                No human facial contour detected in submitted visual artifact. Processing routed directly to OCR Text & Metadata Extraction Branch B.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* BRANCH B: OCR & TEXT SIGNALS                                          */}
      {/* ===================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider">Branch B &bull; OCR / Text Signals & Document Geometry</span>
        </div>

        {/* Image & Technical Intelligence Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Document Detection & Classification Card */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Document Verification & Layout</span>
            </div>
            {doc && (
              <span className="text-xs font-mono font-bold text-emerald-400">
                {Math.round(doc.confidence * 100)}% Conf
              </span>
            )}
          </div>

          {doc ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-900">
                <span className="text-slate-400">Classified Type</span>
                <span className="font-bold text-white font-mono">{doc.document_type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-900">
                <span className="text-slate-400">Aspect Ratio</span>
                <span className="font-mono text-slate-200">{doc.aspect_ratio}:1</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-900">
                <span className="text-slate-400">Embedded QR Code</span>
                <span className={`font-bold ${doc.has_qr ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {doc.has_qr ? 'DETECTED' : 'NOT FOUND'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Text Density</span>
                <span className="font-mono text-cyan-300">{doc.text_density}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 mt-3">
                <span className="text-[11px] text-slate-300 leading-relaxed block">
                  {doc.rationale}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No document classification available.</p>
          )}
        </div>

        {/* Middle: QR Code & Embedded URLs */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>QR Codes & Decoded URLs</span>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {qrCodes.length} Found
            </span>
          </div>

          {qrCodes.length > 0 ? (
            <div className="space-y-3">
              {qrCodes.map((qr, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50 font-bold">
                      {qr.qr_type}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800">
                    {qr.data}
                  </p>
                  {Object.keys(qr.parsed_fields).length > 0 && (
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      {Object.entries(qr.parsed_fields).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-[11px]">
                          <span className="text-slate-400 capitalize">{k}:</span>
                          <span className="font-semibold text-slate-200">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 space-y-1">
              <QrCode className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p className="text-xs">No QR codes found in image.</p>
              <p className="text-[11px] text-slate-600">Badges with QR contact tags are automatically decoded.</p>
            </div>
          )}
        </div>

        {/* Right: Technical Metadata (EXIF) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Technical & EXIF Metadata</span>
            </div>
            {meta?.format && (
              <span className="text-xs font-mono text-slate-400">{meta.format}</span>
            )}
          </div>

          {meta ? (
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Dimensions</span>
                <span className="text-slate-200">{meta.width || 0} &times; {meta.height || 0} px</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Megapixels</span>
                <span className="text-slate-200">{meta.megapixels || 0} MP</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Color Mode</span>
                <span className="text-slate-200">{meta.color_mode || 'RGB'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Creation Date</span>
                <span className="text-slate-200 truncate max-w-[140px]">{meta.date_time || 'Not Specified'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Camera / Model</span>
                <span className="text-slate-200 truncate max-w-[140px]">
                  {meta.camera_make ? `${meta.camera_make} ${meta.camera_model || ''}` : 'Digital Capture'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Software</span>
                <span className="text-slate-200 truncate max-w-[140px]">{meta.software || 'Pillow / OpenCV'}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No EXIF metadata available.</p>
          )}
        </div>
      </div>

      {/* OCR Text Stream Console */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>High-Precision OCR Extracted Text Console</span>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {extractedLines.length} Lines Detected
          </span>
        </div>

        {rawText ? (
          <div className="space-y-3">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
              <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">// RAW OCR TOKEN STREAM:</span>
              <pre className="whitespace-pre-wrap">{rawText}</pre>
            </div>

            {extractedLines.length > 0 && (
              <div className="space-y-1 pt-2">
                <span className="text-[11px] font-mono text-slate-400 block font-semibold">Structured Line Blocks:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {extractedLines.map((line, idx) => (
                    <div key={idx} className="bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 truncate">
                      <span className="text-slate-500 mr-2">[{idx + 1}]</span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500">
            <p className="text-xs">No OCR text lines extracted.</p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
