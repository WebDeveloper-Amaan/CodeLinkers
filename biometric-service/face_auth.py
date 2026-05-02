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

def compare_faces(embedding1, embedding2, tolerance=0.4):
    """Compare two face embeddings using multiple metrics for strict matching"""
    if embedding1 is None or embedding2 is None:
        return False, 0.0
    
    emb1 = np.array(embedding1)
    emb2 = np.array(embedding2)
    
    # 1. Calculate Euclidean distance (stricter threshold)
    euclidean_distance = np.linalg.norm(emb1 - emb2)
    
    # 2. Calculate Cosine similarity for additional verification
    dot_product = np.dot(emb1, emb2)
    norm1 = np.linalg.norm(emb1)
    norm2 = np.linalg.norm(emb2)
    cosine_similarity = dot_product / (norm1 * norm2) if (norm1 * norm2) > 0 else 0
    
    # 3. Calculate Manhattan distance for triple verification
    manhattan_distance = np.sum(np.abs(emb1 - emb2))
    
    # Convert distances to similarity scores
    euclidean_similarity = max(0, 1 - (euclidean_distance / 2))
    manhattan_similarity = max(0, 1 - (manhattan_distance / 128))  # 128D embedding
    
    # Combined similarity score (weighted average)
    # Cosine similarity is most reliable for face recognition
    combined_similarity = (
        cosine_similarity * 0.5 +           # 50% weight
        euclidean_similarity * 0.3 +        # 30% weight
        manhattan_similarity * 0.2          # 20% weight
    )
    
    # Strict matching criteria - ALL conditions must be met
    is_match = (
        euclidean_distance <= tolerance and      # Euclidean distance check
        cosine_similarity >= 0.75 and            # Cosine similarity check (stricter)
        manhattan_distance <= 50 and             # Manhattan distance check
        combined_similarity >= 0.70              # Combined score check
    )
    
    return is_match, float(combined_similarity)

def find_matching_user(new_embedding, users_embeddings, tolerance=0.4):
    """Find matching user from database face embeddings with strict verification"""
    if new_embedding is None or not users_embeddings:
        return None, 0.0
    
    best_match_id = None
    best_similarity = 0.0
    best_distance = float('inf')
    best_cosine = 0.0
    
    new_emb = np.array(new_embedding)
    
    # Normalize the new embedding for better comparison
    new_emb_normalized = new_emb / np.linalg.norm(new_emb)
    
    matches = []
    
    for user_id, stored_embedding in users_embeddings.items():
        if stored_embedding:
            stored_emb = np.array(stored_embedding)
            stored_emb_normalized = stored_emb / np.linalg.norm(stored_emb)
            
            # Calculate multiple distance metrics
            euclidean_distance = np.linalg.norm(new_emb - stored_emb)
            cosine_similarity = np.dot(new_emb_normalized, stored_emb_normalized)
            manhattan_distance = np.sum(np.abs(new_emb - stored_emb))
            
            # Calculate combined similarity
            euclidean_similarity = max(0, 1 - (euclidean_distance / 2))
            manhattan_similarity = max(0, 1 - (manhattan_distance / 128))
            
            combined_similarity = (
                cosine_similarity * 0.5 +
                euclidean_similarity * 0.3 +
                manhattan_similarity * 0.2
            )
            
            # Store match data for analysis
            matches.append({
                'user_id': user_id,
                'euclidean_distance': euclidean_distance,
                'cosine_similarity': cosine_similarity,
                'manhattan_distance': manhattan_distance,
                'combined_similarity': combined_similarity
            })
    
    # Sort by combined similarity (highest first)
    matches.sort(key=lambda x: x['combined_similarity'], reverse=True)
    
    # Check if best match meets ALL strict criteria
    if matches:
        best_match = matches[0]
        
        # Strict verification - ALL conditions must pass
        if (
            best_match['euclidean_distance'] <= tolerance and
            best_match['cosine_similarity'] >= 0.75 and
            best_match['manhattan_distance'] <= 50 and
            best_match['combined_similarity'] >= 0.70
        ):
            # Additional check: ensure significant gap from second-best match
            if len(matches) > 1:
                second_best = matches[1]
                similarity_gap = best_match['combined_similarity'] - second_best['combined_similarity']
                
                # Require at least 10% gap to avoid ambiguous matches
                if similarity_gap >= 0.10:
                    return best_match['user_id'], float(best_match['combined_similarity'])
                else:
                    # Too close to another face - reject for safety
                    return None, 0.0
            else:
                # Only one user in database
                return best_match['user_id'], float(best_match['combined_similarity'])
    
    return None, 0.0
