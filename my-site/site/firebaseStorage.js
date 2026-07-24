import { connectStorageEmulator, getStorage } from 'firebase/storage'
import { app } from './firebaseApp.js'
import { clientEnvironment } from './environment.js'

export const storage = getStorage(app)

if (typeof window !== 'undefined' && clientEnvironment.useStorageEmulator) {
  connectStorageEmulator(storage, '127.0.0.1', 9199)
}
