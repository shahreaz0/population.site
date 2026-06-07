import { useQueryStates } from "nuqs"
import { createLoader, parseAsString } from "nuqs/server"
import React from "react"

export const _rankingsSearchParams = {
  sortBy: parseAsString.withDefault("population"),
  continent: parseAsString.withDefault("all"),
  search: parseAsString.withDefault(""),
}

export const loadRankingsSearchParams = createLoader(_rankingsSearchParams)

export function useRankingsSearchParams(defaultSort?: string) {
  const [isLoading, startTransition] = React.useTransition()

  const parser = React.useMemo(() => {
    return {
      sortBy: parseAsString.withDefault(defaultSort || "population"),
      continent: parseAsString.withDefault("all"),
      search: parseAsString.withDefault(""),
    }
  }, [defaultSort])

  const [rankingsSearchParams, setRankingsSearchParams] = useQueryStates(
    parser,
    {
      startTransition,
      shallow: false,
    }
  )

  return {
    rankingsSearchParams,
    setRankingsSearchParams,
    isLoading,
  }
}
