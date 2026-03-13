import { useState, useEffect, useRef } from 'react'

export interface GitHubContributionData {
  username: string
  totalContributions: number
}

interface UseGitHubContributionsResult {
  data: GitHubContributionData | null
  isLoading: boolean
  error: boolean
}

/**
 * Hook to fetch GitHub contribution data with timeout handling.
 * - 2 second timeout - hides section on timeout
 * - Shows cached data on network error
 * - Hides section if no data available (AC4)
 */
export const useGitHubContributions = (
  username: string,
  apiUrl: string = '/api/v1/github/contributions'
): UseGitHubContributionsResult => {
  const [data, setData] = useState<GitHubContributionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const cachedDataRef = useRef<GitHubContributionData | null>(null)

  useEffect(() => {
    const fetchContributions = async () => {
      setIsLoading(true)
      setError(false)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      try {
        const response = await fetch(`${apiUrl}?username=${username}`, {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          // Network error - try cached data
          if (cachedDataRef.current) {
            setData(cachedDataRef.current)
          } else {
            setError(true)
            setData(null)
          }
          return
        }

        const result = await response.json()

        if (!result || Object.keys(result).length === 0) {
          // Empty response - hide section (AC4)
          setData(null)
          return
        }

        const contributionData: GitHubContributionData = {
          username: result.username,
          totalContributions: result.totalContributions,
        }

        // Cache the data
        cachedDataRef.current = contributionData
        setData(contributionData)
      } catch (err) {
        clearTimeout(timeoutId)

        if (err instanceof Error && err.name === 'AbortError') {
          // Timeout - hide section (AC5)
          setData(null)
          setError(true)
        } else {
          // Network error - try cached data or hide
          if (cachedDataRef.current) {
            setData(cachedDataRef.current)
          } else {
            setError(true)
            setData(null)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (username) {
      fetchContributions()
    }
  }, [username, apiUrl])

  return { data, isLoading, error }
}
