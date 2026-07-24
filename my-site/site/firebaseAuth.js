import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { app } from './firebaseApp.js'
import { clientEnvironment } from './environment.js'

export const auth = getAuth(app)

if (typeof window !== 'undefined' && clientEnvironment.useAuthEmulator) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
}
