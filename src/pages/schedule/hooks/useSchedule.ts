import type { GetAllSportComplexesForAdminQuery } from '@/graphql/generated'
import {
    useGetAllSportComplexesForAdminQuery,
    useGetAppointmentsBySlotIdLazyQuery,
    useGetAllAggregatorsQuery
} from '@/graphql/generated'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { App } from 'antd'
import { useAuth } from '@/contexts/auth-context'

dayjs.extend(utc)
dayjs.extend(timezone)

type SportComplex = NonNullable<GetAllSportComplexesForAdminQuery['sportComplexes_Get']>[0]
type SportRoom = SportComplex['sportRooms'][0]

interface Resource {
    id: string
    title: string
}

export interface CalendarEvent {
    id: string
    resourceId: string
    start: string
    end: string
    allDay: boolean
    title: string
    extendedProps: {
        capacity: number
        freePlaces: number
        isPast?: boolean
    }
    classNames: string[]
}

interface BookingModalState {
    visible: boolean
    slotId: string | null
    roomTitle: string
    complexTitle: string
    slotInfo: {
        id: string
        dateFrom: string
        dateTo: string
        capacity: number
        occupiedPlaces: number
        allDaySlots: CalendarEvent[]
        resourceId: string
    } | null
}

interface EventClickInfo {
    event: {
        id: string
        start: string
        end: string
        extendedProps: {
            capacity: number
            freePlaces: number
        }
        getResources: () => Array<{ id: string }>
    }
    resource?: Resource
}

const INITIAL_BOOKING_MODAL: BookingModalState = {
    visible: false,
    slotId: null,
    roomTitle: '',
    complexTitle: '',
    slotInfo: null
}

