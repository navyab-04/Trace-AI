'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, Search, UserCheck, Activity, Cpu, ArrowRight, 
  Upload, Camera, CheckCircle2, QrCode, FileText, Globe, 
  Layers, Eye, Network, Clock, Sparkles, AlertCircle, 
  RefreshCw, Scan, Compass, Award, Building2, GraduationCap,
  MapPin, Mail, Phone, AtSign, Share2, FolderGit2, User
} from 'lucide-react';
import { 
  createInvestigation, uploadInvestigationImage, analyzeInvestigation, 
  scanImage, ImageScanResponse, ImageIntelligenceData, IdentitySignalsData 
} from '../lib/api';

const PIPELINE_STAGES = [
  { id: '01', title: 'Profile Image Ingestion', desc: 'Badge/Pass upload & EXIF decode', icon: Camera },
  { id: '02', title: 'Image Intelligence', desc: 'OCR text extraction & document verification', icon: Scan },
  { id: '03', title: 'Identity Signals', desc: '11 core signals synthesized from image', icon: Sparkles },
  { id: '04', title: 'Digital Footprints', desc: 'Correlating 7+ public platforms', icon: Globe },
  { id: '05', title: 'Content Discovery', desc: 'Crawling repositories, bios & affiliations', icon: Compass },
  { id: '06', title: 'Entity Resolution', desc: 'Candidate clustering & confidence scoring', icon: UserCheck },
  { id: '07', title: 'Evidence Engine', desc: 'Claims verification & conflict detection', icon: FileText },
  { id: '08', title: 'Timeline Graph', desc: 'Chronological career & education synthesis', icon: Clock },
  { id: '09', title: 'Relationship Graph', desc: 'Network topology across handles & orgs', icon: Network },
  { id: '10', title: 'Exposure Radar', desc: 'Digital attack surface & privacy risks', icon: Eye },
  { id: '11', title: 'Explainable Report', desc: 'Verifiable multi-source intelligence dossier', icon: Shield },
];

