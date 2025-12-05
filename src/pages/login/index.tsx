import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { App, Button, Card, Form, Input, Layout, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation } from '@apollo/client'
import { LoginDocument } from '@/graphql/generated'
import { useAuth } from '@/contexts/auth-context'
import { useSEO } from '@/hooks/use-seo'

const { Content } = Layout
const { Title, Text } = Typography

export default function LoginPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { setUser, setToken } = useAuth()
  const [loginMutation, { loading }] = useMutation(LoginDocument)

  useSEO({
    title: 'Вход в Smart Account',
    description: 'Войдите в систему управления финансами',
    keywords: 'вход, логин, пароль, авторизация, финансы',
    noindex: true,
    url: `${window.location.origin}/login`
  })

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const result = await loginMutation({
        variables: {
          input: {
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

      if (result.data?.login) {
        if (result.data.login.jwtToken) {
          setToken(result.data.login.jwtToken)
        }
        setUser(result.data.login)
        message.success(`Добро пожаловать, ${result.data.login.name || result.data.login.email}!`)
        navigate('/dashboard')
      }
    } catch (error: any) {
      let errorMessage = 'Неверный email или пароль'
      
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
              <MailOutlined className="!text-white !text-2xl" />
            </div>
            <Title level={2} style={{ color: '#10b981', marginBottom: '0.5rem' }}>
              Smart Account
            </Title>
            <Text style={{ color: '#64748b' }}>
              Войдите в систему управления финансами
            </Text>
          </div>

          <Form onFinish={handleLogin} layout="vertical" size="large">
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

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className="w-full" size="large">
                Войти
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Text style={{ color: '#64748b' }}>
              Нет аккаунта?{' '}
              <a href="/register" style={{ color: '#10b981' }}>
                Зарегистрироваться
              </a>
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  )
}