export function useSchedule() {
    const { message } = App.useApp()
    const { user } = useAuth()
    // Состояние выбора
    const [selectedComplexId, setSelectedComplexId] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
    const [aggregators, setAggregators] = useState<Array<{ id: string; name: string }>>([])

    // Получение агрегаторов один раз при инициализации
    const { data: aggregatorsData } = useGetAllAggregatorsQuery({
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: false,
        nextFetchPolicy: 'cache-first',
        skip: false
    })
    useEffect(() => {
        if (aggregatorsData?.aggregator_GetAll) {
            const formattedAggregators = aggregatorsData.aggregator_GetAll.map(agg => ({
                id: agg.id,
                name: agg.name || 'Без названия'
            }))
            setAggregators(formattedAggregators)
        }
    }, [aggregatorsData])

    // Состояние событий
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)

    // Состояние модального окна
    const [bookingModal, setBookingModal] = useState<BookingModalState>(INITIAL_BOOKING_MODAL)

    // GraphQL запросы
    const [fetchAppointments, { data: appointmentsData, loading: appointmentsLoading }] =
        useGetAppointmentsBySlotIdLazyQuery({
            fetchPolicy: 'network-only'
        })
    const { data: complexesData, loading: complexesLoading } = useGetAllSportComplexesForAdminQuery()

    // Вычисляемые данные
    const sportComplexes: SportComplex[] = useMemo(
        () => complexesData?.sportComplexes_Get || [],
        [complexesData?.sportComplexes_Get]
    )

    // Автовыбор для менеджера
    useEffect(() => {
        if (
            user &&
            user.role === 'Manager' &&
            user.sportComplexes &&
            user.sportComplexes.length > 0 &&
            !complexesLoading &&
            sportComplexes.length > 0
        ) {
            const firstComplex = sportComplexes.find(c => user.sportComplexes?.some(u => u.id === c.id))
            if (firstComplex) {
                setSelectedDate(dayjs())
                setSelectedComplexId(firstComplex.id)
            }
        }
    }, [user, complexesLoading, sportComplexes])

    const selectedComplex = useMemo(
        () => sportComplexes.find(complex => complex.id === selectedComplexId),
        [selectedComplexId, sportComplexes]
    )

    const resources = useMemo(
        () =>
            selectedComplex?.sportRooms
                .filter((room: SportRoom) => room.isActive)
                .map((room: SportRoom) => ({
                    id: room.id,
                    title: room.title
                })) || [],
        [selectedComplex]
    )

    const availableComplexes = useMemo(
        () => sportComplexes.filter(complex => complex.sportRooms.some(room => room.isActive)),
        [sportComplexes]
    )
    const shouldShowSchedule = !!(selectedComplexId && selectedDate)
    const handleComplexChange = useCallback((complexId: string) => {
        setSelectedComplexId(complexId)
        setEvents([])
        
        if (selectedDate) {
            setLoadingSlots(true)
        }
    }, [selectedDate])

    const handleDateChange = useCallback((date: Dayjs | null) => {
        setSelectedDate(date)
        setEvents([])
        
        if (selectedComplexId) {
            setLoadingSlots(true)
        }
    }, [selectedComplexId])

    const handleSlotsLoaded = useCallback((newSlots: CalendarEvent[]) => {
        setEvents(newSlots)
        setLoadingSlots(false)
    }, [])

    const handleEventClick = useCallback(
        (clickInfo: EventClickInfo) => {
            const { event, resource } = clickInfo
            const eventResource = resource || resources.find(r => r.id === event.getResources()[0]?.id)

            if (!eventResource) {
                message.error('Ошибка: не удалось определить спортивную площадку')
                return
            }

            fetchAppointments({ variables: { slotId: event.id } })
            setBookingModal({
                visible: true,
                slotId: event.id,
                roomTitle: eventResource.title,
                complexTitle: selectedComplex?.title || '',
                slotInfo: {
                    id: event.id,
                    dateFrom: event.start,
                    dateTo: event.end,
                    capacity: event.extendedProps?.capacity || 0,
                    occupiedPlaces: (event.extendedProps?.capacity || 0) - (event.extendedProps?.freePlaces || 0),
                    allDaySlots: events,
                    resourceId: eventResource.id
                }
            })
        },
        [resources, selectedComplex, fetchAppointments, events, message]
    )

    const handleCloseBookingModal = useCallback(() => {
        setBookingModal(INITIAL_BOOKING_MODAL)
    }, [])

    const handleRefetchSlot = useCallback(() => {
        if (bookingModal.slotId) {
            fetchAppointments({ variables: { slotId: bookingModal.slotId } })
        }
    }, [bookingModal.slotId, fetchAppointments])

    const handleUpdateSlotCapacity = useCallback(
        (slotId: string, freePlaces: number) => {
            setEvents(prevEvents =>
                prevEvents.map(event => {
                    if (event.id === slotId) {
                        const isFree = freePlaces > 0
                        return {
                            ...event,
                            extendedProps: {
                                ...event.extendedProps,
                                freePlaces
                            },
                            title: event.title.replace(/\d+ мест/, `${freePlaces} мест`),
                            classNames: [isFree ? 'free-slot' : 'busy-slot']
                        }
                    }
                    return event
                })
            )

            if (bookingModal.slotId === slotId) {
                setBookingModal(prev => {
                    if (prev.slotInfo && prev.slotInfo.id === slotId) {
                        const capacity = prev.slotInfo.capacity
                        const newOccupiedPlaces = capacity - freePlaces
                        return {
                            ...prev,
                            slotInfo: {
                                ...prev.slotInfo,
                                occupiedPlaces: newOccupiedPlaces
                            }
                        }
                    }
                    return prev
                })
            }
        },
        [bookingModal.slotId]
    )

    useEffect(() => {
        try {
            const currentSlotId = bookingModal.slotId
            if (!currentSlotId) return
            
            const list = appointmentsData?.appointment_GetAppointmentsBySlotId
            if (!list || list.length === 0) return
            
            const anyWithSlot = list.find(a => Array.isArray(a.slots) && a.slots.some(s => s.id === currentSlotId))
            const slotFromData = anyWithSlot?.slots?.find((s: unknown) => (s as { id: string }).id === currentSlotId)
            const free = typeof slotFromData?.freePlaces === 'number' ? slotFromData.freePlaces : undefined
            
            if (typeof free === 'number') {
                handleUpdateSlotCapacity(currentSlotId, free)
            }
        } catch {
            // Ошибка при обработке данных записей
        }
    }, [appointmentsData, bookingModal.slotId, handleUpdateSlotCapacity])

    const setLoadingSlotsState = useCallback((loading: boolean) => {
        setLoadingSlots(loading)
    }, [])

    return {
        // Состояние
        selectedComplexId,
        selectedDate,
        events,
        loadingSlots,
        bookingModal,
        appointmentsData,
        appointmentsLoading,
        complexesLoading,
        shouldShowSchedule,
        aggregators,

        // Данные
        sportComplexes,
        selectedComplex,
        resources,
        availableComplexes,

        // Обработчики
        handleComplexChange,
        handleDateChange,
        handleSlotsLoaded,
        handleEventClick,
        handleCloseBookingModal,
        handleRefetchSlot,
        handleUpdateSlotCapacity,
        setLoadingSlotsState
    }
}
