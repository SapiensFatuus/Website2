import test from 'node:test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing'

const projectId = 'study-site-tutor-storage-rules'
const rules = readFileSync(path.resolve(process.cwd(), 'storage.rules'), 'utf8')
const fileId = '123e4567-e89b-12d3-a456-426614174000'
let testEnv

if (!process.env.FIREBASE_STORAGE_EMULATOR_HOST && !process.env.FIREBASE_EMULATOR_HUB) {
  test('Storage rules require the Storage emulator', { skip: 'Run with npm run test:storage.' }, () => {})
} else {
  test.before(async () => {
    testEnv = await initializeTestEnvironment({ projectId, storage: { rules } })
  })

  test.after(async () => {
    await testEnv.cleanup()
  })

  function storageFor(uid = null) {
    return uid ? testEnv.authenticatedContext(uid).storage() : testEnv.unauthenticatedContext().storage()
  }

  function upload(storage, pathName, contentType = 'image/jpeg', body = 'image') {
    return storage.ref(pathName).putString(body, 'raw', { contentType })
  }

  test('only the signed-in owner can upload a permitted private tutor image', async () => {
    const pathName = `tutor-uploads/user-a/${fileId}.jpg`
    await assertSucceeds(upload(storageFor('user-a'), pathName))
    await assertFails(upload(storageFor(), pathName))
    await assertFails(upload(storageFor('user-b'), pathName))
  })

  test('tutor image storage denies reads and invalid uploads', async () => {
    const storage = storageFor('user-a')
    const pathName = `tutor-uploads/user-a/${fileId}.png`
    await assertFails(storage.ref(pathName).getDownloadURL())
    await assertFails(upload(storage, `tutor-uploads/user-a/${fileId}.pdf`, 'application/pdf'))
    await assertFails(upload(storage, pathName, 'application/pdf'))
    await assertFails(upload(storage, pathName, 'image/png', 'x'.repeat((5 * 1024 * 1024) + 1)))
  })
}
