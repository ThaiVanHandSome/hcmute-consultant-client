import { useState, useRef, useCallback, useEffect } from 'react'
import { debounce } from 'lodash'

interface RecommendAnswerItem {
  answer: string
}

export const useRecommendAnswers = () => {
  const [recommendedAnswers, setRecommendedAnswers] = useState<RecommendAnswerItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedFnRef = useRef<any>(null)

  // Hàm gọi API lấy câu trả lời gợi ý
  const fetchRecommendedAnswersApi = async (text: string) => {
    if (!text.trim()) {
      setRecommendedAnswers([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_AI_URL}/recommend-answers?text=${encodeURIComponent(text.trim())}`
      )
      const data = await response.json()
      
      console.log('API response for answers:', data)
      
      if (data && data.data && Array.isArray(data.data)) {
        console.log('Setting recommended answers:', data.data)
        setRecommendedAnswers(data.data)
      } else {
        console.warn('Invalid response format for answers:', data)
        setRecommendedAnswers([])
      }
    } catch (error) {
      console.error('Error fetching recommended answers:', error)
      setRecommendedAnswers([])
    } finally {
      setIsLoading(false)
    }
  }

  // Tạo hàm debounced để tránh gọi API quá nhiều lần
  useEffect(() => {
    debouncedFnRef.current = debounce(fetchRecommendedAnswersApi, 1000, {
      leading: false,
      trailing: true
    })

    // Cleanup function khi component unmount
    return () => {
      if (debouncedFnRef.current) {
        debouncedFnRef.current.cancel()
      }
    }
  }, [])

  // Hàm wrapper để gọi debounced function
  const fetchRecommendedAnswers = useCallback((text: string) => {
    if (debouncedFnRef.current) {
      debouncedFnRef.current(text)
    }
  }, [])

  return { recommendedAnswers, isLoading, fetchRecommendedAnswers }
} 