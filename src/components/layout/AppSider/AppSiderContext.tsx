import { createContext, useContext, useState, ReactNode } from 'react'

interface AppSiderContextType {
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const AppSiderContext = createContext<AppSiderContextType | undefined>(undefined)

export const AppSiderProvider = ({ children }: { children: ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <AppSiderContext.Provider value={{ mobileOpen, setMobileOpen }}>
      {children}
    </AppSiderContext.Provider>
  )
}

export const useAppSider = () => {
  const context = useContext(AppSiderContext)
  if (!context) {
    throw new Error('useAppSider must be used within AppSiderProvider')
  }
  return context
}

