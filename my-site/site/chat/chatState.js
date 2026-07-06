export const initialChatState = Object.freeze({
  messages: [],
  status: 'empty',
  error: null,
  retryRequest: null,
})

export function chatReducer(state, action) {
  if (action.type === 'send') {
    return {
      messages: [...state.messages, { role: 'user', content: action.request.message }],
      status: 'loading',
      error: null,
      retryRequest: action.request,
    }
  }
  if (action.type === 'retry') return { ...state, status: 'loading', error: null }
  if (action.type === 'success') {
    return {
      messages: [...state.messages, {
        role: 'assistant',
        content: action.response.answer,
        sourceIds: action.response.sourceIds,
        insufficient: action.response.insufficient,
        mode: action.response.mode,
      }],
      status: 'ready',
      error: null,
      retryRequest: null,
    }
  }
  if (action.type === 'error') return { ...state, status: 'error', error: action.error }
  return state
}
