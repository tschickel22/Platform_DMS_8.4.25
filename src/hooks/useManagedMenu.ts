import { useEffect } from 'react'
import { useMenuManager } from '@/contexts/MenuManagerContext'

export function useManagedMenu(menuId: string) {
  const { activeMenuId, setActiveMenu, clearActiveMenu } = useMenuManager()
  
  const isOpen = activeMenuId === menuId
  
  const openMenu = () => {
    setActiveMenu(menuId)
  }
  
  const closeMenu = () => {
    if (activeMenuId === menuId) {
      clearActiveMenu()
    }
  }
  
  const toggleMenu = () => {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (activeMenuId === menuId) {
        clearActiveMenu()
      }
    }
  }, [activeMenuId, menuId, clearActiveMenu])
  
  return {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu
  }
}