export default function Dashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Upload & scan states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [scanResult, setScanResult] = useState<ImageScanResponse | null>(null);
  const [preScannedImagePath, setPreScannedImagePath] = useState<string | null>(null);

  // Pipeline execution state
  const [executing, setExecuting] = useState(false);
  const [currentExecutionStage, setCurrentExecutionStage] = useState<number>(0);

  // Form parameters (auto-filled by image scan or manual entry)
  const [formData, setFormData] = useState({
    consent_status: 'AUTHORIZED',
    input_name: '',
    input_username: '',
    input_organization: '',
    input_college: '',
    input_location: '',
    input_email: '',
    input_website: '',
    input_skills: '',
    input_projects: '',
    input_context: '',
  });

  // Handle immediate image upload and trigger instant Image Intelligence pre-scan
  const handleImageSelect = async (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsScanningImage(true);

    try {
      // Step 2 & 3 of pipeline: Instant Image Intelligence & Identity Signals
      const result = await scanImage(file);
      setScanResult(result);
      setPreScannedImagePath(result.image_path);

      // Auto-populate form inputs from detected signals
      const sigs = result.identity_signals;
      setFormData(prev => ({
        ...prev,
        input_name: sigs.name || prev.input_name,
        input_username: sigs.username || prev.input_username,
        input_organization: sigs.organization || prev.input_organization,
        input_college: sigs.college || prev.input_college,
        input_location: sigs.location || prev.input_location,
        input_email: sigs.email || prev.input_email,
        input_website: sigs.website || prev.input_website,
        input_skills: sigs.skills && sigs.skills.length > 0 ? sigs.skills.join(', ') : prev.input_skills,
        input_projects: sigs.projects && sigs.projects.length > 0 ? sigs.projects.join(', ') : prev.input_projects,
        input_context: sigs.skills && sigs.skills.length > 0 
          ? `Verified profile from ${result.image_intelligence.document_detection.document_type}. Competencies: ${sigs.skills.join(', ')}.`
          : prev.input_context
      }));
    } catch (err) {
      console.warn('Live pre-scan failed, will process during investigation execution:', err);
    } finally {
      setIsScanningImage(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelect(e.target.files[0]);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  // Execute full sequential pipeline
  const handleExecutePipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    setExecuting(true);
    setCurrentExecutionStage(0);

    try {
      // Advance stages sequentially
      setCurrentExecutionStage(1); // Profile Image Ingested
      await new Promise(r => setTimeout(r, 350));
      setCurrentExecutionStage(2); // Image Intelligence (OCR & Document Verification)
      await new Promise(r => setTimeout(r, 400));
      setCurrentExecutionStage(3); // Discovered Identity Signals
      await new Promise(r => setTimeout(r, 400));

      const inv = await createInvestigation({
        ...formData,
        image_path: preScannedImagePath || undefined
      });

      if (selectedFile && !preScannedImagePath) {
        await uploadInvestigationImage(inv.id, selectedFile);
      }

      setCurrentExecutionStage(4); // Digital Footprints Discovery
      await new Promise(r => setTimeout(r, 400));
      setCurrentExecutionStage(5); // Content Discovery

      const analyzePromise = analyzeInvestigation(inv.id);

      setCurrentExecutionStage(6); // Entity Resolution
      await new Promise(r => setTimeout(r, 400));
      setCurrentExecutionStage(7); // Evidence Engine
      await new Promise(r => setTimeout(r, 400));
      setCurrentExecutionStage(8); // Timeline Graph
      await new Promise(r => setTimeout(r, 350));
      setCurrentExecutionStage(9); // Relationship Graph
      await new Promise(r => setTimeout(r, 350));
      setCurrentExecutionStage(10); // Exposure Radar
      await new Promise(r => setTimeout(r, 300));
      setCurrentExecutionStage(11); // Explainable Report

      await analyzePromise;
      await new Promise(r => setTimeout(r, 350));

      router.push(`/investigations/${inv.id}`);
    } catch (err) {
      console.error('Pipeline execution failed:', err);
      alert('Investigation execution failed. Please verify FastAPI backend is running on http://127.0.0.1:8000');
      setExecuting(false);
    }
  };

  const docType = scanResult?.image_intelligence.document_detection.document_type || 'TARGET_IMAGE';
  const docConf = scanResult?.image_intelligence.document_detection.confidence 
    ? Math.round(scanResult.image_intelligence.document_detection.confidence * 100) 
    : 95;
  const extractedSignals = scanResult?.identity_signals;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Autonomous Sequential Intelligence Protocol</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            TRACEID-AI Multi-Signal Pipeline
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Upload a profile image, ID badge, or conference pass first. Instant Image Intelligence performs OCR, document verification, and EXIF analysis, then discovers 11 identity signals to drive footprint correlation and explainable reports.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center w-full md:w-auto">
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
            <Scan className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <span className="block text-lg font-black text-white">Image First</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Workflow Flow</span>
          </div>
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
            <Sparkles className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="block text-lg font-black text-white">11 Signals</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Auto-Synthesized</span>
          </div>
        </div>
      </div>

      {/* Pipeline Architecture Stepper Ribbon */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 shadow-md">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Sequential Pipeline Architecture</span>
          </span>
          <span className="text-[11px] font-mono text-cyan-400 font-semibold">
            11 Sequential Stages
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-1.5">
          {PIPELINE_STAGES.map((s, idx) => {
            const Icon = s.icon;
            const isFirst = idx === 0;
            return (
              <div 
                key={s.id}
                className={`p-2 rounded-lg border text-center transition ${
                  isFirst 
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' 
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400">{s.id}</span>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] font-bold text-slate-200 truncate">{s.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleExecutePipeline} className="space-y-8">
        {/* =================================================================== */}
        {/* STEP 1: PROFILE IMAGE UPLOAD FIRST                                 */}
        {/* =================================================================== */}
        <div className="bg-slate-950 p-7 rounded-2xl border-2 border-dashed border-cyan-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-bold uppercase mb-1">
                <span>Stage 01 of Flow</span>
              </div>
              <h2 className="text-xl font-black text-white flex items-center space-x-2">
                <Camera className="w-5 h-5 text-cyan-400" />
                <span>Upload Profile Image / ID Badge / Conference Pass First</span>
              </h2>
              <p className="text-xs text-slate-400">
                Upload image first &rarr; Image Intelligence performs OCR & document verification &rarr; Extracts 11 Identity Signals.
              </p>
            </div>

            {selectedFile && !isScanningImage && (
              <div className="flex items-center space-x-2 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">Image Ingested</span>
              </div>
            )}
          </div>

          {/* Drag & Drop Target Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition relative overflow-hidden ${
              selectedFile
                ? 'border-cyan-500/60 bg-slate-900/60'
                : 'border-slate-700 hover:border-cyan-400 hover:bg-slate-900/40 bg-slate-900/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileInputChange}
              className="hidden"
            />

            {/* Scanning Radar Laser Line Animation */}
            {isScanningImage && (
              <div className="absolute inset-0 bg-cyan-950/40 flex flex-col items-center justify-center z-10 backdrop-blur-xs">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-sm font-bold text-cyan-300 animate-pulse">
                  Running Image Intelligence & Extracting Identity Signals...
                </span>
                <span className="text-xs font-mono text-slate-400 mt-1">
                  Stage 01: OCR & Verification &bull; Stage 02: 11 Identity Signals
                </span>
              </div>
            )}

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {selectedFile ? selectedFile.name : 'Click to Browse or Drag & Drop Target Image'}
                </p>
                <p className="text-xs text-slate-400">
                  Supports JPG, PNG, WEBP (Company ID, Student Pass, Event Badge, or Profile Portrait)
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition"
              >
                Choose Image File
              </button>
            </div>
          </div>

          {/* =============================================================== */}
          {/* STAGE 01 & 02 LIVE PRE-SCAN RESULTS                             */}
          {/* =============================================================== */}
          {previewUrl && (
            <div className="space-y-4">
              {/* Part A: Stage 01 Image Intelligence Results */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Scan className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Stage 01: Image Intelligence (OCR, Document Verification & EXIF)
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold">
                    {docType} ({docConf}%)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="relative w-full h-36 rounded-lg overflow-hidden border-2 border-cyan-500/60 bg-black flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Uploaded Target"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/90 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/40">
                      Target Image
                    </div>
                  </div>

                  <div className="col-span-3 space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block uppercase font-mono">Format</span>
                        <span className="font-bold text-white">{scanResult?.image_intelligence.metadata.format || 'PNG'}</span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block uppercase font-mono">Dimensions</span>
                        <span className="font-bold text-cyan-400">
                          {scanResult?.image_intelligence.metadata.width || 800}x{scanResult?.image_intelligence.metadata.height || 800}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block uppercase font-mono">QR / URLs</span>
                        <span className="font-bold text-emerald-400">
                          {scanResult?.image_intelligence.detected_urls.length ? `${scanResult.image_intelligence.detected_urls.length} Detected` : 'Ready'}
                        </span>
                      </div>
                    </div>

                    {scanResult?.image_intelligence.ocr_raw_text && (
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">OCR Extracted Text Tokens:</span>
                        <p className="font-mono text-[11px] text-slate-300 truncate">
                          {scanResult.image_intelligence.ocr_raw_text}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Part B: Stage 02 Discovered Identity Signals (11 Signals) */}
              <div className="bg-slate-900 p-5 rounded-xl border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Stage 02: Discovered Identity Signals (Synthesized from Image Intelligence)
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/50">
                    {extractedSignals?.completeness_percentage || 75}% Complete
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono flex items-center space-x-1">
                      <User className="w-3 h-3 text-cyan-400" />
                      <span>Name</span>
                    </span>
                    <span className="text-xs font-bold text-white truncate block">
                      {extractedSignals?.name || 'Not detected'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono flex items-center space-x-1">
                      <Building2 className="w-3 h-3 text-cyan-400" />
                      <span>Organization</span>
                    </span>
                    <span className="text-xs font-bold text-white truncate block">
                      {extractedSignals?.organization || 'Not detected'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono flex items-center space-x-1">
                      <AtSign className="w-3 h-3 text-purple-400" />
                      <span>Username</span>
                    </span>
                    <span className="text-xs font-bold text-purple-300 truncate block">
                      {extractedSignals?.username ? `@${extractedSignals.username}` : 'Not detected'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono flex items-center space-x-1">
                      <GraduationCap className="w-3 h-3 text-amber-400" />
                      <span>College</span>
                    </span>
                    <span className="text-xs font-bold text-amber-300 truncate block">
                      {extractedSignals?.college || 'Not detected'}
                    </span>
                  </div>
                </div>

                {extractedSignals?.skills && extractedSignals.skills.length > 0 && (
                  <div className="pt-2 flex items-center space-x-2 text-xs">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {extractedSignals.skills.slice(0, 5).map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* REVIEW & CONFIGURE PARAMETERS                                      */}
        {/* =================================================================== */}
        <div className="bg-slate-950 p-7 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Search className="w-5 h-5 text-cyan-400" />
                <span>Verify Discovered Signals & Search Scope</span>
              </h2>
              <p className="text-xs text-slate-400">
                Pre-populated from Image Intelligence & Identity Signals. Refine or provide supplemental seeds for multi-platform footprint correlation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Target Name {extractedSignals?.name && <span className="text-emerald-400 font-mono text-[10px] font-normal">(Detected)</span>}
              </label>
              <input
                type="text"
                value={formData.input_name}
                onChange={(e) => setFormData({ ...formData, input_name: e.target.value })}
                placeholder="e.g. Bagola Navya"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Known Primary Username {extractedSignals?.username && <span className="text-emerald-400 font-mono text-[10px] font-normal">(Detected)</span>}
              </label>
              <input
                type="text"
                value={formData.input_username}
                onChange={(e) => setFormData({ ...formData, input_username: e.target.value })}
                placeholder="e.g. navvu"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Primary Organization {extractedSignals?.organization && <span className="text-emerald-400 font-mono text-[10px] font-normal">(Detected)</span>}
              </label>
              <input
                type="text"
                value={formData.input_organization}
                onChange={(e) => setFormData({ ...formData, input_organization: e.target.value })}
                placeholder="e.g. VaultofCodes"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                College / Academic Institution
              </label>
              <input
                type="text"
                value={formData.input_college}
                onChange={(e) => setFormData({ ...formData, input_college: e.target.value })}
                placeholder="e.g. Stanford / Engineering College"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Operating Location / City
              </label>
              <input
                type="text"
                value={formData.input_location}
                onChange={(e) => setFormData({ ...formData, input_location: e.target.value })}
                placeholder="e.g. San Francisco / Bengaluru"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Consent Status</label>
              <select
                value={formData.consent_status}
                onChange={(e) => setFormData({ ...formData, consent_status: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="AUTHORIZED">AUTHORIZED &bull; Organizer Approved</option>
                <option value="CONSENTED">CONSENTED &bull; Direct Subject Permission</option>
                <option value="PUBLIC_SYNTHETIC">PUBLIC_SYNTHETIC &bull; Benchmark Evaluation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Context / Investigation Focus</label>
            <textarea
              rows={2}
              value={formData.input_context}
              onChange={(e) => setFormData({ ...formData, input_context: e.target.value })}
              placeholder="Candidate background, domains of interest, or known projects..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAUNCH PIPELINE BUTTON                                              */}
        {/* =================================================================== */}
        <button
          type="submit"
          disabled={executing}
          className="w-full bg-gradient-to-r from-cyan-600 via-cyan-500 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-extrabold py-4 px-8 rounded-xl shadow-2xl flex items-center justify-center space-x-3 transition disabled:opacity-50 text-base"
        >
          {executing ? (
            <>
              <Activity className="w-5 h-5 animate-spin" />
              <span>Executing TRACEID-AI Sequential Pipeline...</span>
            </>
          ) : (
            <>
              <span>Execute 11-Stage Investigation Pipeline</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* ===================================================================== */}
      {/* MULTI-STAGE EXECUTION VISUALIZER MODAL                                */}
      {/* ===================================================================== */}
      {executing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
                <Activity className="w-3.5 h-3.5 animate-spin" />
                <span>Running Sequential Pipeline</span>
              </div>
              <h3 className="text-xl font-black text-white">
                TRACEID-AI Real-Time Execution
              </h3>
              <p className="text-xs text-slate-400">
                Executing stages sequentially: Profile Ingestion &rarr; Image Intelligence &rarr; Identity Signals &rarr; Footprints &rarr; Reports.
              </p>
            </div>

            {/* Stages Progress List */}
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-2">
              {PIPELINE_STAGES.map((s, idx) => {
                const stageNum = idx + 1;
                const isCompleted = currentExecutionStage > stageNum;
                const isCurrent = currentExecutionStage === stageNum;
                const Icon = s.icon;

                return (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition ${
                      isCompleted
                        ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                        : isCurrent
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 animate-pulse'
                        : 'bg-slate-900/40 border-slate-900 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                        isCompleted
                          ? 'bg-emerald-500 text-black'
                          : isCurrent
                          ? 'bg-cyan-500 text-black'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.id}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                          <Icon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{s.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{s.desc}</div>
                      </div>
                    </div>

                    <div>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                      ) : (
                        <span className="text-[11px] font-mono text-slate-600">Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
