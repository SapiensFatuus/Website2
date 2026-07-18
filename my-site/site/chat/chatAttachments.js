import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { app } from '../firebase.js'

export const TUTOR_IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const TUTOR_IMAGE_TYPES = Object.freeze(['image/jpeg', 'image/png', 'image/webp'])

const extensionByType = Object.freeze({
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
})

export function validateTutorImage(file) {
  if (!file) return 'Choose a JPEG, PNG, or WebP image.'
  if (!TUTOR_IMAGE_TYPES.includes(file.type)) return 'Photos must be JPEG, PNG, or WebP files.'
  if (file.size <= 0 || file.size > TUTOR_IMAGE_MAX_BYTES) return 'Photos must be no larger than 5 MB.'
  return ''
}

export async function uploadTutorImage(file, uid) {
  const error = validateTutorImage(file)
  if (error) throw new Error(error)
  if (!uid) throw new Error('Sign in with Google to attach a homework photo.')
  const extension = extensionByType[file.type]
  const fileId = crypto.randomUUID()
  const storagePath = `tutor-uploads/${uid}/${fileId}.${extension}`
  const storage = getStorage(app)
  await uploadBytes(ref(storage, storagePath), file, { contentType: file.type })
  return storagePath
}
