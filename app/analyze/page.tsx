"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Brain,
  Mic,
  MicOff,
  Upload,
  FileAudio,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Loader2,
  BookOpen,
} from "lucide-react";
import Navbar from "@/components/navbar";
import ScoreRing from "@/components/score-ring";
import BiomarkerChart from "@/components/biomarker-chart";
import NarrativeReport from "@/components/narrative-report";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface RiskCategory {
  score: number;
  risk_level: string;
  detail: string;
  label: string;
}

interface AnalysisResult {
  success: boolean;
  risk_assessment: {
    overall_score: number;
    overall_risk: string;
    categories: {
      voice_quality: RiskCategory;
      speech_fluency: RiskCategory;
      prosody: RiskCategory;
      articulation: RiskCategory;
    };
    risk_factors: string[];
    biomarkers_summary: Record<string, number>;
  };
  narrative: string;
  transcript: string;
  biomarkers: {
    voice_quality: Record<string, number>;
    pitch: Record<string, number>;
    fluency: Record<string, number>;
    formants: Record<string, number>;
    spectral: Record<string, number>;
    energy: Record<string, number>;
  };
  research_references: Array<{ title: string; source: string; url: string }>;
}

function getRiskColor(risk: string) {
  switch (risk) {
    case "low": return "text-chart-3";
    case "moderate": return "text-chart-4";
    case "elevated": return "text-orange-500";
    case "high": return "text-destructive";
    default: return "text-primary";
  }
}

