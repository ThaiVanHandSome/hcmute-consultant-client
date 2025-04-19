import { useState, useRef, useCallback, useEffect } from 'react'
import { debounce } from 'lodash'

interface RecommendItem {
  question: string
  answer: string
}
export const useRecommendQuestions = () => {
  const [recommendations, setRecommendations] = useState<RecommendItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedFnRef = useRef<any>(null)

  // Hàm gọi API thực tế
  const fetchRecommendationsApi = async (text: string) => {
    if (!text.trim()) {
      setRecommendations([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `http://localhost:4000/recommend?text=${encodeURIComponent(text.trim())}`
      )
      const data = await response.json()
      
      // Log dữ liệu nhận được để debug
      console.log('API response:', data)
      
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        console.log('Setting recommendations:', data.data)
        setRecommendations(data.data)
      } else {
        console.warn('Invalid response format:', data)
        setRecommendations([])
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  // Tạo hàm debounced và lưu vào ref để tránh tạo mới ở mỗi render
  useEffect(() => {
    debouncedFnRef.current = debounce(fetchRecommendationsApi, 2000, {
      leading: false,    // Không gọi hàm khi bắt đầu nhập
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
  const fetchRecommendations = useCallback((text: string) => {
    if (debouncedFnRef.current) {
      debouncedFnRef.current(text)
    }
  }, [])

  return { recommendations, isLoading, fetchRecommendations }
}
