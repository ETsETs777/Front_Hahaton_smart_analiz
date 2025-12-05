import { useGetEmptySlotsQuery } from '@/graphql/generated'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useEffect, useCallback } from 'react'
import type { CalendarEvent } from '../hooks/useSchedule'

dayjs.extend(utc)
dayjs.extend(timezone)

interface SlotsLoaderProps {
    sportRoomIds: string[]
    selectedDate: Dayjs | null
    onSlotsLoaded: (slots: CalendarEvent[]) => void
    onLoadingChange?: (loading: boolean) => void
}

interface SlotData {
    id: string
    dateFrom: string
    dateTo: string
    freePlaces: number
    isAvailable: boolean
}

interface RoomSlotsData {
    sportRoomId: string
    slots: SlotData[]
}

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'
const TIME_FORMAT = 'HH:mm'


export function SlotsLoader({ sportRoomIds, selectedDate, onSlotsLoaded, onLoadingChange }: SlotsLoaderProps) {
    const dateFrom = selectedDate?.tz('Europe/Moscow').startOf('day')
    const startDateUtc = dateFrom?.toDate().toISOString()
    const shouldSkip = !sportRoomIds.length || !selectedDate



    const { data, loading, error } = useGetEmptySlotsQuery({
        variables: {
            sportRoomIds,
            startDate: startDateUtc || ''
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
        skip: shouldSkip
    })
    const createSlotEvent = useCallback((slot: SlotData, roomId: string): CalendarEvent => {
        const startMoscow = dayjs(slot.dateFrom)
        const endMoscow = dayjs(slot.dateTo)

        const freePlaces = slot.freePlaces
        const isFree = freePlaces > 0

        const classNames = [isFree ? 'free-slot' : 'busy-slot']


        return {
            id: slot.id,
            resourceId: roomId,
            start: startMoscow.format(DATE_FORMAT),
            end: endMoscow.format(DATE_FORMAT),
            allDay: false,
            title: `${startMoscow.format(TIME_FORMAT)}-${endMoscow.format(TIME_FORMAT)} ${freePlaces} мест`,
            extendedProps: {
                capacity: slot.freePlaces,
                freePlaces
            },
            classNames
        }
    }, [])

    const processRoomSlots = useCallback((roomSlots: RoomSlotsData): CalendarEvent[] => {
        const slots = roomSlots.slots || []
        const availableSlots = slots.filter(slot => slot.isAvailable)
        return availableSlots.map(slot => createSlotEvent(slot, roomSlots.sportRoomId))
    }, [createSlotEvent])

    useEffect(() => {
        onLoadingChange?.(loading)
    }, [loading, onLoadingChange])

    useEffect(() => {
        if (!loading && data) {
            const all = data.slot_GetEmpty || []
            
            const allEvents = all.flatMap(processRoomSlots) || []
            onSlotsLoaded(allEvents)
        }

        if (error) {
            onSlotsLoaded([])
        }
    }, [data, loading, error, onSlotsLoaded, processRoomSlots])

    return null
}
