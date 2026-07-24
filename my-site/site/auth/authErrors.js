export function getAuthErrorMessage(error) {
  if (!error?.code) {
    return 'Sign-in did not finish. Please try again.'
  }

  if (
    error.code === 'auth/popup-closed-by-user'
    || error.code === 'auth/cancelled-popup-request'
  ) {
    return 'Sign-in was canceled.'
  }

  if (error.code === 'auth/popup-blocked') {
    return 'Your browser blocked the sign-in popup. Allow popups and try again.'
  }

  if (error.code === 'auth/unauthorized-domain') {
    return 'Google sign-in is not authorized for this website address. Add this domain in Firebase Authentication settings.'
  }

  if (error.code === 'auth/operation-not-allowed') {
    return 'Google sign-in is not enabled in Firebase Authentication yet.'
  }

  if (error.code === 'auth/network-request-failed') {
    return 'Google sign-in could not reach Firebase. Check your connection and try again.'
  }

  return 'Sign-in did not finish. Please try again.'
}
