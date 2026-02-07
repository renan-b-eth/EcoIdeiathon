"""
Voice Biomarker Analyzer for Cognitive Decline Detection
Based on research from:
- MIT CSAIL: Machine learning for voice disorders
- Harvard/Frontiers: Longitudinal Speech Biomarkers (OVBM)
- Alzheimer's Research & Therapy: Deep learning speech analysis
- eGeMAPS: Extended Geneva Minimalistic Acoustic Parameter Set

Key biomarkers extracted:
- MFCC (Mel-Frequency Cepstral Coefficients)
- Jitter (F0 variation)
- Shimmer (amplitude variation)
- Speech rate & pause patterns
- F0 (fundamental frequency)
- Formants (F1, F2, F3)
- Spectral features (spectral centroid, bandwidth, rolloff)
- Harmonic-to-Noise Ratio (HNR)
"""

import numpy as np
import librosa
import parselmouth
from parselmouth.praat import call
from scipy import stats
import json
import warnings

warnings.filterwarnings("ignore")


class VoiceBiomarkerExtractor:
    """Extracts acoustic biomarkers from voice recordings following
    eGeMAPS standard and Alzheimer's detection research protocols."""

    def __init__(self, sr=16000):
        self.sr = sr

    def extract_all(self, audio_path: str) -> dict:
        """Extract all biomarkers from an audio file."""
        y, sr = librosa.load(audio_path, sr=self.sr)
        snd = parselmouth.Sound(audio_path)

        biomarkers = {}
        biomarkers.update(self._extract_mfcc(y, sr))
        biomarkers.update(self._extract_pitch(snd))
        biomarkers.update(self._extract_jitter_shimmer(snd))
        biomarkers.update(self._extract_formants(snd))
        biomarkers.update(self._extract_spectral(y, sr))
        biomarkers.update(self._extract_energy(y))
        biomarkers.update(self._extract_speech_rate(snd, y, sr))
        biomarkers.update(self._extract_hnr(snd))

        return biomarkers

    def _extract_mfcc(self, y, sr) -> dict:
        """MFCC - Mel-Frequency Cepstral Coefficients
        Key feature in Alzheimer's detection (eGeMAPS standard).
        Changes in MFCC reflect vocal tract shape changes associated with cognitive decline."""
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        result = {}
        for i in range(13):
            result[f"mfcc_{i+1}_mean"] = float(np.mean(mfccs[i]))
            result[f"mfcc_{i+1}_std"] = float(np.std(mfccs[i]))
        delta_mfcc = librosa.feature.delta(mfccs)
        for i in range(13):
            result[f"delta_mfcc_{i+1}_mean"] = float(np.mean(delta_mfcc[i]))
        return result

    def _extract_pitch(self, snd) -> dict:
        """F0 - Fundamental Frequency
        Alzheimer's patients show reduced F0 variability and monotone speech.
        Reference: Frontiers in Psychology, 2021."""
        pitch = call(snd, "To Pitch", 0.0, 75, 600)
        f0_values = []
        for i in range(call(pitch, "Get number of frames")):
            f0 = call(pitch, "Get value in frame", i + 1, "Hertz")
            if not np.isnan(f0):
                f0_values.append(f0)

        if len(f0_values) == 0:
            f0_values = [0.0]

        return {
            "f0_mean": float(np.mean(f0_values)),
            "f0_std": float(np.std(f0_values)),
            "f0_min": float(np.min(f0_values)),
            "f0_max": float(np.max(f0_values)),
            "f0_range": float(np.max(f0_values) - np.min(f0_values)),
            "f0_cv": float(np.std(f0_values) / np.mean(f0_values)) if np.mean(f0_values) > 0 else 0.0,
        }

    def _extract_jitter_shimmer(self, snd) -> dict:
        """Jitter & Shimmer - Voice quality measures
        Jitter: cycle-to-cycle variation in F0 (pitch perturbation)
        Shimmer: cycle-to-cycle variation in amplitude
        Both increase in Alzheimer's patients.
        Reference: Alzheimer's Research & Therapy, 2022."""
        pitch = call(snd, "To Pitch", 0.0, 75, 600)
        point_process = call(snd, "To PointProcess (periodic, cc)", 75, 600)

        jitter_local = call(point_process, "Get jitter (local)", 0, 0, 0.0001, 0.02, 1.3)
        jitter_rap = call(point_process, "Get jitter (rap)", 0, 0, 0.0001, 0.02, 1.3)
        jitter_ppq5 = call(point_process, "Get jitter (ppq5)", 0, 0, 0.0001, 0.02, 1.3)

        shimmer_local = call([snd, point_process], "Get shimmer (local)", 0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_apq3 = call([snd, point_process], "Get shimmer (apq3)", 0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_apq5 = call([snd, point_process], "Get shimmer (apq5)", 0, 0, 0.0001, 0.02, 1.3, 1.6)

        return {
            "jitter_local": float(jitter_local) if not np.isnan(jitter_local) else 0.0,
            "jitter_rap": float(jitter_rap) if not np.isnan(jitter_rap) else 0.0,
            "jitter_ppq5": float(jitter_ppq5) if not np.isnan(jitter_ppq5) else 0.0,
            "shimmer_local": float(shimmer_local) if not np.isnan(shimmer_local) else 0.0,
            "shimmer_apq3": float(shimmer_apq3) if not np.isnan(shimmer_apq3) else 0.0,
            "shimmer_apq5": float(shimmer_apq5) if not np.isnan(shimmer_apq5) else 0.0,
        }

    def _extract_formants(self, snd) -> dict:
        """Formants F1, F2, F3
        Formant frequencies reflect articulatory precision.
        Alzheimer's patients show less distinct formant patterns.
        Reference: Speech based detection of AD survey, 2024."""
        formant = call(snd, "To Formant (burg)", 0.0, 5, 5500, 0.025, 50)
        n_frames = call(formant, "Get number of frames")

        f1_vals, f2_vals, f3_vals = [], [], []
        for i in range(1, n_frames + 1):
            t = call(formant, "Get time from frame number", i)
            f1 = call(formant, "Get value at time", 1, t, "Hertz", "Linear")
            f2 = call(formant, "Get value at time", 2, t, "Hertz", "Linear")
            f3 = call(formant, "Get value at time", 3, t, "Hertz", "Linear")
            if not np.isnan(f1): f1_vals.append(f1)
            if not np.isnan(f2): f2_vals.append(f2)
            if not np.isnan(f3): f3_vals.append(f3)

        return {
            "f1_mean": float(np.mean(f1_vals)) if f1_vals else 0.0,
            "f1_std": float(np.std(f1_vals)) if f1_vals else 0.0,
            "f2_mean": float(np.mean(f2_vals)) if f2_vals else 0.0,
            "f2_std": float(np.std(f2_vals)) if f2_vals else 0.0,
            "f3_mean": float(np.mean(f3_vals)) if f3_vals else 0.0,
            "f3_std": float(np.std(f3_vals)) if f3_vals else 0.0,
        }

    def _extract_spectral(self, y, sr) -> dict:
        """Spectral features - eGeMAPS standard
        Spectral centroid, bandwidth, rolloff, flux.
        Changes indicate vocal quality degradation.
        Reference: eGeMAPS feature set (Eyben et al.)."""
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)[0]
        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
        spectral_flux = librosa.onset.onset_strength(y=y, sr=sr)
        zcr = librosa.feature.zero_crossing_rate(y)[0]

        return {
            "spectral_centroid_mean": float(np.mean(spectral_centroid)),
            "spectral_centroid_std": float(np.std(spectral_centroid)),
            "spectral_bandwidth_mean": float(np.mean(spectral_bandwidth)),
            "spectral_rolloff_mean": float(np.mean(spectral_rolloff)),
            "spectral_flux_mean": float(np.mean(spectral_flux)),
            "spectral_flux_std": float(np.std(spectral_flux)),
            "zcr_mean": float(np.mean(zcr)),
            "zcr_std": float(np.std(zcr)),
        }

    def _extract_energy(self, y) -> dict:
        """Energy / Loudness features
        RMS energy and its variation.
        Alzheimer's patients show reduced loudness variability."""
        rms = librosa.feature.rms(y=y)[0]
        return {
            "energy_mean": float(np.mean(rms)),
            "energy_std": float(np.std(rms)),
            "energy_max": float(np.max(rms)),
            "energy_min": float(np.min(rms)),
            "energy_range": float(np.max(rms) - np.min(rms)),
        }

    def _extract_speech_rate(self, snd, y, sr) -> dict:
        """Speech rate & pause analysis
        Key Alzheimer's biomarker: increased pause duration, reduced speech rate,
        more hesitations, longer silence-to-speech ratio.
        Reference: Frontiers in Computer Science, 2021 (OVBM)."""
        intensity = call(snd, "To Intensity", 75, 0.0)
        duration = snd.get_total_duration()

        # Detect voiced/unvoiced segments
        frame_length = 2048
        hop_length = 512
        rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]
        threshold = np.mean(rms) * 0.3

        voiced_frames = np.sum(rms > threshold)
        total_frames = len(rms)
        speech_ratio = voiced_frames / total_frames if total_frames > 0 else 0

        # Estimate pauses
        silence_frames = np.sum(rms <= threshold)
        silence_ratio = silence_frames / total_frames if total_frames > 0 else 0

        # Count pause segments (transitions from voiced to unvoiced)
        is_voiced = rms > threshold
        pause_count = 0
        pause_durations = []
        in_pause = False
        pause_start = 0

        for i in range(len(is_voiced)):
            if not is_voiced[i] and not in_pause:
                in_pause = True
                pause_start = i
            elif is_voiced[i] and in_pause:
                in_pause = False
                pause_dur = (i - pause_start) * hop_length / sr
                if pause_dur > 0.15:  # Only count pauses > 150ms
                    pause_count += 1
                    pause_durations.append(pause_dur)

        avg_pause_duration = float(np.mean(pause_durations)) if pause_durations else 0.0
        max_pause_duration = float(np.max(pause_durations)) if pause_durations else 0.0

        return {
            "duration_seconds": float(duration),
            "speech_ratio": float(speech_ratio),
            "silence_ratio": float(silence_ratio),
            "pause_count": int(pause_count),
            "avg_pause_duration": avg_pause_duration,
            "max_pause_duration": max_pause_duration,
            "estimated_speech_rate": float(voiced_frames / duration) if duration > 0 else 0.0,
        }

    def _extract_hnr(self, snd) -> dict:
        """Harmonic-to-Noise Ratio (HNR)
        Measures voice quality/breathiness.
        Lower HNR in Alzheimer's patients indicates breathier voice.
        Reference: MDPI Applied Sciences, 2023."""
        harmonicity = call(snd, "To Harmonicity (cc)", 0.01, 75, 0.1, 1.0)
        hnr_values = []
        for i in range(call(harmonicity, "Get number of frames")):
            val = call(harmonicity, "Get value in frame", i + 1)
            if not np.isnan(val) and val != -200:
                hnr_values.append(val)

        return {
            "hnr_mean": float(np.mean(hnr_values)) if hnr_values else 0.0,
            "hnr_std": float(np.std(hnr_values)) if hnr_values else 0.0,
            "hnr_min": float(np.min(hnr_values)) if hnr_values else 0.0,
            "hnr_max": float(np.max(hnr_values)) if hnr_values else 0.0,
        }


