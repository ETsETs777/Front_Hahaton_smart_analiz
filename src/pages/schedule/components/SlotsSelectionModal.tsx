import { Modal, Card, Row, Col, Tag, Button, Input, Space, Typography, theme } from 'antd'
import { ClockCircleOutlined, SearchOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useState, useMemo, useEffect } from 'react'
import dayjs from 'dayjs'

const { Text, Title } = Typography

interface SlotOption {
    label: string
    value: string
    disabled?: boolean
}

interface SlotsSelectionModalProps {
    visible: boolean
    onClose: () => void
    slots: SlotOption[]
    selectedSlots: string[]
    onSlotsChange: (slots: string[]) => void
    date: string
}

export function SlotsSelectionModal({
    visible,
    onClose,
    slots,
    selectedSlots,
    onSlotsChange,
    date
}: SlotsSelectionModalProps) {
    const { token } = theme.useToken()
    const [searchText, setSearchText] = useState('')
    const [tempSelectedSlots, setTempSelectedSlots] = useState<string[]>(selectedSlots)

    // Синхронизируем временное состояние при изменении props
    useEffect(() => {
        setTempSelectedSlots(selectedSlots)
    }, [selectedSlots])

    const getSlotInfo = (label: string) => {
        const match = label.match(/\((\d+) мест\)/)
        const places = match ? match[1] : ''
        const timeText = label.replace(/\s*\(\d+ мест\)/, '')
        return { timeText, places }
    }

    const filteredSlots = useMemo(() => {
        if (!searchText) return slots
        return slots.filter(slot => {
            const { timeText } = getSlotInfo(slot.label)
            return timeText.toLowerCase().includes(searchText.toLowerCase())
        })
    }, [slots, searchText])

    const handleSlotToggle = (slotValue: string) => {
        const isSelected = tempSelectedSlots.includes(slotValue)
        if (isSelected) {
            const newSlots = tempSelectedSlots.filter(s => s !== slotValue)
            setTempSelectedSlots(newSlots)
        } else {
            const newSlots = [...tempSelectedSlots, slotValue]
            setTempSelectedSlots(newSlots)
        }
    }

    const handleSelectAll = () => {
        const allSlots = slots.map(slot => slot.value)
        setTempSelectedSlots(allSlots)
    }

    const handleClearAll = () => {
        const mainSlot = slots.find(slot => slot.disabled)
        setTempSelectedSlots(mainSlot ? [mainSlot.value] : [])
    }

    const handleCancel = () => {
        setTempSelectedSlots(selectedSlots) // Возвращаем исходное состояние
        onClose()
    }

    const handleConfirm = () => {
        onSlotsChange(tempSelectedSlots) // Применяем изменения
        onClose()
    }

    return (
        <Modal
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={800}
            style={{ top: 50 }}
            styles={{
                header: { borderBottom: `1px solid ${token.colorBorder}` }
            }}
        >
            <div style={{ marginBottom: 16 }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginRight: 20,
                        padding: '12px 16px',
                        background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorBgContainer} 100%)`,
                        borderRadius: 8,
                        border: `1px solid ${token.colorBorder}`
                    }}
                >
                    <ClockCircleOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
                    <div>
                        <Text strong style={{ fontSize: 14, color: token.colorText }}>
                            {dayjs(date).format('dddd, DD MMMM YYYY')}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Выберите дополнительные слоты для бронирования
                        </Text>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Поиск слотов..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                />
            </div>

            <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8 }}>
                    <Space>
                        <Button size="small" onClick={handleSelectAll} type="primary">
                            Выбрать все
                        </Button>
                        <Button size="small" onClick={handleClearAll}>
                            Очистить
                        </Button>
                    </Space>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Выбрано: {tempSelectedSlots.length} из {slots.length}
                </Text>
            </div>

            <Row gutter={[12, 12]}>
                {filteredSlots.map(slot => {
                    const { timeText, places } = getSlotInfo(slot.label)
                    const isSelected = tempSelectedSlots.includes(slot.value)
                    const isMainSlot = slot.disabled

                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={slot.value}>
                            <Card
                                hoverable
                                size="small"
                                style={{
                                    cursor: isMainSlot ? 'not-allowed' : 'pointer',
                                    opacity: isMainSlot ? 0.6 : 1,
                                    border: isSelected
                                        ? `2px solid ${token.colorPrimary}`
                                        : `1px solid ${token.colorBorder}`,
                                    background: isSelected ? `${token.colorPrimaryBg}` : token.colorBgContainer,
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => !isMainSlot && handleSlotToggle(slot.value)}
                                bodyStyle={{ padding: '12px' }}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            marginBottom: 8,
                                            color: isMainSlot ? token.colorTextSecondary : token.colorText
                                        }}
                                    >
                                        {timeText}
                                    </div>

                                    <div style={{ marginBottom: 8 }}>
                                        {places && (
                                            <Tag color="green" style={{ fontSize: 10 }}>
                                                {places} мест
                                            </Tag>
                                        )}
                                        {isMainSlot && (
                                            <Tag color="red" style={{ fontSize: 10 }}>
                                                Текущий
                                            </Tag>
                                        )}
                                    </div>

                                    {isSelected && !isMainSlot && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                background: token.colorPrimary,
                                                borderRadius: '50%',
                                                width: 20,
                                                height: 20,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <CheckOutlined
                                                style={{
                                                    color: 'white',
                                                    fontSize: 12
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    )
                })}
            </Row>

            {filteredSlots.length === 0 && (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: token.colorTextSecondary
                    }}
                >
                    <ClockCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                    <div>Слоты не найдены</div>
                </div>
            )}

            <div
                style={{
                    marginTop: 24,
                    paddingTop: 16,
                    borderTop: `1px solid ${token.colorBorder}`,
                    textAlign: 'right'
                }}
            >
                <Space>
                    <Button onClick={handleCancel}>Отмена</Button>
                    <Button type="primary" onClick={handleConfirm}>
                        Готово
                    </Button>
                </Space>
            </div>
        </Modal>
    )
}
