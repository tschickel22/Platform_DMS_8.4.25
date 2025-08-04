import React, { createContext, useContext, useState, ReactNode } from 'react'

interface MenuManagerContextType {
  activeMenuId: string | null
  setActiveMenu: (menuId: string) => void
  clearActiveMenu: () => void
  isMenuActive: (menuId: string) => boolean
}

const MenuManagerContext = createContext<MenuManagerContextType | undefined>(undefined)

export function useMenuManager() {
  const context = useContext(MenuManagerContext)
  if (context === undefined) {
    throw new Error('useMenuManager must be used within a MenuManagerProvider')
  }
  return context
}

interface MenuManagerProviderProps {
  children: ReactNode
}

export function MenuManagerProvider({ children }: MenuManagerProviderProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  const setActiveMenu = (menuId: string) => {
    setActiveMenuId(menuId)
  }

  const clearActiveMenu = () => {
    setActiveMenuId(null)
  }

  const isMenuActive = (menuId: string): boolean => {
    return activeMenuId === menuId
  }

  const value = {
    activeMenuId,
    setActiveMenu,
    clearActiveMenu,
    isMenuActive
  }

  return (
    <MenuManagerContext.Provider value={value}>
      {children}
    </MenuManagerContext.Provider>
  )
}