from resemblyzer import VoiceEncoder, preprocess_wav
import numpy as np
import io
import base64
import traceback
import tempfile
import os

# Load voice encoder (cached)
_encoder = None

def load_voice_encoder():
    global _encoder
    if _encoder is None:
        _encoder = VoiceEncoder()
    return _encoder

def base64_to_audio(base64_string):
    """Convert base64 audio to bytes"""
    try:
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        audio_data = base64.b64decode(base64_string)
        return audio_data
    except Exception as e:
        print(f"Error decoding base64: {e}")
        raise

def get_voice_embedding(audio_base64):
    """Extract voice embedding from base64 audio"""
    temp_input = None
    temp_output = None
    
    try:
        print("Starting voice embedding extraction...")
        encoder = load_voice_encoder()
        
        # Convert base64 to audio bytes
        audio_bytes = base64_to_audio(audio_base64)
        print(f"Audio bytes length: {len(audio_bytes)}")
        
        # Create temporary files
        temp_input = tempfile.NamedTemporaryFile(delete=False, suffix='.webm')
        temp_output = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        
        # Write webm data
        temp_input.write(audio_bytes)
        temp_input.flush()
        temp_input.close()
        
        print(f"Temp input file: {temp_input.name}")
        
        # Convert webm to wav using pydub
        from pydub import AudioSegment
        
        print("Converting audio format...")
        audio_segment = AudioSegment.from_file(temp_input.name)
        
        # Convert to mono and set sample rate to 16000
        audio_segment = audio_segment.set_channels(1)
        audio_segment = audio_segment.set_frame_rate(16000)
        
        # Export as wav
        audio_segment.export(temp_output.name, format='wav')
        temp_output.close()
        
        print("Audio converted successfully")
        
        # Load with librosa
        import librosa
        audio, sr = librosa.load(temp_output.name, sr=16000, mono=True)
        print(f"Loaded audio: length={len(audio)}, sr={sr}")
        
        # Check if audio is too short
        if len(audio) < sr * 0.5:  # Less than 0.5 seconds
            return None, f"Audio too short ({len(audio)/sr:.2f}s). Please record at least 2 seconds"
        
        print(f"Audio duration: {len(audio)/sr:.2f} seconds")
        
        # Normalize audio
        if np.max(np.abs(audio)) > 0:
            audio = audio / np.max(np.abs(audio))
        
        # Preprocess and get embedding
        wav = preprocess_wav(audio, source_sr=sr)
        print(f"Preprocessed audio length: {len(wav)}")
        
        embedding = encoder.embed_utterance(wav)
        print(f"Embedding shape: {embedding.shape}")
        
        return embedding.tolist(), None
    
    except ImportError as ie:
        print(f"Import error: {ie}")
        return None, "pydub not installed. Run: pip install pydub"
    
    except Exception as e:
        print(f"Voice processing error: {e}")
        traceback.print_exc()
        return None, f"Error processing voice: {str(e)}"
    
    finally:
        # Clean up temp files
        try:
            if temp_input and os.path.exists(temp_input.name):
                os.unlink(temp_input.name)
        except Exception as e:
            print(f"Warning: Could not delete temp input file: {e}")
        
        try:
            if temp_output and os.path.exists(temp_output.name):
                os.unlink(temp_output.name)
        except Exception as e:
            print(f"Warning: Could not delete temp output file: {e}")

def compare_voices(embedding1, embedding2, threshold=0.65):
    """Compare two voice embeddings using cosine similarity"""
    if embedding1 is None or embedding2 is None:
        return False, 0.0
    
    emb1 = np.array(embedding1)
    emb2 = np.array(embedding2)
    
    # Calculate cosine similarity
    similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
    
    is_match = similarity >= threshold
    
    return is_match, float(similarity)

def find_matching_speaker(new_embedding, users_embeddings, threshold=0.65):
    """Find matching user from database voice embeddings"""
    if new_embedding is None or not users_embeddings:
        return None, 0.0
    
    best_match_id = None
    best_similarity = 0.0
    
    new_emb = np.array(new_embedding)
    
    for user_id, stored_embedding in users_embeddings.items():
        if stored_embedding:
            stored_emb = np.array(stored_embedding)
            similarity = np.dot(new_emb, stored_emb) / (np.linalg.norm(new_emb) * np.linalg.norm(stored_emb))
            
            if similarity > best_similarity:
                best_similarity = similarity
                best_match_id = user_id
    
    if best_similarity >= threshold:
        return best_match_id, float(best_similarity)
    
    return None, float(best_similarity)
