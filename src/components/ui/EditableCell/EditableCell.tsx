import { App, Button, Input, theme } from 'antd'
import { Check, Edit2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface EditableCellProps {
    value: string
    onSave: (value: string) => Promise<void> | void
    onCancel?: () => void
    placeholder?: string
    icon?: React.ReactNode
    className?: string
    inputType?: 'text' | 'textarea'
    maxLength?: number
    disabled?: boolean
}

export function EditableCell({
    value,
    onSave,
    onCancel,
    placeholder = 'Введите значение',
    icon,
    className = '',
    inputType = 'text',
    maxLength,
    disabled = false
}: EditableCellProps) {
    const { token } = theme.useToken()
    const { modal } = App.useApp()
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)
    const [isSaving, setIsSaving] = useState(false)

    // Синхронизируем значение при изменении пропса
    useEffect(() => {
        setEditValue(value)
    }, [value])

    // Обработчик клика вне компонента
    useEffect(() => {
        if (!isEditing) return

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const isClickOnInput = target.closest('input') || target.closest('textarea')
            const isClickOnButton = target.closest('button')
            const isClickOnEditingCell = target.closest('[data-editing="true"]')
            const isModalOpen = !!document.querySelector('.ant-modal-root .ant-modal')

            if (!isClickOnInput && !isClickOnButton && !isClickOnEditingCell) {
                if (isModalOpen) {
                    handleCancel()
                } else {
                    handleCancelWithConfirm()
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isEditing, editValue, value])

    const startEdit = () => {
        if (disabled) return
        setIsEditing(true)
        setEditValue(value)
    }

    const handleSave = async () => {
        if (editValue.trim() === value) {
            setIsEditing(false)
            return
        }

        setIsSaving(true)
        try {
            await onSave(editValue.trim())
            setIsEditing(false)
        } catch (error) {
            // Ошибка обрабатывается в onSave
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setEditValue(value)
        setIsEditing(false)
        onCancel?.()
    }

    const handleCancelWithConfirm = () => {
        const hasChanges = editValue.trim() !== value.trim()

        if (hasChanges) {
            modal.confirm({
                title: 'Сохранить изменения?',
                content: 'Вы внесли изменения в поле. Хотите сохранить их?',
                okText: 'Сохранить',
                cancelText: 'Отменить',
                onOk: async () => {
                    await handleSave()
                },
                onCancel: () => {
                    handleCancel()
                }
            })
        } else {
            handleCancel()
        }
    }

    const handleSaveWithConfirm = () => {
        const hasChanges = editValue.trim() !== value.trim()
        if (hasChanges) {
            modal.confirm({
                title: 'Сохранить изменения?',
                content: 'Вы внесли изменения в поле. Хотите сохранить их?',
                okText: 'Сохранить',
                cancelText: 'Отменить',
                onOk: async () => {
                    await handleSave()
                },
                onCancel: () => {}
            })
        } else {
            setIsEditing(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSaveWithConfirm()
        } else if (e.key === 'Escape') {
            handleCancel()
        }
    }

    return (
        <>
            {isEditing ? (
                <div className={`relative w-full ${className}`} data-editing="true">
                    <Input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        size="small"
                        className="!rounded-md !py-1 !px-2 !text-sm w-full pr-16"
                        variant="filled"
                        maxLength={maxLength}
                        disabled={isSaving}
                        autoComplete="off"
                        autoFocus
                    />
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <Button
                            type="text"
                            size="small"
                            icon={<Check size={16} />}
                            onClick={handleSave}
                            loading={isSaving}
                            className="!text-green-600 hover:!bg-green-50 dark:hover:!bg-green-900/20 !h-6 !w-6 !p-0"
                        />
                        <Button
                            type="text"
                            size="small"
                            icon={<X size={16} />}
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/20 !h-6 !w-6 !p-0"
                        />
                    </div>
                </div>
            ) : (
                <div
                    className={`cursor-pointer px-2 py-1 rounded flex items-center justify-between group min-h-[32px] transition-colors w-full ${className}`}
                    style={{
                        color: token.colorText,
                        backgroundColor: 'transparent'
                    }}
                    onMouseEnter={e => {
                        if (!disabled) {
                            e.currentTarget.style.backgroundColor = token.colorBgTextHover
                        }
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                    onClick={startEdit}
                    data-clickable="true"
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {icon}
                        <span className="truncate">{value || '-'}</span>
                    </div>
                    {!disabled && (
                        <Edit2
                            className="opacity-0 group-hover:opacity-100 ml-2 transition-opacity shrink-0"
                            style={{ color: token.colorTextSecondary }}
                            size={16}
                        />
                    )}
                </div>
            )}
        </>
    )
}
