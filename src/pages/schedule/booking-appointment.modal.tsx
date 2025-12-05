import { useGetAllAggregatorsQuery, useBookAppointmentByReceptionMutation } from '@/graphql/generated'
import { Button, Form, Input, message, Select, theme } from 'antd'
import { Calendar, Clock, User, Phone } from 'lucide-react'
import { useState } from 'react'
import { BaseModal } from '@/pages/aggregators/modals/components'
import dayjs from 'dayjs'

interface BookingModalProps {
    visible: boolean
    onClose: () => void
    slot: any
    roomTitle: string
    complexTitle: string
    form: any
}

export const BookingAppointmentModal = ({
    visible,
    onClose,
    slot,
    roomTitle,
    complexTitle,
    form
}: BookingModalProps) => {
    const { token } = theme.useToken()
    const [loading, setLoading] = useState(false)

    const { data: aggregatorsData } = useGetAllAggregatorsQuery()
    const [createBooking] = useBookAppointmentByReceptionMutation()

    const aggregators = aggregatorsData?.aggregator_GetAll || []

    const handleBooking = async (values: any) => {
        setLoading(true)
        try {
            const result = await createBooking({
                variables: {
                    input: {
                        slotIds: [slot.resourceId],
                        client: (() => {
                            const raw = String(values.clientPhone || '')
                            const digits = raw.replace(/[^0-9]/g, '')
                            const looksLikeSnils = /^(\d{3}-\d{3}-\d{3}\s?\d{2}|\d{11})$/.test(raw) && !raw.startsWith('+')
                            if (looksLikeSnils) return { snils: digits }
                            return { phone: digits || raw }
                        })(),
                        aggregatorId: values.aggregatorId,
                        status: values.bookingStatus
                    }
                }
            })

            if (result.data) {
                message.success('Бронирование создано успешно')
                onClose()
                form.resetFields()
            }
        } catch (error) {
            message.error('Ошибка при создании бронирования')
        } finally {
            setLoading(false)
        }
    }

    if (!slot) {
        return null
    }

    const startTime = dayjs(slot.start).format('HH:mm')
    const endTime = dayjs(slot.end).format('HH:mm')
    const date = dayjs(slot.start).format('DD.MM.YYYY')

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            title="Запись на занятие"
            subtitle={`${complexTitle} • ${roomTitle} • ${date} ${startTime}-${endTime}`}
            icon={<Calendar size={16} />}
            actions={
                <Button
                    type="primary"
                    onClick={() => form.submit()}
                    loading={loading}
                    style={{
                        borderRadius: token.borderRadius,
                        background: token.colorSuccess,
                        borderColor: token.colorSuccess
                    }}
                >
                    Записать
                </Button>
            }
        >
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        className="flex items-center gap-3 p-4 rounded-lg"
                        style={{ background: token.colorBgContainer }}
                    >
                        <Calendar size={20} style={{ color: token.colorPrimary }} />
                        <div>
                            <div className="font-medium">Дата и время</div>
                            <div className="text-sm" style={{ color: token.colorTextSecondary }}>
                                {date} {startTime}-{endTime}
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex items-center gap-3 p-4 rounded-lg"
                        style={{ background: token.colorBgContainer }}
                    >
                        <Clock size={20} style={{ color: token.colorInfo }} />
                        <div>
                            <div className="font-medium">Свободных мест</div>
                            <div className="text-sm" style={{ color: token.colorTextSecondary }}>
                                {slot.extendedProps.freePlaces}
                            </div>
                        </div>
                    </div>
                </div>

                <Form form={form} layout="vertical" onFinish={handleBooking} className="flex-1">
                    <Form.Item
                        name="clientName"
                        label={
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span>Имя клиента</span>
                            </div>
                        }
                        rules={[{ required: true, message: 'Введите имя клиента' }]}
                    >
                        <Input placeholder="Введите имя клиента" />
                    </Form.Item>

                    <Form.Item
                        name="clientPhone"
                        label={
                            <div className="flex items-center gap-2">
                                <Phone size={16} />
                                <span>Телефон или СНИЛС</span>
                            </div>
                        }
                        rules={[{ required: true, message: 'Введите телефон или СНИЛС' }]}
                    >
                        <Input placeholder="7XXXXXXXXXX или XXX-XXX-XXX XX" />
                    </Form.Item>

                    <Form.Item
                        name="aggregatorId"
                        label="Агрегатор"
                        rules={[{ required: true, message: 'Выберите агрегатора' }]}
                    >
                        <Select
                            placeholder="Выберите агрегатора"
                            showSearch
                            filterOption={(input, option) =>
                                option?.label?.toLowerCase().includes(input.toLowerCase()) || false
                            }
                            options={aggregators.map(agg => ({
                                label: agg.name,
                                value: agg.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="bookingStatus"
                        label="Статус бронирования"
                        rules={[{ required: true, message: 'Выберите статус бронирования' }]}
                    >
                        <Select
                            placeholder="Выберите статус бронирования"
                            options={[
                                { label: 'Зарезервировано', value: 'Reserved' },
                                { label: 'Забронировано', value: 'Booked' },
                                { label: 'Таймаут оплаты', value: 'PaymentTimeout' },
                                { label: 'Отменено', value: 'Cancelled' },
                                { label: 'Оплачено', value: 'Paid' },
                                { label: 'Не посещено', value: 'NotVisited' },
                                { label: 'Посещено', value: 'Visited' }
                            ]}
                        />
                    </Form.Item>
                </Form>
            </div>
        </BaseModal>
    )
}
