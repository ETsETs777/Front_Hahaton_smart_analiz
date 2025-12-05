import {
    useBookAppointmentByReceptionMutation,
    useSetAppointmentVisitedStatusMutation,
    useSetAppointmentCancelledStatusMutation,
    useSetAppointmentNotVisitedStatusMutation
} from '@/graphql/generated'
import { GetAppointmentsBySlotIdDocument } from '@/graphql/generated'
import { Button, Form, Input, message, Select, theme, Typography, Popconfirm, Card, Statistic, Row, Col, Tag, Space, Divider, Tooltip, Spin, Segmented } from 'antd'
import { PlusOutlined, CloseOutlined, CheckOutlined, CalendarOutlined, ClockCircleOutlined, TeamOutlined, SearchOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
 
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
 
import { DataTable } from '@/components/ui'
import { SlotsSelectionModal } from './components'
import type { ColumnsType } from 'antd/es/table'
import { SlotTooltip } from '@/components/ui'

dayjs.extend(utc)
dayjs.extend(timezone)

const { Text } = Typography

interface BookingRow {
    key: string
    clientPhone: string
    clientPhoneValue?: string
    clientSnilsValue?: string
    aggregatorId: string
    status: string
    isEditing: boolean
    appointmentId?: string
    selectedSlots?: string[]
    slots?: Array<{
        id: string
        dateFrom: string
        dateTo: string
        capacity: number
        occupiedPlaces: number
    }>
}

interface BookingsTableProps {
    slot: {
        id: string
        dateFrom: string
        dateTo: string
        capacity: number
        occupiedPlaces: number
        allDaySlots: any[]
        appointments: any[]
        resourceId: string 
    }
    roomTitle: string
    complexTitle: string
    aggregators: Array<{
        id: string
        name: string
    }>
    onClose: () => void
    refetchSlot?: () => void
    onUpdateSlotCapacity?: (slotId: string, freePlaces: number) => void
}

export const BookingsAppointmentTable = ({
    slot,
    roomTitle,
    complexTitle,
    aggregators,
    onClose,
    refetchSlot,
    onUpdateSlotCapacity
}: BookingsTableProps) => {
    const { token } = theme.useToken()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [creatingBooking, setCreatingBooking] = useState(false)
    const [loadingStatusAppointmentId, setLoadingStatusAppointmentId] = useState<string | null>(null)
    const [bookings, setBookings] = useState<BookingRow[]>([])
    const [editingKey, setEditingKey] = useState<string>('')
    const toNumberSafe = (value: unknown): number => {
        const n = typeof value === 'number' ? value : Number(String(value ?? '0'))
        return Number.isFinite(n) ? n : 0
    }
    const [freePlaces, setFreePlaces] = useState(
        Math.max(0, toNumberSafe(slot.capacity) - toNumberSafe(slot.occupiedPlaces))
    )
    const [occupiedPlaces, setOccupiedPlaces] = useState(toNumberSafe(slot.occupiedPlaces))
    const [currentPage, setCurrentPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [selectOpen, setSelectOpen] = useState(false)
    const [isSlotsSelectionModalOpen, setIsSlotsSelectionModalOpen] = useState(false)
    const [clientIdType, setClientIdType] = useState<'phone' | 'snils'>('phone')
    const [selectedSlotsInModal, setSelectedSlotsInModal] = useState<string[]>([slot.id])

    useEffect(() => {
        const cap = toNumberSafe(slot.capacity)
        const occ = toNumberSafe(slot.occupiedPlaces)
        setFreePlaces(Math.max(0, cap - occ))
        setOccupiedPlaces(occ)
    }, [slot.capacity, slot.occupiedPlaces])

    const [createBooking] = useBookAppointmentByReceptionMutation()
    const [setVisitedStatus] = useSetAppointmentVisitedStatusMutation()
    const [setCancelledStatus] = useSetAppointmentCancelledStatusMutation()
    const [setNotVisitedStatus] = useSetAppointmentNotVisitedStatusMutation()

    const existingBookings: BookingRow[] = (slot.appointments || []).map((appointment: any) => ({
        key: `existing-${appointment.id}`,
        clientPhone: appointment.client?.phone || appointment.client?.snils || '',
        clientPhoneValue: appointment.client?.phone || '',
        clientSnilsValue: appointment.client?.snils || '',
        aggregatorId: appointment.aggregator?.id || '',
        status: appointment.status || '',
        isEditing: false,
        slots: appointment.slots || []
    }))

    const allBookings = [...bookings, ...existingBookings]

    const filteredBookings = allBookings
        .filter(booking => {
            const matchesSearch =
                booking.clientPhone.toLowerCase().includes(searchText.toLowerCase()) ||
                (booking.clientSnilsValue || '').toLowerCase().includes(searchText.toLowerCase()) ||
                aggregators
                    .find(agg => agg.id === booking.aggregatorId)
                    ?.name.toLowerCase()
                    .includes(searchText.toLowerCase())

            const matchesStatus = statusFilter === 'all' || booking.status === statusFilter

            return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
            if (a.status === 'Cancelled' && b.status !== 'Cancelled') return 1
            if (a.status !== 'Cancelled' && b.status === 'Cancelled') return -1
            return 0
        })

    const statusStats = {
        all: allBookings.length,
        Booked: allBookings.filter(b => b.status === 'Booked').length,
        Visited: allBookings.filter(b => b.status === 'Visited').length,
        Cancelled: allBookings.filter(b => b.status === 'Cancelled').length,
        NotVisited: allBookings.filter(b => b.status === 'NotVisited').length
    }

    const isEditing = (record: BookingRow) => record.key === editingKey

    const edit = (record: BookingRow) => {
        form.setFieldsValue({
            clientPhone: record.clientPhone,
            aggregatorId: record.aggregatorId,
            status: record.status,
            selectedSlots: record.selectedSlots || [slot.id]
        })
        setEditingKey(record.key)
    }

    const cancel = () => {
        setEditingKey('')
        const newBookings = bookings.filter(booking => {
            if (booking.key === editingKey) {
                return !(booking.clientPhone === '' && booking.aggregatorId === '' && booking.status === '')
            }
            return true
        })
        setBookings(newBookings)
        form.resetFields()
    }

    const save = async (key: string) => {
        setCreatingBooking(true)
        try {
            const row = await form.validateFields()
            const newData = [...bookings]
            const index = newData.findIndex(item => key === item.key)

            if (index > -1) {
                const item = newData[index]
                const updatedItem = {
                    ...item,
                    ...row,
                    isEditing: false
                }
                const selectedSlotIds =
                    row.selectedSlots && row.selectedSlots.length > 0 ? row.selectedSlots : [slot.id]
                const result = await createBooking({
                    variables: {
                        input: {
                            slotIds: selectedSlotIds,
                            client: (() => {
                                const raw = String(row.clientPhone || '')
                                const digits = raw.replace(/[^0-9]/g, '')
                                return clientIdType === 'snils' ? { snils: digits } : { phone: digits || raw }
                            })(),
                            aggregatorId: row.aggregatorId,
                            status: row.status
                        }
                    },
                    refetchQueries: [
                        {
                            query: GetAppointmentsBySlotIdDocument,
                            variables: { slotId: slot.id }
                        }
                    ]
                })

                if (result.data && result.data.appointment_BookByReception) {
                    const updatedBookings = bookings.filter(b => b.key !== key)
                    setBookings(updatedBookings)

                    const createdAppointment = result.data.appointment_BookByReception
                    if (createdAppointment.slots && createdAppointment.slots.length > 0) {
                        const currentSlot = createdAppointment.slots.find(s => s.id === slot.id)
                        if (currentSlot) {
                            const newFreePlaces = currentSlot.freePlaces
                            const newOccupiedPlaces = currentSlot.occupiedPlaces
                            setFreePlaces(newFreePlaces)
                            setOccupiedPlaces(newOccupiedPlaces)
                            slot.occupiedPlaces = newOccupiedPlaces
                            onUpdateSlotCapacity?.(slot.id, newFreePlaces)
                        }

                        createdAppointment.slots.forEach(slotData => {
                            if (slotData.id !== slot.id) {
                                const newFreePlaces = slotData.freePlaces
                                onUpdateSlotCapacity?.(slotData.id, newFreePlaces)
                            }
                        })
                    }

                    setEditingKey('')
                    message.success(`Успешно записан клиент ${row.clientPhone}`)
                } else if (result.errors && result.errors.length > 0) {
                    const errorMessage = result.errors[0]?.message || 'Не удалось создать запись'
                    message.error(errorMessage)
                    refetchSlot?.()
                } else {
                    message.error('Не удалось создать запись')
                    refetchSlot?.()
                }
            }
        } catch (errInfo: any) {
            const errors = errInfo.errorFields || []
            if (errors.length) {
                const fields = errors.map((f: any) => f.name[0])
                const fieldNames: Record<string, string> = {
                    clientPhone: clientIdType === 'snils' ? 'СНИЛС' : 'номер телефона',
                    aggregatorId: 'агрегатор',
                    status: 'статус',
                    selectedSlots: 'слоты'
                }
                const notFilled = fields.map((f: any) => fieldNames[f] || f).join(', ')
                message.error(`Заполните: ${notFilled}`)
            } else {
                message.error('Не удалось создать запись')
            }
            refetchSlot?.()
        } finally {
            setCreatingBooking(false)
        }
    }

    const addBooking = () => {
        const newKey = `new-booking-${Date.now()}`
        const newBooking: BookingRow = {
            key: newKey,
            clientPhone: '',
            aggregatorId: '',
            status: '',
            isEditing: true,
            selectedSlots: [slot.id]
        }
        setBookings([newBooking, ...bookings])
        setEditingKey(newKey)
        setCurrentPage(1)
        form.resetFields()
        form.setFieldsValue({
            selectedSlots: [slot.id]
        })
    }

    const handleSetStatus = async (appointmentId: string, status: 'Visited' | 'Cancelled' | 'NotVisited') => {
        setLoadingStatusAppointmentId(appointmentId)
        try {
            let result
            if (status === 'Visited') {
                result = await setVisitedStatus({
                    variables: { appointmentId },
                    refetchQueries: [
                        {
                            query: GetAppointmentsBySlotIdDocument,
                            variables: { slotId: slot.id }
                        }
                    ]
                })
            } else if (status === 'Cancelled') {
                result = await setCancelledStatus({
                    variables: { appointmentId },
                    refetchQueries: [
                        {
                            query: GetAppointmentsBySlotIdDocument,
                            variables: { slotId: slot.id }
                        }
                    ]
                })
            } else if (status === 'NotVisited') {
                result = await setNotVisitedStatus({
                    variables: { appointmentId },
                    refetchQueries: [
                        {
                            query: GetAppointmentsBySlotIdDocument,
                            variables: { slotId: slot.id }
                        }
                    ]
                })
            }

            if (result?.data && !result.errors) {
                const updatedBookings = bookings.map(booking => {
                    if (booking.appointmentId === appointmentId || booking.key === `existing-${appointmentId}`) {
                        return { ...booking, status }
                    }
                    return booking
                })
                setBookings(updatedBookings)

                let updatedSlotData: any = null

                if (status === 'Cancelled' && 'appointment_SetCancelledStatus' in result.data) {
                    updatedSlotData = result.data.appointment_SetCancelledStatus
                } else if (status === 'Visited' && 'appointment_SetVisitedStatus' in result.data) {
                    updatedSlotData = result.data.appointment_SetVisitedStatus
                } else if (status === 'NotVisited' && 'appointment_SetNotVisitedStatus' in result.data) {
                    updatedSlotData = result.data.appointment_SetNotVisitedStatus
                }

                if (updatedSlotData?.slots) {
                    const toNumber = (v: unknown): number => {
                        const n = typeof v === 'number' ? v : parseInt(String(v ?? '0'), 10)
                        return isNaN(n) ? 0 : n
                    }
                    const deriveFree = (s: any): number => {
                        const fp = s?.freePlaces
                        if (fp !== undefined && fp !== null) return toNumber(fp)
                        const cap = toNumber(s?.capacity)
                        const occ = toNumber(s?.occupiedPlaces)
                        const f = cap - occ
                        return f < 0 ? 0 : f
                    }

                    const currentSlot = updatedSlotData.slots.find((s: any) => s.id === slot.id)
                    if (currentSlot) {
                        const newFreePlaces = deriveFree(currentSlot)
                        const newOccupiedPlaces = toNumber(currentSlot?.occupiedPlaces)
                        setFreePlaces(newFreePlaces)
                        setOccupiedPlaces(newOccupiedPlaces)
                        slot.occupiedPlaces = newOccupiedPlaces
                        onUpdateSlotCapacity?.(slot.id, newFreePlaces)
                    }

                    updatedSlotData.slots.forEach((slotData: any) => {
                        if (slotData.id !== slot.id) {
                            const newFreePlaces = deriveFree(slotData)
                            onUpdateSlotCapacity?.(slotData.id, newFreePlaces)
                        }
                    })
                }

                message.success('Статус успешно изменён')
            } else if (result?.errors && result.errors.length > 0) {
                const errorMessage = result.errors[0]?.message || 'Ошибка при смене статуса'
                message.error(errorMessage)
                refetchSlot?.()
            } else {
                message.error('Ошибка при смене статуса')
                refetchSlot?.()
            }
        } catch (e) {
            console.error('Ошибка мутации:', e)
            message.error('Ошибка при смене статуса')
            refetchSlot?.()
        } finally {
            setLoadingStatusAppointmentId(null)
        }
    }

    const getStatusConfirmTitle = (status: 'Visited' | 'Cancelled' | 'NotVisited') => {
        switch (status) {
            case 'Visited':
                return 'Отметить как посещенное?'
            case 'Cancelled':
                return 'Отменить запись?'
            case 'NotVisited':
                return 'Отметить как не посещенное?'
            default:
                return 'Изменить статус?'
        }
    }

    const getStatusConfirmDescription = (status: 'Visited' | 'Cancelled' | 'NotVisited') => {
        switch (status) {
            case 'Visited':
                return 'Клиент посетил занятие'
            case 'Cancelled':
                return 'Запись будет отменена'
            case 'NotVisited':
                return 'Клиент не посетил занятие'
            default:
                return 'Вы уверены, что хотите изменить статус?'
        }
    }

    const startTime = dayjs.utc(slot.dateFrom).format('HH:mm')
    const endTime = dayjs.utc(slot.dateTo).format('HH:mm')
    const date = dayjs.utc(slot.dateFrom).format('DD.MM.YYYY')

    const columns: ColumnsType<BookingRow> = [
        {
            title: 'Клиент',
            dataIndex: 'clientPhone',
            key: 'clientPhone',
            width: 180,
            render: (text: string, record: BookingRow) => {
                if (isEditing(record)) {
                    return (
                        <div className="flex flex-col gap-1">
                            <Segmented
                                size="small"
                                value={clientIdType}
                                onChange={val => setClientIdType(val as 'phone' | 'snils')}
                                options={[
                                    { label: (<span className="flex items-center gap-1"><PhoneOutlined /> Телефон</span>), value: 'phone' },
                                    { label: (<span className="flex items-center gap-1"><IdcardOutlined /> СНИЛС</span>), value: 'snils' }
                                ]}
                            />
                            <Form.Item
                                name="clientPhone"
                                style={{ margin: 0 }}
                                rules={[{ required: true, message: '' }]}
                                validateStatus={
                                    form.isFieldTouched('clientPhone') && form.getFieldError('clientPhone').length
                                        ? 'error'
                                        : ''
                                }
                                help={form.isFieldTouched('clientPhone') ? form.getFieldError('clientPhone')[0] : ''}
                            >
                                <Input
                                    placeholder={clientIdType === 'snils' ? 'XXX-XXX-XXX XX' : '7XXXXXXXXXX'}
                                    style={{ width: '100%' }}
                                    size="small"
                                    onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (e.key === 'Enter') {
                                            const row = bookings.find(b => b.isEditing)
                                            if (row) {
                                                try {
                                                    await form.validateFields()
                                                    save(row.key)
                                                } catch (errInfo: any) {
                                                    const errors = errInfo.errorFields || []
                                                    if (errors.length) {
                                                        const fields = errors.map((f: any) => f.name[0])
                                                        const fieldNames: Record<string, string> = {
                                                            clientPhone: clientIdType === 'snils' ? 'СНИЛС' : 'номер телефона',
                                                            aggregatorId: 'агрегатор',
                                                            status: 'статус',
                                                            selectedSlots: 'слоты'
                                                        }
                                                        const notFilled = fields
                                                            .map((f: any) => fieldNames[f] || f)
                                                            .join(', ')
                                                        message.error(`Заполните: ${notFilled}`)
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        form.validateFields(['clientPhone'])
                                    }}
                                />
                            </Form.Item>
                        </div>
                    )
                }
                const phoneVal = record.clientPhoneValue || ''
                const snilsVal = record.clientSnilsValue || ''
                if (!phoneVal && !snilsVal) return <span>-</span>
                return (
                    <div className="flex flex-col gap-0.5">
                        {phoneVal && (
                            <div className="flex items-center gap-6">
                                <PhoneOutlined style={{ color: '#52c41a' }} />
                                <span>{phoneVal}</span>
                            </div>
                        )}
                        {snilsVal && (
                            <div className="flex items-center gap-6">
                                <IdcardOutlined style={{ color: '#1677ff' }} />
                                <span>{snilsVal}</span>
                            </div>
                        )}
                    </div>
                )
            }
        },
        {
            title: 'Агрегатор',
            dataIndex: 'aggregatorId',
            key: 'aggregatorId',
            width: 200,
            render: (value: string, record: any) => {
                if (isEditing(record)) {
                    return (
                        <Form.Item name="aggregatorId" style={{ margin: 0 }} rules={[{ required: true, message: '' }]}>
                            <Select
                                placeholder="Выберите агрегатора"
                                showSearch
                                style={{ width: '100%' }}
                                size="small"
                                filterOption={(input: string, option: any) =>
                                    option?.label?.toLowerCase().includes(input.toLowerCase()) || false
                                }
                                options={aggregators.map(agg => ({
                                    label: agg.name,
                                    value: agg.id
                                }))}
                            />
                        </Form.Item>
                    )
                }
                const aggregator = aggregators.find(agg => agg.id === value)
                return <span>{aggregator?.name || '-'}</span>
            }
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (value: string, record: any) => {
                if (isEditing(record)) {
                    return (
                        <Form.Item name="status" style={{ margin: 0 }} rules={[{ required: true, message: '' }]}>
                            <Select
                                placeholder="Выберите статус"
                                style={{ width: '100%' }}
                                size="small"
                                options={[
                                    { label: 'Забронировано', value: 'Booked' },
                                    { label: 'Посещено', value: 'Visited' }
                                ]}
                            />
                        </Form.Item>
                    )
                }
                const statusConfig = {
                    Reserved: { text: 'Зарезервировано', color: 'blue' },
                    Booked: { text: 'Забронировано', color: 'processing' },
                    PaymentTimeout: { text: 'Таймаут оплаты', color: 'warning' },
                    Cancelled: { text: 'Отменено', color: 'error' },
                    Paid: { text: 'Оплачено', color: 'success' },
                    NotVisited: { text: 'Не посещено', color: 'default' },
                    Visited: { text: 'Посещено', color: 'success' }
                }
                const config = statusConfig[value as keyof typeof statusConfig]
                return config ? (
                    <Tag color={config.color} style={{ fontSize: '11px' }}>
                        {config.text}
                    </Tag>
                ) : (
                    <span>-</span>
                )
            }
        },
        {
            title: 'Слоты',
            dataIndex: 'slots',
            key: 'slots',
            width: 180,
            render: (value: any[], record: any) => {
                if (isEditing(record)) {
                    const currentSlotDate = dayjs(slot.dateFrom).format('YYYY-MM-DD')
                    const mainSlotTime = `${startTime} - ${endTime}`
                    const mainSlotFreePlaces = slot.capacity - slot.occupiedPlaces

                    const additionalSlots = slot.allDaySlots
                        .filter(event => {
                            const eventDate = dayjs(event.start).format('YYYY-MM-DD')
                            const hasFreePlaces = event.extendedProps?.freePlaces > 0
                            const sameRoom = event.resourceId === slot.resourceId
                            return eventDate === currentSlotDate && event.id !== slot.id && hasFreePlaces && sameRoom
                        })
                        .map(event => {
                            const eventStart = dayjs(event.start).format('HH:mm')
                            const eventEnd = dayjs(event.end).format('HH:mm')
                            const freePlaces = event.extendedProps?.freePlaces || 0
                            return {
                                label: `${eventStart} - ${eventEnd} (${freePlaces} мест)`,
                                value: event.id
                            }
                        })

                    const allSlots = [
                        {
                            label: `${mainSlotTime}`,
                            value: slot.id,
                            disabled: true
                        },
                        ...additionalSlots
                    ]

                    return (
                        <Form.Item name="selectedSlots" style={{ margin: 0 }}>
                            <Select
                                mode="multiple"
                                placeholder="Выберите дополнительные слоты"
                                style={{ width: '100%' }}
                                size="small"
                                options={getAvailableSlots()}
                                open={selectOpen}
                                onDropdownVisibleChange={setSelectOpen}
                                maxTagCount="responsive"
                                maxTagPlaceholder={omittedValues => (
                                    <SlotTooltip omittedValues={omittedValues as any} getSlotWord={getSlotWord} />
                                )}
                                dropdownStyle={{
                                    maxHeight: 280,
                                    minWidth: 250,
                                    fontSize: 13,
                                    borderRadius: 8,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                                }}
                                tagRender={({ label, value, closable, onClose }) => {
                                    const isMainSlot = value === slot.id
                                    return (
                                        <Tag
                                            style={{
                                                margin: '2px 4px 2px 0',
                                                borderRadius: 12,
                                                fontSize: 11,
                                                padding: isMainSlot ? '2px 12px' : '2px 8px',
                                                background: isMainSlot
                                                    ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
                                                    : 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                                                border: 'none',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                height: 20,
                                                maxWidth: isMainSlot ? 140 : 120,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                transition: 'all 0.2s ease'
                                            }}
                                            closable={closable && !isMainSlot}
                                            onClose={onClose}
                                            icon={
                                                isMainSlot ? (
                                                    <ClockCircleOutlined style={{ fontSize: 10 }} />
                                                ) : undefined
                                            }
                                        >
                                            <span
                                                style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {label}
                                            </span>
                                        </Tag>
                                    )
                                }}
                                dropdownRender={menu => (
                                    <div>
                                        <div
                                            style={{
                                                padding: '8px 12px',
                                                borderBottom: '1px solid #f0f0f0',
                                                fontSize: 12,
                                                color: '#666',
                                                background: '#fafafa'
                                            }}
                                        >
                                            <ClockCircleOutlined style={{ marginRight: 6 }} />
                                            Доступные слоты на {date}
                                        </div>
                                        {menu}
                                        <div
                                            style={{
                                                padding: '8px 12px',
                                                borderTop: '1px solid #f0f0f0',
                                                fontSize: 11,
                                                color: '#999',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Выберите дополнительные слоты для бронирования
                                        </div>
                                    </div>
                                )}
                                optionRender={option => {
                                    const isMainSlot = (option.data as any)?.disabled
                                    const labelText = option.label as string
                                    const match = labelText.match(/\((\d+) мест\)/)
                                    const places = match ? match[1] : ''
                                    const timeText = labelText.replace(/\s*\(\d+ мест\)/, '')
                                    return (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '4px 0'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <ClockCircleOutlined
                                                    style={{
                                                        marginRight: 8,
                                                        color: '#1890ff',
                                                        fontSize: 12
                                                    }}
                                                />
                                                <span>{timeText}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                {places && (
                                                    <Tag
                                                        color={isMainSlot ? 'red' : 'green'}
                                                        style={{ fontSize: 10, marginRight: 0 }}
                                                    >
                                                        {places} мест
                                                    </Tag>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }}
                                showSearch
                                filterOption={(input: string, option: any) =>
                                    option?.label?.toLowerCase().includes(input.toLowerCase()) || false
                                }
                                notFoundContent={
                                    <div
                                        style={{
                                            padding: '16px',
                                            textAlign: 'center',
                                            color: '#999',
                                            fontSize: 12
                                        }}
                                    >
                                        <ClockCircleOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                                        <div>Слоты не найдены</div>
                                    </div>
                                }
                                suffixIcon={
                                    <Tooltip title="Выберите дополнительные слоты">
                                        <ClockCircleOutlined
                                            style={{ color: '#1890ff', cursor: 'pointer' }}
                                            onClick={e => {
                                                e.stopPropagation()
                                                const currentSelected = form.getFieldValue('selectedSlots') || [slot.id]
                                                setSelectedSlotsInModal(currentSelected)
                                                setIsSlotsSelectionModalOpen(true)
                                            }}
                                        />
                                    </Tooltip>
                                }
                            />
                        </Form.Item>
                    )
                }

                if (!value || value.length === 0) {
                    return <span>-</span>
                }

                const slotTimes = value.map(slotData => {
                    if (slotData.id === slot.id) {
                        return `${startTime}-${endTime}`
                    }
                    const slotStart = dayjs(slotData.dateFrom).format('HH:mm')
                    const slotEnd = dayjs(slotData.dateTo).format('HH:mm')
                    return `${slotStart}-${slotEnd}`
                })

                const tooltipContent =
                    slotTimes.length > 1 ? (
                        <div className="p-2 text-xxl">
                            <div className=" font-medium mb-1">Все слоты:</div>
                            <div className="space-y-1">
                                {slotTimes.map((time, index) => (
                                    <div key={index} className=" flex items-center gap-2">
                                        <ClockCircleOutlined className="text-blue-400" />
                                        <span>{time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null

                return (
                    <Tooltip
                        title={tooltipContent}
                        placement="top"
                        overlayStyle={{ maxWidth: '300px' }}
                        overlayClassName="slots-tooltip"
                        mouseEnterDelay={0.3}
                        open={slotTimes.length > 1 ? undefined : false}
                    >
                        <div className={slotTimes.length > 1 ? 'cursor-pointer' : ''} style={{ width: 'fit-content' }}>
                            <Space wrap size="small">
                                {/* Всегда показываем время текущего слота в модалке */}
                                <Tag color="blue" icon={<ClockCircleOutlined />} style={{ fontSize: '13px' }}>
                                    {`${startTime}-${endTime}`}
                                </Tag>
                                {slotTimes.length > 1 && (
                                    <Tag color="default" style={{ fontSize: '13px' }}>
                                        +{slotTimes.length - 1}
                                    </Tag>
                                )}
                            </Space>
                        </div>
                    </Tooltip>
                )
            }
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 150,
            render: (_: any, record: any) => {
                if (isEditing(record)) {
                    return (
                        <Space>
                            <Button
                                type="text"
                                size="small"
                                icon={<CheckOutlined />}
                                onClick={() => save(record.key)}
                                loading={creatingBooking}
                                className="!text-green-600 hover:!bg-green-50 dark:hover:!bg-green-900/20 transition-all duration-200 hover:scale-110"
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<CloseOutlined />}
                                onClick={cancel}
                                className="!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-all duration-200 hover:scale-110"
                            />
                        </Space>
                    )
                }

                if (record.isEditing) return null

                const appointmentId = record.key.startsWith('existing-')
                    ? record.key.replace('existing-', '')
                    : record.appointmentId

                if (!appointmentId) return null

                const currentStatus = record.status

                return (
                    <div style={{ width: '280px', display: 'flex', gap: '4px' }}>
                        <Popconfirm
                            title={getStatusConfirmTitle('Visited')}
                            description={getStatusConfirmDescription('Visited')}
                            onConfirm={() => handleSetStatus(appointmentId, 'Visited')}
                            okText="Да"
                            cancelText="Нет"
                            okButtonProps={{ type: 'primary' }}
                        >
                            <Button
                                size="small"
                                loading={loadingStatusAppointmentId === appointmentId}
                                disabled={currentStatus === 'Visited' || loadingStatusAppointmentId === appointmentId}
                                className={`transition-all duration-200 hover:scale-105 text-xs ${
                                    currentStatus === 'Visited' ? '!bg-gray-100 !text-gray-400' : ''
                                }`}
                                style={{ width: '70px', minWidth: '70px' }}
                            >
                                Пришел
                            </Button>
                        </Popconfirm>

                        <Popconfirm
                            title={getStatusConfirmTitle('NotVisited')}
                            description={getStatusConfirmDescription('NotVisited')}
                            onConfirm={() => handleSetStatus(appointmentId, 'NotVisited')}
                            okText="Да"
                            cancelText="Нет"
                            okButtonProps={{ type: 'primary' }}
                        >
                            <Button
                                size="small"
                                loading={loadingStatusAppointmentId === appointmentId}
                                disabled={
                                    currentStatus === 'NotVisited' || loadingStatusAppointmentId === appointmentId
                                }
                                className={`transition-all duration-200 hover:scale-105 text-xs ${
                                    currentStatus === 'NotVisited' ? '!bg-gray-100 !text-gray-400' : ''
                                }`}
                                style={{ width: '85px', minWidth: '85px' }}
                            >
                                Не пришел
                            </Button>
                        </Popconfirm>
                        <Popconfirm
                            title={getStatusConfirmTitle('Cancelled')}
                            description={getStatusConfirmDescription('Cancelled')}
                            onConfirm={() => handleSetStatus(appointmentId, 'Cancelled')}
                            okText="Да"
                            cancelText="Нет"
                            okButtonProps={{ danger: true }}
                        >
                            <Button
                                size="small"
                                danger
                                loading={loadingStatusAppointmentId === appointmentId}
                                disabled={currentStatus === 'Cancelled' || loadingStatusAppointmentId === appointmentId}
                                className={`transition-all duration-200 hover:scale-105 text-xs ${
                                    currentStatus === 'Cancelled' ? '!bg-gray-100 !text-gray-400' : ''
                                }`}
                                style={{ width: '70px', minWidth: '70px' }}
                            >
                                Отменить
                            </Button>
                        </Popconfirm>
                    </div>
                )
            }
        }
    ]

    const getAvailableSlots = () => {
        const currentSlotDate = dayjs(slot.dateFrom).format('YYYY-MM-DD')
        const mainSlotTime = `${startTime} - ${endTime}`

        const mainSlotEvent = slot.allDaySlots.find(event => event.id === slot.id)
        const mainSlotFreePlaces = mainSlotEvent?.extendedProps?.freePlaces || slot.capacity - slot.occupiedPlaces

        const additionalSlots = slot.allDaySlots
            .filter(event => {
                const eventDate = dayjs(event.start).format('YYYY-MM-DD')
                const hasFreePlaces = event.extendedProps?.freePlaces > 0
                const sameRoom = event.resourceId === slot.resourceId
                return eventDate === currentSlotDate && event.id !== slot.id && hasFreePlaces && sameRoom
            })
            .map(event => {
                const eventStart = dayjs(event.start).format('HH:mm')
                const eventEnd = dayjs(event.end).format('HH:mm')
                const freePlaces = event.extendedProps?.freePlaces || 0
                return {
                    label: `${eventStart} - ${eventEnd} (${freePlaces} мест)`,
                    value: event.id
                }
            })

        return [
            {
                label: `${mainSlotTime} (${mainSlotFreePlaces} мест)`,
                value: slot.id,
                disabled: true
            },
            ...additionalSlots
        ]
    }

    const getSlotWord = (count: number) => {
        if (count === 1) return 'слот'
        if (count >= 2 && count <= 4) return 'слота'
        return 'слотов'
    }

    return (
        <div className="flex flex-col gap-2">
            {/* Статистика и прогресс */}
            <Row gutter={[8, 8]}>
                <Col xs={24} sm={24}>
                    <Card size="small" hoverable className="text-center transition-all duration-300 hover:shadow-lg">
                        <Statistic
                            title={<span className="text-xs sm:text-sm md:text-base font-medium">Свободных мест</span>}
                            value={freePlaces}
                            valueStyle={{
                                color: token.colorSuccess,
                                fontSize: '16px sm:20px md:28px',
                                fontWeight: 'bold'
                            }}
                            prefix={<TeamOutlined className="text-sm sm:text-base md:text-lg" />}
                        />
                    </Card>
                </Col>
            </Row>

            <Divider style={{ margin: '8px 0' }} />

            {/* Панель фильтров */}
            <Card size="small" style={{ marginBottom: '8px' }}>
                <Row gutter={[16, 8]} align="middle">
                    <Col xs={24} sm={16}>
                        <Input
                            placeholder="Поиск по телефону/СНИЛС или агрегатору..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            allowClear
                            size="middle"
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <Select
                            placeholder="Фильтр по статусу"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                            size="middle"
                            options={[
                                { label: `Все записи (${statusStats.all})`, value: 'all' },
                                { label: `Забронировано (${statusStats.Booked})`, value: 'Booked' },
                                { label: `Посещено (${statusStats.Visited})`, value: 'Visited' },
                                { label: `Не пришел (${statusStats.NotVisited})`, value: 'NotVisited' },
                                { label: `Отменено (${statusStats.Cancelled})`, value: 'Cancelled' }
                            ]}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Заголовок таблицы с кнопкой */}
            <Card size="small" style={{ padding: '8px 16px' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Text strong className="text-base whitespace-nowrap">
                                Записи на занятие
                            </Text>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            <Tag color="blue" icon={<CalendarOutlined />} className="text-xs">
                                {date}
                            </Tag>
                            <Tag color="green" icon={<ClockCircleOutlined />} className="text-xs">
                                {startTime}-{endTime}
                            </Tag>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={addBooking}
                        loading={creatingBooking}
                        disabled={editingKey !== '' || freePlaces <= 0 || creatingBooking}
                        className={
                            freePlaces <= 0
                                ? '!bg-gray-300 !text-gray-500 !border-gray-300 dark:!bg-gray-700 dark:!text-gray-400 dark:!border-gray-700'
                                : 'hover:scale-105 transition-transform'
                        }
                        size="small"
                        style={{
                            boxShadow: freePlaces > 0 ? '0 4px 12px rgba(24, 144, 255, 0.3)' : 'none'
                        }}
                    >
                        Записать
                    </Button>
                </div>
            </Card>

            {/* Таблица */}
            <Card size="small" style={{ padding: '8px', position: 'relative' }}>
                {(creatingBooking || loadingStatusAppointmentId) && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                                token.colorBgContainer.includes('255') || token.colorBgContainer.includes('250')
                                    ? 'rgba(255, 255, 255, 0.8)'
                                    : 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            borderRadius: '6px'
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <Spin size="large" />
                            <div style={{ marginTop: 8, color: token.colorTextSecondary }}>
                                {creatingBooking ? 'Создание записи...' : 'Обновление статуса...'}
                            </div>
                        </div>
                    </div>
                )}
                <Form form={form} component={false}>
                    <DataTable
                        data={filteredBookings}
                        columns={columns}
                        rowKey="key"
                        size="small"
                        pagination={{
                            current: currentPage,
                            pageSize: 6,
                            showSizeChanger: false,
                            showQuickJumper: false,
                            showTotal: (total: number, range: [number, number]) =>
                                `${range[0]}-${range[1]} из ${total}`,
                            onChange: page => setCurrentPage(page),
                            size: 'small'
                        }}
                        locale={{
                            emptyText: (
                                <div className="text-center py-4">
                                    <div className="text-gray-400 mb-1">
                                        {searchText || statusFilter !== 'all' ? '🔍' : '📋'}
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        {searchText || statusFilter !== 'all' ? 'Записи не найдены' : 'Нет записей'}
                                    </div>
                                    {(searchText || statusFilter !== 'all') && (
                                        <Button
                                            size="small"
                                            type="link"
                                            onClick={() => {
                                                setSearchText('')
                                                setStatusFilter('all')
                                            }}
                                        >
                                            Очистить фильтры
                                        </Button>
                                    )}
                                </div>
                            )
                        }}
                    />
                </Form>
            </Card>

            <SlotsSelectionModal
                visible={isSlotsSelectionModalOpen}
                onClose={() => setIsSlotsSelectionModalOpen(false)}
                slots={getAvailableSlots()}
                selectedSlots={selectedSlotsInModal}
                onSlotsChange={slots => {
                    setSelectedSlotsInModal(slots)
                    form.setFieldsValue({ selectedSlots: slots })
                }}
                date={slot.dateFrom}
            />
        </div>
    )
}
