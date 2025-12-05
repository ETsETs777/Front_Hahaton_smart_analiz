import { Tooltip } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { theme } from 'antd'
import React from 'react'
import './SlotTooltip.module.scss'

type OmittedValue = { label?: string } | string

interface SlotTooltipProps {
    omittedValues: OmittedValue[]
    getSlotWord: (count: number) => string
}

export const SlotTooltip: React.FC<SlotTooltipProps> = ({ omittedValues, getSlotWord }) => {
    theme.useToken()
    return (
        <Tooltip
            title={
                <div className="slot-tooltip-list">
                    {omittedValues.map((v, idx) => {
                        const labelText = typeof v === 'string' ? v : String(v?.label ?? '')
                        const timeText = labelText.replace(/\s*\(\d+ мест\)/, '')
                        return (
                            <div className="slot-tooltip-item" key={idx}>
                                <div className="slot-tooltip-time flex items-center gap-2">
                                    <ClockCircleOutlined className="slot-tooltip-icon" />
                                    <span className="slot-tooltip-text">{timeText}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            overlayClassName="slot-tooltip-overlay"
        >
            <span className="slot-tooltip-trigger">
                {omittedValues.length} {getSlotWord(omittedValues.length)}
            </span>
        </Tooltip>
    )
}
