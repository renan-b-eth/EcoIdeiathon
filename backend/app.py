"""
NeuroVox AI - Voice-Based Cognitive Health Screening
Flask Backend API

Analyzes voice recordings for biomarkers associated with
cognitive decline, based on MIT/Harvard research protocols.
"""

import os
import json
import tempfile
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import AzureOpenAI
from voice_analyzer import VoiceBiomarkerExtractor, CognitiveRiskScorer

load_dotenv()

# Configure ffmpeg path for pydub
FFMPEG_PATH = os.path.join(
    os.environ.get("LOCALAPPDATA", ""),
    "Microsoft", "WinGet", "Packages",
    "Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe",
    "ffmpeg-8.0.1-full_build", "bin"
)
if os.path.exists(FFMPEG_PATH):
    os.environ["PATH"] = FFMPEG_PATH + os.pathsep + os.environ.get("PATH", "")

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = tempfile.mkdtemp()
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024  # 50MB max

extractor = VoiceBiomarkerExtractor(sr=16000)
scorer = CognitiveRiskScorer()

azure_client = AzureOpenAI(
    api_key=os.getenv("OPEN_IA"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
    azure_endpoint=os.getenv("URL_OPEN"),
)
DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o")

ALLOWED_EXTENSIONS = {"wav", "mp3", "ogg", "webm", "m4a", "flac"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_clinical_narrative(biomarkers: dict, risk_assessment: dict, transcript: str = "") -> str:
    """Use Azure OpenAI to generate a clinical-grade narrative analysis,
    as if written by a Harvard/MIT neurology researcher."""

    prompt = f"""You are a world-class neurologist and speech pathologist from Harvard Medical School 
and MIT CSAIL, specializing in early detection of neurodegenerative diseases through voice biomarkers.

You are analyzing a patient's voice recording. Based on the extracted biomarkers and risk assessment below,
write a comprehensive clinical screening report.

## Voice Biomarkers Extracted:
{json.dumps(risk_assessment.get("biomarkers_summary", {}), indent=2)}

## Risk Assessment:
- Overall Score: {risk_assessment["overall_score"]}/100
- Overall Risk Level: {risk_assessment["overall_risk"]}
- Voice Quality Score: {risk_assessment["categories"]["voice_quality"]["score"]}/100
- Speech Fluency Score: {risk_assessment["categories"]["speech_fluency"]["score"]}/100
- Prosody Score: {risk_assessment["categories"]["prosody"]["score"]}/100
- Articulation Score: {risk_assessment["categories"]["articulation"]["score"]}/100

## Risk Factors Identified:
{json.dumps(risk_assessment["risk_factors"], indent=2)}

{f"## Speech Transcript:{chr(10)}{transcript}" if transcript else ""}

## Instructions:
Write a detailed clinical screening report with the following sections:
1. **Executive Summary** - Brief overview of findings (2-3 sentences)
2. **Voice Quality Analysis** - Interpret jitter, shimmer, HNR findings
3. **Speech Fluency Analysis** - Interpret pause patterns, speech rate
4. **Prosodic Analysis** - Interpret pitch variability, energy dynamics
5. **Articulatory Analysis** - Interpret formant patterns
6. **Cognitive Risk Indicators** - Which biomarkers suggest potential concern
7. **Comparison with Research Norms** - How these values compare to published AD detection studies
8. **Recommendations** - Next steps (always emphasize this is a screening tool, not diagnosis)

Use clinical language but make it accessible. Reference specific biomarker values.
Always include a disclaimer that this is an AI-powered screening tool and not a medical diagnosis.
Recommend professional consultation for any concerns.

Write in English. Be thorough but concise."""

    try:
        response = azure_client.chat.completions.create(
            model=DEPLOYMENT,
            messages=[
                {"role": "system", "content": "You are a clinical neurology AI assistant specializing in voice-based cognitive screening. You provide detailed, evidence-based analysis reports."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=2000,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"[AI narrative unavailable: {str(e)}] Manual interpretation: Overall score {risk_assessment['overall_score']}/100, risk level: {risk_assessment['overall_risk']}."


def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio using Azure OpenAI Whisper or fallback."""
    try:
        with open(audio_path, "rb") as audio_file:
            response = azure_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="en",
            )
            return response.text
    except Exception:
        return ""


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "NeuroVox AI Backend"})


@app.route("/api/analyze", methods=["POST"])
def analyze_voice():
    """Main endpoint: receives audio file, extracts biomarkers,
    scores cognitive risk, generates clinical narrative."""

    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    file = request.files["audio"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": f"File type not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}"}), 400

    try:
        # Save uploaded file
        ext = file.filename.rsplit(".", 1)[1].lower()
        temp_path = os.path.join(app.config["UPLOAD_FOLDER"], f"upload.{ext}")
        file.save(temp_path)

        # Convert to WAV if needed (for librosa/praat compatibility)
        wav_path = temp_path
        if ext != "wav":
            from pydub import AudioSegment
            audio = AudioSegment.from_file(temp_path)
            wav_path = os.path.join(app.config["UPLOAD_FOLDER"], "upload.wav")
            audio.export(wav_path, format="wav")

        # Step 1: Extract biomarkers
        biomarkers = extractor.extract_all(wav_path)

        # Step 2: Score cognitive risk
        risk_assessment = scorer.score(biomarkers)

        # Step 3: Transcribe (optional, may fail if Whisper not available)
        transcript = transcribe_audio(wav_path)

        # Step 4: Generate clinical narrative via Azure OpenAI
        narrative = generate_clinical_narrative(biomarkers, risk_assessment, transcript)

        # Step 5: Build response
        response = {
            "success": True,
            "risk_assessment": risk_assessment,
            "narrative": narrative,
            "transcript": transcript,
            "biomarkers": {
                "voice_quality": {
                    "jitter_percent": round(biomarkers.get("jitter_local", 0) * 100, 3),
                    "shimmer_percent": round(biomarkers.get("shimmer_local", 0) * 100, 3),
                    "hnr_db": round(biomarkers.get("hnr_mean", 0), 1),
                },
                "pitch": {
                    "f0_mean_hz": round(biomarkers.get("f0_mean", 0), 1),
                    "f0_std_hz": round(biomarkers.get("f0_std", 0), 1),
                    "f0_range_hz": round(biomarkers.get("f0_range", 0), 1),
                    "f0_cv": round(biomarkers.get("f0_cv", 0), 4),
                },
                "fluency": {
                    "speech_ratio": round(biomarkers.get("speech_ratio", 0), 3),
                    "silence_ratio": round(biomarkers.get("silence_ratio", 0), 3),
                    "pause_count": biomarkers.get("pause_count", 0),
                    "avg_pause_sec": round(biomarkers.get("avg_pause_duration", 0), 3),
                    "max_pause_sec": round(biomarkers.get("max_pause_duration", 0), 3),
                    "duration_sec": round(biomarkers.get("duration_seconds", 0), 1),
                },
                "formants": {
                    "f1_mean_hz": round(biomarkers.get("f1_mean", 0), 1),
                    "f2_mean_hz": round(biomarkers.get("f2_mean", 0), 1),
                    "f3_mean_hz": round(biomarkers.get("f3_mean", 0), 1),
                },
                "spectral": {
                    "centroid_mean": round(biomarkers.get("spectral_centroid_mean", 0), 1),
                    "bandwidth_mean": round(biomarkers.get("spectral_bandwidth_mean", 0), 1),
                    "rolloff_mean": round(biomarkers.get("spectral_rolloff_mean", 0), 1),
                },
                "energy": {
                    "mean": round(biomarkers.get("energy_mean", 0), 4),
                    "range": round(biomarkers.get("energy_range", 0), 4),
                },
            },
            "research_references": [
                {
                    "title": "Longitudinal Speech Biomarkers for Automated Alzheimer's Detection (OVBM)",
                    "source": "Frontiers in Computer Science, 2021",
                    "url": "https://www.frontiersin.org/articles/10.3389/fcomp.2021.624694/full",
                },
                {
                    "title": "Deep learning-based speech analysis for Alzheimer's disease detection",
                    "source": "Alzheimer's Research & Therapy, 2022",
                    "url": "https://alzres.biomedcentral.com/articles/10.1186/s13195-022-01131-3",
                },
                {
                    "title": "Speech based detection of Alzheimer's disease: a survey of AI techniques",
                    "source": "Artificial Intelligence Review, 2024",
                    "url": "https://link.springer.com/article/10.1007/s10462-024-10961-6",
                },
                {
                    "title": "Digital voice biomarkers and associations with cognition",
                    "source": "Alzheimer's & Dementia: Diagnosis, 2023",
                    "url": "https://alz-journals.onlinelibrary.wiley.com/doi/10.1002/dad2.12393",
                },
                {
                    "title": "eGeMAPS: Extended Geneva Minimalistic Acoustic Parameter Set",
                    "source": "IEEE Transactions on Affective Computing, 2016",
                    "url": "https://ieeexplore.ieee.org/document/7160715",
                },
            ],
        }

        # Cleanup
        try:
            os.remove(temp_path)
            if wav_path != temp_path:
                os.remove(wav_path)
        except Exception:
            pass

        return jsonify(response)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500


@app.route("/api/biomarker-info", methods=["GET"])
def biomarker_info():
    """Returns educational info about each biomarker."""
    return jsonify({
        "biomarkers": [
            {
                "id": "jitter",
                "name": "Jitter",
                "description": "Cycle-to-cycle variation in fundamental frequency (pitch perturbation). Elevated jitter indicates irregular vocal fold vibration.",
                "unit": "%",
                "healthy_range": "< 1.5%",
                "ad_indicator": "Increased jitter is associated with vocal instability seen in early cognitive decline.",
                "research": "Alzheimer's Research & Therapy, 2022",
            },
            {
                "id": "shimmer",
                "name": "Shimmer",
                "description": "Cycle-to-cycle variation in amplitude. Measures voice steadiness.",
                "unit": "%",
                "healthy_range": "< 6%",
                "ad_indicator": "Elevated shimmer reflects reduced neuromuscular control of the larynx.",
                "research": "eGeMAPS Standard (Eyben et al., 2016)",
            },
            {
                "id": "hnr",
                "name": "Harmonic-to-Noise Ratio (HNR)",
                "description": "Ratio of harmonic to noise components in voice. Measures breathiness.",
                "unit": "dB",
                "healthy_range": "> 10 dB",
                "ad_indicator": "Lower HNR indicates breathier voice quality, common in neurodegenerative conditions.",
                "research": "MDPI Applied Sciences, 2023",
            },
            {
                "id": "f0",
                "name": "Fundamental Frequency (F0)",
                "description": "The base pitch of the voice. F0 variability reflects emotional and cognitive engagement.",
                "unit": "Hz",
                "healthy_range": "Varies by age/gender",
                "ad_indicator": "Reduced F0 variability (monotone speech) is a key Alzheimer's biomarker.",
                "research": "Frontiers in Psychology, 2021",
            },
            {
                "id": "pauses",
                "name": "Speech Pauses",
                "description": "Frequency and duration of silent pauses during speech. Reflects word-finding difficulty.",
                "unit": "count/duration",
                "healthy_range": "< 15 pauses/min, avg < 0.8s",
                "ad_indicator": "Increased pause frequency and duration indicate word retrieval difficulties.",
                "research": "Frontiers in Computer Science, 2021 (OVBM)",
            },
            {
                "id": "formants",
                "name": "Formants (F1, F2, F3)",
                "description": "Resonant frequencies of the vocal tract. Reflect articulatory precision.",
                "unit": "Hz",
                "healthy_range": "Varies by vowel/speaker",
                "ad_indicator": "Reduced formant variability indicates less precise articulation.",
                "research": "Speech based detection of AD survey, 2024",
            },
        ]
    })


if __name__ == "__main__":
    print("=" * 60)
    print("  NeuroVox AI - Voice Cognitive Screening Backend")
    print("  Based on MIT/Harvard Research Protocols")
    print("=" * 60)
    app.run(debug=True, host="0.0.0.0", port=5000)
