import { useState } from 'react'
import { debounce } from 'lodash'

interface RecommendItem {
  question: string
  answer: string
}

export const useRecommendQuestions = () => {
  const [recommendations, setRecommendations] = useState<RecommendItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchRecommendations = debounce(async (text: string) => {
    if (!text.trim()) {
      setRecommendations([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://hcmute-consultant-recommend-production.up.railway.app/recommend?text=${encodeURIComponent(text)}`
      )
      const data = await response.json()
      setRecommendations(data.data || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }, 500)

  return { recommendations, isLoading, fetchRecommendations }
}
