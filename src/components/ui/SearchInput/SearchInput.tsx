import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import type { InputProps } from 'antd'

interface SearchInputProps extends Omit<InputProps, 'onChange'> {
  onSearch?: (value: string) => void
  debounceMs?: number
}

export const SearchInput = ({
  onSearch,
  debounceMs = 300,
  ...props
}: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchValue = useDebounce(searchValue, debounceMs)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
  }

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchValue)
    }
  }, [debouncedSearchValue, onSearch])

  return (
    <Input
      {...props}
      value={searchValue}
      onChange={handleChange}
      prefix={<SearchOutlined />}
      placeholder={props.placeholder || 'Поиск...'}
      allowClear
    />
  )
}
