import { App, Button, Form, Input, Space, theme } from 'antd'
import { useEffect } from 'react'
import type { GetAllSportComplexesForAdminQuery } from '@/graphql/generated'
import { useUpdateSportComplexIasMutation } from '@/graphql/generated'
import { Building2, Check } from 'lucide-react'
import { BaseModal } from '../../aggregators/modals/components'

type SportComplex = GetAllSportComplexesForAdminQuery['sportComplexes_Get'][0]

interface SportComplexEditModalProps {
    visible: boolean
    sportComplex: SportComplex | null
    onClose: () => void
    onUpdated?: () => void
}

export function SportComplexEditModal({ visible, sportComplex, onClose, onUpdated }: SportComplexEditModalProps) {
    const { message } = App.useApp()
    const { token } = theme.useToken()
    const [form] = Form.useForm()

    const [updateSportComplex, { loading }] = useUpdateSportComplexIasMutation()

    useEffect(() => {
        if (sportComplex) {
            form.setFieldsValue({
                title: sportComplex.title || '',
                iasEgipRegistryNumber: sportComplex.iasEgipRegistryNumber || ''
            })
        } else {
            form.resetFields()
        }
    }, [sportComplex, form])

    const handleSave = async () => {
        if (!sportComplex) return
        try {
            const values = await form.validateFields()
            await updateSportComplex({
                variables: {
                    input: {
                        id: sportComplex.id,
                        title: values.title || null,
                        iasEgipRegistryNumber: values.iasEgipRegistryNumber || null
                    }
                }
            })
            message.success('Данные обновлены')
            onUpdated?.()
            onClose()
        } catch (error: any) {
            if (error?.errorFields) return
            message.error(error.message || 'Ошибка обновления данных')
        }
    }

    if (!sportComplex) return null

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            title={sportComplex.title}
            subtitle="Редактирование"
            icon={<Building2 size={16} />}
            compact
            footerActions={
                <Space>
                    <Button
                        type="primary"
                        icon={<Check size={16} />}
                        onClick={handleSave}
                        loading={loading}
                        style={{
                            borderRadius: token.borderRadius,
                            background: token.colorSuccess,
                            borderColor: token.colorSuccess
                        }}
                    >
                        Сохранить
                    </Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" disabled={loading}>
                <Form.Item label="Название" name="title">
                    <Input placeholder="Введите название" allowClear />
                </Form.Item>
                <Form.Item label="Номер в реестре ИАС ЕГИП" name="iasEgipRegistryNumber">
                    <Input placeholder="Введите номер в реестре ИАС ЕГИП" allowClear />
                </Form.Item>
            </Form>
        </BaseModal>
    )
}