function getRiskIcon(risk: string) {
  switch (risk) {
    case "low": return <CheckCircle size={20} className="text-chart-3" />;
    case "moderate": return <AlertTriangle size={20} className="text-chart-4" />;
    case "elevated": return <AlertTriangle size={20} className="text-orange-500" />;
    case "high": return <XCircle size={20} className="text-destructive" />;
    default: return <Info size={20} className="text-primary" />;
  }
}

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function AnalyzePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [analyzeStep, setAnalyzeStep] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setFileName("recording.webm");
        stream.getTracks().forEach((track) => track.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError("");
      setResult(null);
    } catch {
      setError("Microphone access denied. Please allow microphone access and try again.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isRecording]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      setFileName(file.name);
      setError("");
      setResult(null);
    }
  }, []);

  const analyzeVoice = useCallback(async () => {
    if (!audioBlob) return;
    setIsAnalyzing(true);
    setError("");
    setResult(null);

    const steps = [
      "Uploading audio to analysis engine...",
      "Extracting MFCC coefficients (13 dimensions)...",
      "Computing Jitter, Shimmer & HNR via Praat...",
      "Analyzing F0 pitch dynamics and formants...",
      "Measuring speech fluency and pause patterns...",
      "Running cognitive risk scoring algorithm...",
      "Generating clinical narrative with Azure OpenAI GPT-4o...",
    ];

    let stepIndex = 0;
    setAnalyzeStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setAnalyzeStep(steps[stepIndex]);
      }
    }, 3000);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, fileName || "recording.webm");

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      clearInterval(stepInterval);
      setResult(data);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(`Analysis error: ${msg}. Make sure the backend is running on ${API_URL}`);
    } finally {
      setIsAnalyzing(false);
      setAnalyzeStep("");
    }
  }, [audioBlob, fileName]);

  const resetAnalysis = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setFileName("");
    setResult(null);
    setError("");
    setRecordingTime(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBackLink showNavLinks={false} />

      <div className="pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-6">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
              Voice{" "}
              <span className="bg-gradient-to-r from-primary via-chart-5 to-accent bg-clip-text text-transparent">
                Analysis
              </span>
            </h1>
            <p className="text-[15px] text-muted-foreground">
              Record your voice or upload an audio file for cognitive health screening
            </p>
          </div>

          {/* Input Section */}
          {!result && (
            <div className="animate-fade-in-up">
              <div className="rounded-2xl bg-card/60 backdrop-blur-md border border-border p-12 text-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.08)]">

                {/* Recording Button */}
                <div className="relative inline-block mb-6">
                  {isRecording && (
                    <div className="absolute -inset-5 rounded-full bg-destructive/20 animate-pulse-ring pointer-events-none" />
                  )}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isAnalyzing}
                    className={`relative flex items-center justify-center w-24 h-24 rounded-full border-none cursor-pointer transition-all ${
                      isRecording
                        ? "bg-gradient-to-br from-destructive to-red-700 shadow-[0_8px_40px_rgba(239,68,68,0.5)]"
                        : "bg-gradient-to-br from-primary via-chart-5 to-accent shadow-[0_8px_40px_rgba(99,102,241,0.4)] hover:shadow-[0_12px_50px_rgba(99,102,241,0.5)] hover:-translate-y-0.5"
                    }`}
                  >
                    {isRecording ? (
                      <MicOff size={36} className="text-primary-foreground animate-recording-pulse" />
                    ) : (
                      <Mic size={36} className="text-primary-foreground" />
                    )}
                  </button>
                </div>

                {/* Recording timer */}
                {isRecording && (
                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-destructive font-mono">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                )}

                <p className="text-sm text-muted-foreground mb-8">
                  {isRecording
                    ? "Recording... Speak naturally for at least 15 seconds. Click to stop."
                    : "Click the microphone to start recording"}
                </p>

                {/* Divider */}
                <div className="flex items-center gap-4 max-w-xs mx-auto mb-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] text-muted-foreground font-semibold tracking-[2px]">OR</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* File Upload */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isRecording || isAnalyzing}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary/60 backdrop-blur-md text-secondary-foreground font-medium text-sm border border-border hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer"
                >
                  <Upload size={16} />
                  Upload Audio File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".wav,.mp3,.ogg,.webm,.m4a,.flac"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-[11px] text-muted-foreground/50 mt-3">
                  Supports WAV, MP3, OGG, WebM, M4A, FLAC (max 50MB)
                </p>
              </div>

              {/* Audio Preview + Analyze */}
              {audioBlob && (
                <div className="rounded-2xl bg-card/60 backdrop-blur-md border border-border p-7 mb-6 animate-fade-in-up">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                      <FileAudio size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{fileName}</p>
                      <p className="text-xs text-muted-foreground">{(audioBlob.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>

                  {audioUrl && (
                    <audio controls src={audioUrl} className="w-full mb-5" />
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={analyzeVoice}
                      disabled={isAnalyzing}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary via-chart-5 to-accent text-primary-foreground font-semibold text-sm border-none cursor-pointer transition-all shadow-[0_8px_32px_rgba(99,102,241,0.35)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 ${
                        isAnalyzing ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain size={18} /> Analyze Voice
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetAnalysis}
                      disabled={isAnalyzing}
                      className="px-5 py-3 rounded-xl bg-secondary/60 backdrop-blur-md text-secondary-foreground font-medium text-sm border border-border hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Progress */}
                  {isAnalyzing && analyzeStep && (
                    <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/[0.06] border border-primary/12">
                      <Loader2 size={16} className="text-primary animate-spin" />
                      <span className="text-[13px] text-primary">{analyzeStep}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-2xl p-4 mb-6 flex items-start gap-3 bg-destructive/[0.06] border border-destructive/15 animate-fade-in">
              <XCircle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-red-300 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Results Dashboard */}
          {result && (
            <div className="flex flex-col gap-6 animate-fade-in-up">

              {/* Overall Score */}
              <div className="rounded-2xl bg-card/60 backdrop-blur-md border border-border p-10 shadow-[0_0_40px_rgba(99,102,241,0.08)]">
                <div className="flex items-center gap-10 flex-wrap justify-center">
                  <ScoreRing
                    score={result.risk_assessment.overall_score}
                    risk={result.risk_assessment.overall_risk}
                    size={180}
                  />
                  <div className="flex-1 min-w-[280px]">
                    <div className="flex items-center gap-2 mb-2">
                      {getRiskIcon(result.risk_assessment.overall_risk)}
                      <span className={`text-[13px] font-bold uppercase tracking-[2px] ${getRiskColor(result.risk_assessment.overall_risk)}`}>
                        {result.risk_assessment.overall_risk} risk
                      </span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-foreground mb-2">Cognitive Health Score</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Based on analysis of 50+ voice biomarkers following MIT/Harvard research protocols.
                      Score ranges from 0 (highest concern) to 100 (healthy).
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(result.risk_assessment.categories).map(([key, cat]) => (
                  <div key={key} className="rounded-2xl bg-card/60 backdrop-blur-md border border-border p-6 hover:border-primary/25 hover:-translate-y-1 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <ScoreRing score={cat.score} risk={cat.risk_level} size={48} strokeWidth={4} showLabel={false} />
                      <div>
                        <p className="text-2xl font-extrabold text-foreground leading-none">{cat.score}</p>
                        <p className={`text-[11px] font-semibold uppercase ${getRiskColor(cat.risk_level)}`}>{cat.risk_level}</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-secondary-foreground mb-1">{cat.label}</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">{cat.detail}</p>
                  </div>
                ))}
              </div>

              {/* Risk Factors */}
              {result.risk_assessment.risk_factors.length > 0 && (
                <div className="rounded-2xl bg-card/60 backdrop-blur-md border border-border p-7">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2.5">
                    <AlertTriangle size={20} className="text-chart-4" />
                    Risk Factors Identified
                  </h3>
                  <div className="flex flex-col gap-2">
                    {result.risk_assessment.risk_factors.map((factor, i) => (
                      <div key={i} className="flex items-start gap-3 px-3.5 py-2.5 rounded-xl bg-chart-4/[0.05] border border-chart-4/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-chart-4 mt-2 flex-shrink-0" />
                        <p className="text-[13px] text-amber-200 leading-relaxed">{factor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Biomarker Charts */}
              <BiomarkerChart biomarkers={result.biomarkers} />

              {/* Transcript */}
              {result.transcript && (
                <div className="rounded-2xl bg-card/60 backdrop-blur-md border border-border p-7">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2.5">
                    <FileAudio size={20} className="text-primary" />
                    Speech Transcript
                  </h3>
                  <p className="text-sm leading-relaxed px-5 py-4 rounded-2xl bg-primary/[0.04] border border-border text-secondary-foreground italic">
                    {'"'}{result.transcript}{'"'}
                  </p>
                </div>
              )}

              {/* AI Narrative Report */}
              <NarrativeReport narrative={result.narrative} />

              {/* Research References */}
              {result.research_references && (
                <div className="rounded-2xl bg-card/60 backdrop-blur-md border border-border p-7">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2.5">
                    <BookOpen size={20} className="text-chart-3" />
                    Research References
                  </h3>
                  <div className="flex flex-col gap-2">
                    {result.research_references.map((ref, i) => (
                      <a
                        key={i}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-3 rounded-xl bg-chart-3/[0.04] border border-chart-3/[0.08] no-underline hover:border-chart-3/20 transition-all"
                      >
                        <p className="text-[13px] font-semibold text-secondary-foreground">{ref.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{ref.source}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* New Analysis */}
              <div className="text-center">
                <button
                  onClick={resetAnalysis}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary via-chart-5 to-accent text-primary-foreground font-semibold text-base border-none cursor-pointer shadow-[0_8px_32px_rgba(99,102,241,0.35)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 transition-all"
                >
                  <Mic size={20} />
                  New Analysis
                </button>
              </div>

              {/* Disclaimer */}
              <div className="rounded-2xl p-4 bg-chart-4/[0.05] border border-chart-4/12 flex items-start gap-3">
                <AlertTriangle size={18} className="text-chart-4 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200 leading-relaxed">
                  <strong className="text-foreground">Disclaimer:</strong> This is an AI-powered screening tool for research purposes only.
                  It does not provide medical diagnosis. Please consult a qualified healthcare professional
                  for any health concerns.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
