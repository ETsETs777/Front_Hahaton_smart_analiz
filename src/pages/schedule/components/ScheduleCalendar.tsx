import ruLocale from '@fullcalendar/core/locales/ru'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import { Card, Empty, Spin, Typography, theme } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useRef, useEffect } from 'react'
import type { CalendarEvent } from '../hooks/useSchedule'

dayjs.extend(utc)
dayjs.extend(timezone)

const { Text } = Typography

interface Resource {
    id: string
    title: string
}

interface ScheduleCalendarProps {
    shouldShowSchedule: boolean
    loadingSlots: boolean
    selectedComplexId: string | null
    selectedDate: Dayjs | null
    resources: Resource[]
    events: CalendarEvent[]
    onEventClick: (clickInfo: any) => void
    children: React.ReactNode
}

export function ScheduleCalendar({
    shouldShowSchedule,
    loadingSlots,
    selectedComplexId,
    selectedDate,
    resources,
    events,
    onEventClick,
    children
}: ScheduleCalendarProps) {
    const { token } = theme.useToken()
    const calendarRef = useRef<FullCalendar>(null)

    useEffect(() => {
        if (calendarRef.current && selectedDate) {
            const calendarApi = calendarRef.current.getApi()
            calendarApi.gotoDate(selectedDate.toDate())
        }
    }, [selectedDate])

    useEffect(() => {
        if (calendarRef.current && events.length > 0 && !loadingSlots) {
            const calendarApi = calendarRef.current.getApi()
                calendarApi.refetchEvents()
        }
    }, [events, loadingSlots])

    const renderEventContent = (eventInfo: { event: { title: string } }) => {
        return (
            <div className="fc-event-main-frame">
                <div className="fc-event-title-container">
                    <div className="fc-event-title fc-sticky">{eventInfo.event.title}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative h-full flex-1">
            {loadingSlots && (
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center z-50"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        opacity: 0.8
                    }}
                >
                    <Spin size="large" />
                    <Text className="mt-4">Загрузка слотов...</Text>
                </div>
            )}
            <Card
                variant={'borderless'}
                className="py-0 px-4 h-full"
                size="small"
                classNames={{
                    body: !shouldShowSchedule ? 'justify-center items-center flex flex-col h-full' : ''
                }}
            >
                <div className="w-full overflow-x-auto py-0">
                    {!shouldShowSchedule ? (
                        <Empty
                            description="Выберите спорткомплекс и дату, чтобы увидеть расписание"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <>
                            {children}
                            <div className="min-w-[500px] py-0">
                                <FullCalendar
                                    ref={calendarRef}
                                    key={`${selectedComplexId || ''}_${
                                        selectedDate ? selectedDate.format('YYYY-MM-DD') : ''
                                    }_${events.length}`}
                                    plugins={[resourceTimeGridPlugin, interactionPlugin]}
                                    initialView="resourceTimeGridDay"
                                    locale={ruLocale}
                                    schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
                                    headerToolbar={false}
                                    allDaySlot={false}
                                    height="auto"
                                    resources={resources}
                                    initialDate={selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : undefined}
                                    nextDayThreshold="00:00:00"
                                    events={events}
                                    slotMinTime="06:00:00"
                                    slotMaxTime="24:00:00"
                                    timeZone="Europe/Moscow"
                                    slotDuration="00:15:00"
                                    slotLabelInterval={{ hours: 1 }}
                                    slotLabelFormat={{
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    }}
                                    eventContent={renderEventContent}
                                    eventClick={onEventClick}
                                    validRange={{
                                        start: '2020-01-01',
                                        end: '2030-12-31'
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    )
}
