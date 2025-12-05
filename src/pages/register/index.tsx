import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { App, Button, Card, Form, Input, Layout, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation } from '@apollo/client'
import { RegisterDocument } from '@/graphql/generated'
import { useSEO } from '@/hooks/use-seo'

const { Content } = Layout
const { Title, Text } = Typography

export default function RegisterPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [registerMutation, { loading }] = useMutation(RegisterDocument)

  useSEO({
    title: 'Регистрация в Smart Account',
    description: 'Создайте аккаунт для управления финансами',
    keywords: 'регистрация, создание аккаунта, финансы',
    noindex: true,
    url: `${window.location.origin}/register`
  })

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    try {
      const result = await registerMutation({
        variables: {
          input: {
            name: values.name,
            email: values.email,
            password: values.password
          }
        }
      })

      if (result.errors && result.errors.length > 0) {
        const errorMessage = result.errors.map(err => err.message).join('; ')
        message.error(errorMessage)
        return
      }

      if (result.data?.register) {
        message.success('Регистрация успешна! Проверьте email для подтверждения.')
        navigate('/login')
      }
    } catch (error: any) {
      let errorMessage = 'Ошибка при регистрации'
      
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors.map((err: any) => err.message).join('; ')
      } else if (error.networkError) {
        errorMessage = 'Нет связи с сервером. Проверьте интернет-соединение'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      message.error(errorMessage)
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)' }}>
      <Content className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl" style={{ background: '#ffffff', border: '1px solid #d1fae5' }}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center mx-auto mb-4">
              <UserOutlined className="!text-white !text-2xl" />
            </div>
            <Title level={2} style={{ color: '#10b981', marginBottom: '0.5rem' }}>
              Регистрация
            </Title>
            <Text style={{ color: '#64748b' }}>
              Создайте аккаунт для управления финансами
            </Text>
          </div>

          <Form onFinish={handleRegister} layout="vertical" size="large">
            <Form.Item
              name="name"
              label={<span style={{ color: '#1e293b' }}>Имя</span>}
              rules={[
                { required: true, message: 'Введите имя' },
                { min: 2, message: 'Имя должно быть не короче 2 символов' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Введите имя" />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span style={{ color: '#1e293b' }}>Email</span>}
              rules={[
                { required: true, message: 'Введите email' },
                { type: 'email', message: 'Введите корректный email' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Введите email" />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ color: '#1e293b' }}>Пароль</span>}
              rules={[
                { required: true, message: 'Введите пароль' },
                { min: 6, message: 'Пароль должен быть не короче 6 символов' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Введите пароль" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span style={{ color: '#1e293b' }}>Подтвердите пароль</span>}
              dependencies={['password']}
              rules={[
                { required: true, message: 'Подтвердите пароль' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Пароли не совпадают'))
                  }
                })
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите пароль" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className="w-full" size="large">
                Зарегистрироваться
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Text style={{ color: '#64748b' }}>
              Уже есть аккаунт?{' '}
              <a href="/login" style={{ color: '#10b981' }}>
                Войти
              </a>
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  )
}
