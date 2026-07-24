import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { app } from './firebaseApp.js'
import { clientEnvironment } from './environment.js'

export const db = getFirestore(app)

if (typeof window !== 'undefined' && clientEnvironment.useFirestoreEmulator) {
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}
