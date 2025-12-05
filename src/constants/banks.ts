import { BankType, AccountType } from '@/graphql/generated'
import { Wallet, PiggyBank, CreditCard, TrendingUp, Percent, Briefcase } from 'lucide-react'

export const BANK_TYPE_LABELS: Record<BankType, string> = {
  [BankType.Sberbank]: 'Сбер ID',
  [BankType.AlfaBank]: 'Alfa ID',
  [BankType.CenterBank]: 'Центр-Инвест',
  [BankType.Invest]: 'Банк Центр-Инвест',
  [BankType.Tbank]: 'T-ID'
}

export const BANK_NAMES: Record<BankType, string> = {
  [BankType.Sberbank]: 'Сбербанк',
  [BankType.AlfaBank]: 'Альфа-Банк',
  [BankType.CenterBank]: 'Банк Центр-Инвест',
  [BankType.Invest]: 'Банк Центр-Инвест',
  [BankType.Tbank]: 'Т-Банк'
}

export const BANK_CARDS = [
  { type: BankType.Tbank, label: 'T-ID', name: 'Т-Банк' },
  { type: BankType.Sberbank, label: 'Сбер ID', name: 'Сбербанк' },
  { type: BankType.CenterBank, label: 'Центр-Инвест', name: 'Банк Центр-Инвест' },
  { type: BankType.AlfaBank, label: 'Alfa ID', name: 'Альфа-Банк' }
]

export const BANK_COLORS: Record<BankType, { 
  gradient: string
  bg: string
  border: string
  logo: string
  icon: string
}> = {
  [BankType.Sberbank]: {
    gradient: 'linear-gradient(135deg, #21a038 0%, #1a7d2e 100%)',
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '#21a038',
    logo: '🟢',
    icon: '🏦'
  },
  [BankType.AlfaBank]: {
    gradient: 'linear-gradient(135deg, #ef3124 0%, #c91e1e 100%)',
    bg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    border: '#ef3124',
    logo: '🔴',
    icon: '🏛️'
  },
  [BankType.CenterBank]: {
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    border: '#1e3a8a',
    logo: '🔵',
    icon: '🏛️'
  },
  [BankType.Invest]: {
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    border: '#1e3a8a',
    logo: '🔵',
    icon: '📈'
  },
  [BankType.Tbank]: {
    gradient: '#ffdd2d',
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    border: '#f59e0b',
    logo: '🟡',
    icon: '💳'
  }
}

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  [AccountType.Current]: 'Дебетовый',
  [AccountType.Savings]: 'Накопительный',
  CREDIT: 'Кредитный',
  INVESTMENT: 'Инвестиционный',
  DEPOSIT: 'Депозитный',
  BUSINESS: 'Бизнес'
}

export const ACCOUNT_TYPE_DESCRIPTIONS: Record<string, string> = {
  [AccountType.Current]: 'Для ежедневных операций',
  [AccountType.Savings]: 'Для накопления и сбережений',
  CREDIT: 'Для кредитных операций и займов',
  INVESTMENT: 'Для инвестиций и торговли',
  DEPOSIT: 'Депозитный счет с процентами',
  BUSINESS: 'Для бизнес-операций'
}

export const ACCOUNT_TYPE_ICONS: Record<string, any> = {
  [AccountType.Current]: Wallet,
  [AccountType.Savings]: PiggyBank,
  CREDIT: CreditCard,
  INVESTMENT: TrendingUp,
  DEPOSIT: Percent,
  BUSINESS: Briefcase
}

export const ACCOUNT_TYPE_COLORS: Record<string, { gradient: string; bg: string; border: string }> = {
  [AccountType.Current]: {
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    border: '#3b82f6'
  },
  [AccountType.Savings]: {
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '#10b981'
  },
  CREDIT: {
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    bg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    border: '#ef4444'
  },
  INVESTMENT: {
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    border: '#8b5cf6'
  },
  DEPOSIT: {
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    border: '#f59e0b'
  },
  BUSINESS: {
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    bg: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
    border: '#6366f1'
  }
}

export const ACCOUNT_TYPES = [
  { value: AccountType.Current, key: AccountType.Current },
  { value: AccountType.Savings, key: AccountType.Savings },
  { value: 'CREDIT' as any, key: 'CREDIT' },
  { value: 'INVESTMENT' as any, key: 'INVESTMENT' },
  { value: 'DEPOSIT' as any, key: 'DEPOSIT' },
  { value: 'BUSINESS' as any, key: 'BUSINESS' }
]

export const DEFAULT_BANK_COLOR = {
  gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
  border: '#64748b',
  logo: '💼',
  icon: '💼'
}

