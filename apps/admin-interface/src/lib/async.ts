import React, { useState, useCallback, ComponentType } from "react"

interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

type AsyncFunction<T, Args extends any[]> = (...args: Args) => Promise<T>

export function useAsync<T, Args extends any[]>(
  asyncFunction: AsyncFunction<T, Args>,
  immediate = false
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: immediate,
    error: null,
  })

  const execute = useCallback(
    async (...args: Args) => {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }))
      try {
        const data = await asyncFunction(...args)
        setState({ data, isLoading: false, error: null })
        return data
      } catch (error) {
        setState({
          data: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        })
        throw error
      }
    },
    [asyncFunction]
  )

  return {
    ...state,
    execute,
  }
}

interface AsyncComponentProps<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

export function withAsync<T, P extends object>(
  Component: ComponentType<P & AsyncComponentProps<T>>,
  asyncFunction: (props: P) => Promise<T>
) {
  return function AsyncComponent(props: P): React.ReactElement {
    const { data, isLoading, error } = useAsync<T, [P]>(() => asyncFunction(props), true)
    return React.createElement(Component, { ...props, data, isLoading, error })
  }
} 