import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'

const ANNOTATIONS_COLLECTION = 'annotations'

// Save a new annotation
export async function saveAnnotation(annotationData) {
  try {
    console.log('Firestore saveAnnotation called with:', annotationData)
    console.log('Database instance:', db ? 'OK' : 'NULL')
    
    const docRef = await addDoc(collection(db, ANNOTATIONS_COLLECTION), {
      ...annotationData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    
    return {
      success: true,
      id: docRef.id,
      ...annotationData,
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error saving annotation:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    return { success: false, error: error.message }
  }
}

// Get all annotations for an article
export async function getAnnotations(articleId) {
  try {
    // Remove orderBy initially to avoid index requirement
    const q = query(
      collection(db, ANNOTATIONS_COLLECTION),
      where('articleId', '==', articleId)
    )
    
    const querySnapshot = await getDocs(q)
    const annotations = []
    
    querySnapshot.forEach((doc) => {
      annotations.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
      })
    })
    
    return { success: true, annotations }
  } catch (error) {
    console.error('Error getting annotations:', error)
    return { success: false, annotations: [], error: error.message }
  }
}

// Get annotations by user
export async function getUserAnnotations(userId) {
  try {
    const q = query(
      collection(db, ANNOTATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const annotations = []
    
    querySnapshot.forEach((doc) => {
      annotations.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
      })
    })
    
    return { success: true, annotations }
  } catch (error) {
    console.error('Error getting user annotations:', error)
    return { success: false, annotations: [], error: error.message }
  }
}

// Delete an annotation
export async function deleteAnnotation(annotationId) {
  try {
    await deleteDoc(doc(db, ANNOTATIONS_COLLECTION, annotationId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting annotation:', error)
    return { success: false, error: error.message }
  }
}

// Update an annotation
export async function updateAnnotation(annotationId, updates) {
  try {
    await updateDoc(doc(db, ANNOTATIONS_COLLECTION, annotationId), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating annotation:', error)
    return { success: false, error: error.message }
  }
}
