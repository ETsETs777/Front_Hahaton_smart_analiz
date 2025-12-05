import { useEffect } from 'react'

interface UseSlotsLoadingProps {
    hasSelectedComplex: boolean
    hasSelectedDate: boolean
    hasResources: boolean
    setLoadingSlotsState: (loading: boolean) => void
}

export function useSlotsLoading({
    hasSelectedComplex,
    hasSelectedDate,
    hasResources,
    setLoadingSlotsState
}: UseSlotsLoadingProps) {
    useEffect(() => {
        // Сбрасываем состояние загрузки, если не выбраны необходимые параметры
        if (!hasSelectedComplex || !hasSelectedDate || !hasResources) {
            setLoadingSlotsState(false)
        }
    }, [hasSelectedComplex, hasSelectedDate, hasResources, setLoadingSlotsState])
} 