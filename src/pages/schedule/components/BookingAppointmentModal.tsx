import { Modal } from 'antd'
import { BookingsAppointmentTable } from '../bookings-appointment-table'

interface BookingModalProps {
    visible: boolean
    slotId: string | null
    roomTitle: string
    complexTitle: string
    appointmentsData: any
    appointmentsLoading: boolean
    slotInfo: {
        id: string
        dateFrom: string
        dateTo: string
        capacity: number
        occupiedPlaces: number
        allDaySlots: any[]
        resourceId: string
    } | null
    aggregators: Array<{
        id: string
        name: string
    }>
    events: any[]
    onClose: () => void
    onRefetchSlot: () => void
    onUpdateSlotCapacity?: (slotId: string, freePlaces: number) => void
}

export function BookingAppointmentModal({
    visible,
    slotId,
    roomTitle,
    complexTitle,
    appointmentsData,
    appointmentsLoading,
    slotInfo,
    aggregators,
    events,
    onClose,
    onRefetchSlot,
    onUpdateSlotCapacity
}: BookingModalProps) {
    const toNumberSafe = (value: unknown): number => {
        const n = typeof value === 'number' ? value : Number(String(value ?? '0'))
        return Number.isFinite(n) ? n : 0
    }
    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
            destroyOnHidden
            centered={false}
            style={{ top: 20 }}
            confirmLoading={appointmentsLoading}
            styles={{
                body: { paddingRight: 24, paddingLeft: 24 },
                content: { maxHeight: 'calc(100vh - 40px)', overflow: 'auto' }
            }}
        >
            {visible && appointmentsData?.appointment_GetAppointmentsBySlotId && slotInfo && (
                <BookingsAppointmentTable
                    slot={{
                        ...slotInfo,
                        allDaySlots: events,
                        appointments: appointmentsData.appointment_GetAppointmentsBySlotId
                    }}
                    roomTitle={roomTitle}
                    complexTitle={complexTitle}
                    aggregators={aggregators}
                    onClose={onClose}
                    refetchSlot={onRefetchSlot}
                    onUpdateSlotCapacity={onUpdateSlotCapacity}
                />
            )}
        </Modal>
    )
}
