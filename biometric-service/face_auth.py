import face_recognition
import numpy as np
import base64
import io
from PIL import Image

def base64_to_image(base64_string):
    """Convert base64 string to numpy array image"""
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    
    image_data = base64.b64decode(base64_string)
    image = Image.open(io.BytesIO(image_data))
    
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    return np.array(image)

def get_face_embedding(image_base64):
    """Extract face embedding from base64 image"""
    try:
        image = base64_to_image(image_base64)
        
        # Detect face locations
        face_locations = face_recognition.face_locations(image)
        
        if len(face_locations) == 0:
            return None, "No face detected. Please ensure your face is clearly visible"
        
        if len(face_locations) > 1:
            return None, "Multiple faces detected. Please ensure only one face is visible"
        
        # Get face encoding (128D embedding)
        face_encodings = face_recognition.face_encodings(image, face_locations)
        
        if len(face_encodings) == 0:
            return None, "Could not encode face. Please try again with better lighting"
        
        return face_encodings[0].tolist(), None
    
    except Exception as e:
        return None, f"Error processing face: {str(e)}"

def compare_faces(embedding1, embedding2, tolerance=0.6):
    """Compare two face embeddings using Euclidean distance"""
    if embedding1 is None or embedding2 is None:
        return False, 0.0
    
    emb1 = np.array(embedding1)
    emb2 = np.array(embedding2)
    
    # Calculate Euclidean distance
    distance = np.linalg.norm(emb1 - emb2)
    
    # Convert to similarity score (0-1, where 1 is perfect match)
    similarity = max(0, 1 - (distance / 2))
    
    is_match = distance <= tolerance
    
    return is_match, float(similarity)

def find_matching_user(new_embedding, users_embeddings, tolerance=0.6):
    """Find matching user from database face embeddings"""
    if new_embedding is None or not users_embeddings:
        return None, 0.0
    
    best_match_id = None
    best_similarity = 0.0
    best_distance = float('inf')
    
    new_emb = np.array(new_embedding)
    
    for user_id, stored_embedding in users_embeddings.items():
        if stored_embedding:
            stored_emb = np.array(stored_embedding)
            distance = np.linalg.norm(new_emb - stored_emb)
            similarity = max(0, 1 - (distance / 2))
            
            if distance < best_distance:
                best_distance = distance
                best_similarity = similarity
                best_match_id = user_id
    
    if best_distance <= tolerance:
        return best_match_id, float(best_similarity)
    
    return None, float(best_similarity)
