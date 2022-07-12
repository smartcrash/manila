/**
 * This code is from https://usehooks-ts.com/react-hook/use-fetch
 */

import { useEffect, useReducer, useRef } from 'react'

interface State<T> {
  data?: T
  loading: boolean
  error?: Error
}

// discriminated union type
type Action<T> =
  | { type: 'loading' }
  | { type: 'fetched'; payload: T }
  | { type: 'error'; payload: Error }

function useFetch<T = unknown>(url?: string, options?: RequestInit, immediate = true): [() => Promise<void>, State<T>] {
  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef<boolean>(false)

  const initialState: State<T> = {
    error: undefined,
    loading: false,
    data: undefined,
  }

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case 'loading':
        return { ...initialState, loading: true }
      case 'fetched':
        return { ...initialState, data: action.payload }
      case 'error':
        return { ...initialState, error: action.payload }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(fetchReducer, { ...initialState, loading: immediate })

  const execute = async () => {
    // Do nothing if the url is not given
    if (!url) return

    cancelRequest.current = false

    dispatch({ type: 'loading' })

    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const data = (await response.json()) as T
      if (cancelRequest.current) return

      dispatch({ type: 'fetched', payload: data })
    } catch (error) {
      if (cancelRequest.current) return

      dispatch({ type: 'error', payload: error as Error })
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }

    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted
    return () => {
      cancelRequest.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return [execute, state]
}

export default useFetch