class CognitiveRiskScorer:
    """Scores cognitive decline risk based on voice biomarkers.
    Uses thresholds derived from published research on AD speech patterns.

    This is a screening tool, NOT a diagnostic tool.
    Based on:
    - DementiaBank Pitt Corpus normative data
    - eGeMAPS reference ranges
    - Published AD detection thresholds
    """

    # Reference ranges from healthy elderly speakers (DementiaBank norms)
    HEALTHY_RANGES = {
        "jitter_local": (0.001, 0.015),
        "shimmer_local": (0.01, 0.06),
        "hnr_mean": (10.0, 25.0),
        "f0_cv": (0.05, 0.35),
        "silence_ratio": (0.15, 0.45),
        "avg_pause_duration": (0.2, 0.8),
        "pause_count_per_min": (3, 15),
        "speech_ratio": (0.55, 0.85),
        "energy_range": (0.01, 0.15),
        "spectral_centroid_std": (200, 800),
    }

    def score(self, biomarkers: dict) -> dict:
        """Generate cognitive risk assessment from biomarkers."""
        risk_factors = []
        scores = {}

        # 1. Voice Quality Score (Jitter + Shimmer + HNR)
        voice_quality = self._score_voice_quality(biomarkers)
        scores["voice_quality"] = voice_quality
        if voice_quality["risk_level"] == "elevated":
            risk_factors.append(voice_quality["detail"])

        # 2. Speech Fluency Score (pauses, speech rate, silence ratio)
        fluency = self._score_fluency(biomarkers)
        scores["speech_fluency"] = fluency
        if fluency["risk_level"] == "elevated":
            risk_factors.append(fluency["detail"])

        # 3. Prosody Score (F0 variability, energy dynamics)
        prosody = self._score_prosody(biomarkers)
        scores["prosody"] = prosody
        if prosody["risk_level"] == "elevated":
            risk_factors.append(prosody["detail"])

        # 4. Articulation Score (formants, spectral features)
        articulation = self._score_articulation(biomarkers)
        scores["articulation"] = articulation
        if articulation["risk_level"] == "elevated":
            risk_factors.append(articulation["detail"])

        # Overall risk
        category_scores = [
            voice_quality["score"],
            fluency["score"],
            prosody["score"],
            articulation["score"],
        ]
        overall_score = float(np.mean(category_scores))

        if overall_score >= 75:
            overall_risk = "low"
        elif overall_score >= 50:
            overall_risk = "moderate"
        elif overall_score >= 25:
            overall_risk = "elevated"
        else:
            overall_risk = "high"

        return {
            "overall_score": round(overall_score, 1),
            "overall_risk": overall_risk,
            "categories": scores,
            "risk_factors": risk_factors,
            "biomarkers_summary": {
                "jitter": round(biomarkers.get("jitter_local", 0) * 100, 3),
                "shimmer": round(biomarkers.get("shimmer_local", 0) * 100, 3),
                "hnr": round(biomarkers.get("hnr_mean", 0), 1),
                "f0_mean": round(biomarkers.get("f0_mean", 0), 1),
                "f0_variability": round(biomarkers.get("f0_cv", 0), 3),
                "speech_ratio": round(biomarkers.get("speech_ratio", 0), 3),
                "pause_count": biomarkers.get("pause_count", 0),
                "avg_pause_sec": round(biomarkers.get("avg_pause_duration", 0), 2),
            },
        }

    def _score_voice_quality(self, b: dict) -> dict:
        jitter = b.get("jitter_local", 0)
        shimmer = b.get("shimmer_local", 0)
        hnr = b.get("hnr_mean", 0)

        score = 100
        details = []

        # Jitter > 1.5% is concerning
        if jitter > 0.02:
            score -= 30
            details.append(f"Jitter elevated ({jitter*100:.2f}%)")
        elif jitter > 0.015:
            score -= 15
            details.append(f"Jitter slightly elevated ({jitter*100:.2f}%)")

        # Shimmer > 6% is concerning
        if shimmer > 0.08:
            score -= 30
            details.append(f"Shimmer elevated ({shimmer*100:.2f}%)")
        elif shimmer > 0.06:
            score -= 15
            details.append(f"Shimmer slightly elevated ({shimmer*100:.2f}%)")

        # HNR < 10 dB is concerning
        if hnr < 8:
            score -= 30
            details.append(f"Low HNR ({hnr:.1f} dB) - breathier voice")
        elif hnr < 10:
            score -= 15
            details.append(f"HNR slightly low ({hnr:.1f} dB)")

        score = max(0, score)
        return {
            "score": score,
            "risk_level": "elevated" if score < 60 else "normal",
            "detail": "; ".join(details) if details else "Voice quality within normal range",
            "label": "Voice Quality (Jitter/Shimmer/HNR)",
        }

    def _score_fluency(self, b: dict) -> dict:
        silence_ratio = b.get("silence_ratio", 0)
        avg_pause = b.get("avg_pause_duration", 0)
        pause_count = b.get("pause_count", 0)
        duration = b.get("duration_seconds", 1)
        speech_ratio = b.get("speech_ratio", 0)

        score = 100
        details = []
        pauses_per_min = (pause_count / duration) * 60 if duration > 0 else 0

        if silence_ratio > 0.55:
            score -= 30
            details.append(f"High silence ratio ({silence_ratio:.1%})")
        elif silence_ratio > 0.45:
            score -= 15
            details.append(f"Elevated silence ratio ({silence_ratio:.1%})")

        if avg_pause > 1.2:
            score -= 30
            details.append(f"Long average pauses ({avg_pause:.2f}s)")
        elif avg_pause > 0.8:
            score -= 15
            details.append(f"Slightly long pauses ({avg_pause:.2f}s)")

        if pauses_per_min > 20:
            score -= 20
            details.append(f"Frequent pauses ({pauses_per_min:.0f}/min)")
        elif pauses_per_min > 15:
            score -= 10
            details.append(f"Slightly frequent pauses ({pauses_per_min:.0f}/min)")

        score = max(0, score)
        return {
            "score": score,
            "risk_level": "elevated" if score < 60 else "normal",
            "detail": "; ".join(details) if details else "Speech fluency within normal range",
            "label": "Speech Fluency (Pauses/Rate)",
        }

    def _score_prosody(self, b: dict) -> dict:
        f0_cv = b.get("f0_cv", 0)
        energy_range = b.get("energy_range", 0)
        f0_range = b.get("f0_range", 0)

        score = 100
        details = []

        # Low F0 variability = monotone speech (AD indicator)
        if f0_cv < 0.05:
            score -= 35
            details.append(f"Very low pitch variability ({f0_cv:.3f}) - monotone speech")
        elif f0_cv < 0.1:
            score -= 15
            details.append(f"Reduced pitch variability ({f0_cv:.3f})")

        # Very high F0 variability can also indicate issues
        if f0_cv > 0.5:
            score -= 20
            details.append(f"Irregular pitch variation ({f0_cv:.3f})")

        if energy_range < 0.01:
            score -= 20
            details.append("Very flat energy contour")

        score = max(0, score)
        return {
            "score": score,
            "risk_level": "elevated" if score < 60 else "normal",
            "detail": "; ".join(details) if details else "Prosody within normal range",
            "label": "Prosody (Pitch/Energy Dynamics)",
        }

    def _score_articulation(self, b: dict) -> dict:
        f1_std = b.get("f1_std", 0)
        f2_std = b.get("f2_std", 0)
        spectral_centroid_std = b.get("spectral_centroid_std", 0)

        score = 100
        details = []

        # Low formant variability = imprecise articulation
        if f1_std < 50:
            score -= 25
            details.append("Low F1 variability - reduced articulatory precision")
        if f2_std < 100:
            score -= 25
            details.append("Low F2 variability - reduced vowel space")

        if spectral_centroid_std < 200:
            score -= 20
            details.append("Low spectral variation")

        score = max(0, score)
        return {
            "score": score,
            "risk_level": "elevated" if score < 60 else "normal",
            "detail": "; ".join(details) if details else "Articulation within normal range",
            "label": "Articulation (Formants/Spectral)",
        }
