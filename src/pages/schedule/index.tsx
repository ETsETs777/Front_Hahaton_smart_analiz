import { theme } from 'antd'
import { useSEO } from '@/hooks/use-seo'
import { useSchedule, useSlotsLoading } from './hooks'
import { ScheduleControls, ScheduleCalendar, SlotsLoader, BookingAppointmentModal } from './components'
import './schedule-compact.css'

export default function SchedulePage() {
    const { token } = theme.useToken()

    const {
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

        // Данные
        availableComplexes,
        resources,
        aggregators,

        // Обработчики
        handleComplexChange,
        handleDateChange,
        handleSlotsLoaded,
        handleEventClick,
        handleCloseBookingModal,
        handleRefetchSlot,
        handleUpdateSlotCapacity,
        setLoadingSlotsState
    } = useSchedule()

    // Управление загрузкой слотов
    useSlotsLoading({
        hasSelectedComplex: !!selectedComplexId,
        hasSelectedDate: !!selectedDate,
        hasResources: resources.length > 0,
        setLoadingSlotsState
    })

    useSEO({
        title: 'Расписание',
        description: 'Управление расписанием и бронированиями.',
        keywords: 'расписание, бронирование, спорт, календарь',
        noindex: true,
        url: `${window.location.origin}/schedule`
    })

    return (
        <div className="flex flex-col flex-1">
            <div className="flex-1 flex flex-col">
                <div
                    className="schedule-controls flex flex-wrap items-center gap-4 py-0 border-b shrink-0"
                    style={{ borderColor: token.colorBorder }}
                >
                    <ScheduleControls
                        selectedComplexId={selectedComplexId}
                        selectedDate={selectedDate}
                        availableComplexes={availableComplexes}
                        complexesLoading={complexesLoading}
                        onComplexChange={handleComplexChange}
                        onDateChange={handleDateChange}
                    />
                </div>

                <ScheduleCalendar
                    shouldShowSchedule={shouldShowSchedule}
                    loadingSlots={loadingSlots}
                    selectedComplexId={selectedComplexId}
                    selectedDate={selectedDate}
                    resources={resources}
                    events={events}
                    onEventClick={handleEventClick}
                >
                    {shouldShowSchedule && (
                        <SlotsLoader
                            sportRoomIds={resources.map(resource => resource.id)}
                            selectedDate={selectedDate}
                            onSlotsLoaded={handleSlotsLoaded}
                            onLoadingChange={setLoadingSlotsState}
                        />
                    )}
                </ScheduleCalendar>
            </div>

            <BookingAppointmentModal
                visible={bookingModal.visible}
                slotId={bookingModal.slotId}
                roomTitle={bookingModal.roomTitle}
                complexTitle={bookingModal.complexTitle}
                appointmentsData={appointmentsData}
                appointmentsLoading={appointmentsLoading}
                slotInfo={bookingModal.slotInfo}
                aggregators={aggregators}
                events={events}
                onClose={handleCloseBookingModal}
                onRefetchSlot={handleRefetchSlot}
                onUpdateSlotCapacity={handleUpdateSlotCapacity}
            />
        </div>
    )
}
