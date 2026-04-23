from flask import Flask, request, jsonify
from flask_cors import CORS
import face_auth
import voice_auth

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'biometric-auth',
        'version': '1.0.0'
    })

@app.route('/extract-face', methods=['POST'])
def extract_face():
    """Extract face embedding from image"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                'success': False,
                'error': 'No image provided'
            }), 400
        
        image_base64 = data['image']
        
        embedding, error = face_auth.get_face_embedding(image_base64)
        
        if error:
            return jsonify({
                'success': False,
                'error': error
            }), 400
        
        return jsonify({
            'success': True,
            'embedding': embedding
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/verify-face', methods=['POST'])
def verify_face():
    """Verify face against stored embedding"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data or 'storedEmbedding' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing image or stored embedding'
            }), 400
        
        image_base64 = data['image']
        stored_embedding = data['storedEmbedding']
        threshold = data.get('threshold', 0.5)
        
        # Extract embedding from new image
        new_embedding, error = face_auth.get_face_embedding(image_base64)
        
        if error:
            return jsonify({
                'success': False,
                'error': error
            }), 400
        
        # Compare embeddings
        is_match, similarity = face_auth.compare_faces(new_embedding, stored_embedding, threshold)
        
        return jsonify({
            'success': True,
            'isMatch': is_match,
            'similarity': similarity
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/find-face-match', methods=['POST'])
def find_face_match():
    """Find matching user from multiple stored embeddings"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data or 'usersEmbeddings' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing image or users embeddings'
            }), 400
        
        image_base64 = data['image']
        users_embeddings = data['usersEmbeddings']  # {userId: embedding}
        threshold = data.get('threshold', 0.5)
        
        # Extract embedding from new image
        new_embedding, error = face_auth.get_face_embedding(image_base64)
        
        if error:
            return jsonify({
                'success': False,
                'error': error
            }), 400
        
        # Find matching user
        matched_user_id, similarity = face_auth.find_matching_user(new_embedding, users_embeddings, threshold)
        
        return jsonify({
            'success': True,
            'matchedUserId': matched_user_id,
            'similarity': similarity
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/extract-voice', methods=['POST'])
def extract_voice():
    """Extract voice embedding from audio"""
    try:
        data = request.get_json()
        
        if not data or 'audio' not in data:
            return jsonify({
                'success': False,
                'error': 'No audio provided'
            }), 400
        
        audio_base64 = data['audio']
        
        embedding, error = voice_auth.get_voice_embedding(audio_base64)
        
        if error:
            return jsonify({
                'success': False,
                'error': error
            }), 400
        
        return jsonify({
            'success': True,
            'embedding': embedding
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/verify-voice', methods=['POST'])
def verify_voice():
    """Verify voice against stored embedding"""
    try:
        data = request.get_json()
        
        if not data or 'audio' not in data or 'storedEmbedding' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing audio or stored embedding'
            }), 400
        
        audio_base64 = data['audio']
        stored_embedding = data['storedEmbedding']
        threshold = data.get('threshold', 0.65)
        
        # Extract embedding from new audio
        new_embedding, error = voice_auth.get_voice_embedding(audio_base64)
        
        if error:
            return jsonify({
                'success': False,
                'error': error
            }), 400
        
        # Compare embeddings
        is_match, similarity = voice_auth.compare_voices(new_embedding, stored_embedding, threshold)
        
        return jsonify({
            'success': True,
            'isMatch': is_match,
            'similarity': similarity
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/find-voice-match', methods=['POST'])
def find_voice_match():
    """Find matching user from multiple stored voice embeddings"""
    try:
        data = request.get_json()
        
        if not data or 'audio' not in data or 'usersEmbeddings' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing audio or users embeddings'
            }), 400
        
        audio_base64 = data['audio']
        users_embeddings = data['usersEmbeddings']  # {userId: embedding}
        threshold = data.get('threshold', 0.65)
        
        # Extract embedding from new audio
        new_embedding, error = voice_auth.get_voice_embedding(audio_base64)
        
        if error:
            return jsonify({
                'success': False,
                'error': error
            }), 400
        
        # Find matching user
        matched_user_id, similarity = voice_auth.find_matching_speaker(new_embedding, users_embeddings, threshold)
        
        return jsonify({
            'success': True,
            'matchedUserId': matched_user_id,
            'similarity': similarity
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("🚀 Biometric Authentication Service Starting...")
    print("📡 Face Recognition: Ready")
    print("🎤 Voice Recognition: Ready")
    print("🌐 Server running on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
