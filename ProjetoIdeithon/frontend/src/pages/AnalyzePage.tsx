import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Mic, MicOff, Upload, ArrowLeft, FileAudio,
  AlertTriangle, CheckCircle, XCircle, Info, Loader2, BookOpen
} from 'lucide-react';
import axios from 'axios';
import ScoreRing from '../components/ScoreRing';
import BiomarkerChart from '../components/BiomarkerChart';
import NarrativeReport from '../components/NarrativeReport';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

export default function AnalyzePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [analyzeStep, setAnalyzeStep] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setFileName('recording.webm');
        stream.getTracks().forEach(track => track.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError('');
      setResult(null);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access and try again.');
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
      setError('');
      setResult(null);
    }
  }, []);

  const analyzeVoice = useCallback(async () => {
    if (!audioBlob) return;
    setIsAnalyzing(true);
    setError('');
    setResult(null);

    const steps = [
      'Uploading audio to analysis engine...',
      'Extracting MFCC coefficients (13 dimensions)...',
      'Computing Jitter, Shimmer & HNR via Praat...',
      'Analyzing F0 pitch dynamics and formants...',
      'Measuring speech fluency and pause patterns...',
      'Running cognitive risk scoring algorithm...',
      'Generating clinical narrative with Azure OpenAI GPT-4o...',
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
      formData.append('audio', audioBlob, fileName || 'recording.webm');

      const response = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });

      clearInterval(stepInterval);
      setResult(response.data);
    } catch (err: any) {
      clearInterval(stepInterval);
      const msg = err.response?.data?.error || err.message || 'Analysis failed';
      setError(`Analysis error: ${msg}. Make sure the backend is running on ${API_URL}`);
    } finally {
      setIsAnalyzing(false);
      setAnalyzeStep('');
    }
  }, [audioBlob, fileName]);

  const resetAnalysis = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setFileName('');
    setResult(null);
    setError('');
    setRecordingTime(0);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'elevated': return '#f97316';
      case 'high': return '#ef4444';
      default: return '#6366f1';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle size={20} style={{ color: '#10b981' }} />;
      case 'moderate': return <AlertTriangle size={20} style={{ color: '#f59e0b' }} />;
      case 'elevated': return <AlertTriangle size={20} style={{ color: '#f97316' }} />;
      case 'high': return <XCircle size={20} style={{ color: '#ef4444' }} />;
      default: return <Info size={20} style={{ color: '#6366f1' }} />;
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div style={{ minHeight: '100vh', background: '#050510' }}>

      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div className="gradient-primary" style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={22} color="#fff" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              NeuroVox<span className="gradient-text"> AI</span>
            </span>
          </Link>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#94a3b8', textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </nav>

      <div style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div className="container" style={{ maxWidth: 960 }}>

          {/* ===== HEADER ===== */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.5px' }}>
              Voice <span className="gradient-text">Analysis</span>
            </h1>
            <p style={{ fontSize: 15, color: '#8892b0' }}>
              Record your voice or upload an audio file for cognitive health screening
            </p>
          </div>

          {/* ===== INPUT SECTION ===== */}
          {!result && (
            <div className="fade-in">
              <div className="card glow" style={{ padding: '48px 40px', textAlign: 'center', marginBottom: 24 }}>

                {/* Recording Button */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
                  {isRecording && (
                    <div className="pulse-ring" style={{
                      position: 'absolute', inset: -20, borderRadius: '50%',
                      background: 'rgba(239,68,68,0.2)', pointerEvents: 'none'
                    }} />
                  )}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isAnalyzing}
                    style={{
                      position: 'relative', width: 100, height: 100, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
                      background: isRecording
                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
                      boxShadow: isRecording
                        ? '0 8px 40px rgba(239,68,68,0.5)'
                        : '0 8px 40px rgba(99,102,241,0.4)',
                    }}
                  >
                    {isRecording ? (
                      <MicOff size={40} color="#fff" className="recording-pulse" />
                    ) : (
                      <Mic size={40} color="#fff" />
                    )}
                  </button>
                </div>

                {/* Recording timer */}
                {isRecording && (
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: '#ef4444', fontFamily: 'monospace' }}>
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                )}

                <p style={{ fontSize: 14, color: '#8892b0', marginBottom: 32 }}>
                  {isRecording
                    ? 'Recording... Speak naturally for at least 15 seconds. Click to stop.'
                    : 'Click the microphone to start recording'}
                </p>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 300, margin: '0 auto 24px' }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(99,102,241,0.15)' }} />
                  <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: 2 }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(99,102,241,0.15)' }} />
                </div>

                {/* File Upload */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isRecording || isAnalyzing}
                  className="btn-secondary"
                  style={{ padding: '12px 24px', fontSize: 14 }}
                >
                  <Upload size={16} />
                  Upload Audio File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".wav,.mp3,.ogg,.webm,.m4a,.flac"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <p style={{ fontSize: 11, color: '#334155', marginTop: 12 }}>
                  Supports WAV, MP3, OGG, WebM, M4A, FLAC (max 50MB)
                </p>
              </div>

              {/* Audio Preview + Analyze */}
              {audioBlob && (
                <div className="card fade-in" style={{ padding: 28, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileAudio size={20} color="#818cf8" />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{fileName}</p>
                      <p style={{ fontSize: 12, color: '#64748b' }}>{(audioBlob.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>

                  {audioUrl && (
                    <audio controls src={audioUrl} style={{ width: '100%', marginBottom: 20 }} />
                  )}

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={analyzeVoice}
                      disabled={isAnalyzing}
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: 'center', opacity: isAnalyzing ? 0.6 : 1 }}
                    >
                      {isAnalyzing ? (
                        <><Loader2 size={18} style={{ animation: 'recording-pulse 1s linear infinite' }} /> Analyzing...</>
                      ) : (
                        <><Brain size={18} /> Analyze Voice</>
                      )}
                    </button>
                    <button onClick={resetAnalysis} disabled={isAnalyzing} className="btn-secondary" style={{ padding: '12px 20px' }}>
                      Reset
                    </button>
                  </div>

                  {/* Progress */}
                  {isAnalyzing && analyzeStep && (
                    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
                      <Loader2 size={16} color="#818cf8" style={{ animation: 'recording-pulse 1s linear infinite' }} />
                      <span style={{ fontSize: 13, color: '#a5b4fc' }}>{analyzeStep}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ===== ERROR ===== */}
          {error && (
            <div className="fade-in" style={{ borderRadius: 14, padding: 16, marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <XCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: '#fca5a5', lineHeight: 1.6 }}>{error}</p>
            </div>
          )}

          {/* ===== RESULTS DASHBOARD ===== */}
          {result && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Overall Score */}
              <div className="card glow" style={{ padding: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <ScoreRing
                    score={result.risk_assessment.overall_score}
                    risk={result.risk_assessment.overall_risk}
                    size={180}
                  />
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      {getRiskIcon(result.risk_assessment.overall_risk)}
                      <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: getRiskColor(result.risk_assessment.overall_risk) }}>
                        {result.risk_assessment.overall_risk} risk
                      </span>
                    </div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Cognitive Health Score</h2>
                    <p style={{ fontSize: 14, color: '#8892b0', lineHeight: 1.7 }}>
                      Based on analysis of 50+ voice biomarkers following MIT/Harvard research protocols.
                      Score ranges from 0 (highest concern) to 100 (healthy).
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Scores */}
              <div className="grid-4">
                {Object.entries(result.risk_assessment.categories).map(([key, cat]) => (
                  <div key={key} className="card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <ScoreRing score={cat.score} risk={cat.risk_level} size={48} strokeWidth={4} showLabel={false} />
                      <div>
                        <p style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{cat.score}</p>
                        <p style={{ fontSize: 11, fontWeight: 600, color: getRiskColor(cat.risk_level), textTransform: 'uppercase' }}>{cat.risk_level}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>{cat.label}</p>
                    <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{cat.detail}</p>
                  </div>
                ))}
              </div>

              {/* Risk Factors */}
              {result.risk_assessment.risk_factors.length > 0 && (
                <div className="card" style={{ padding: 28 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertTriangle size={20} color="#f59e0b" />
                    Risk Factors Identified
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {result.risk_assessment.risk_factors.map((factor, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', marginTop: 6, flexShrink: 0 }} />
                        <p style={{ fontSize: 13, color: '#fcd34d', lineHeight: 1.6 }}>{factor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Biomarker Charts */}
              <BiomarkerChart biomarkers={result.biomarkers} />

              {/* Transcript */}
              {result.transcript && (
                <div className="card" style={{ padding: 28 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileAudio size={20} color="#818cf8" />
                    Speech Transcript
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.8, padding: '16px 20px', borderRadius: 12, background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.08)', color: '#cbd5e1', fontStyle: 'italic' }}>
                    "{result.transcript}"
                  </p>
                </div>
              )}

              {/* AI Narrative Report */}
              <NarrativeReport narrative={result.narrative} />

              {/* Research References */}
              {result.research_references && (
                <div className="card" style={{ padding: 28 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <BookOpen size={20} color="#10b981" />
                    Research References
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {result.research_references.map((ref, i) => (
                      <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'block', padding: '12px 16px', borderRadius: 10, background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.08)', textDecoration: 'none', transition: 'all 0.2s' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{ref.title}</p>
                        <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{ref.source}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* New Analysis */}
              <div style={{ textAlign: 'center' }}>
                <button onClick={resetAnalysis} className="btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}>
                  <Mic size={20} />
                  New Analysis
                </button>
              </div>

              {/* Disclaimer */}
              <div style={{ borderRadius: 14, padding: 16, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.12)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 12, color: '#fcd34d', lineHeight: 1.7 }}>
                  <strong>Disclaimer:</strong> This is an AI-powered screening tool for research purposes only.
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
