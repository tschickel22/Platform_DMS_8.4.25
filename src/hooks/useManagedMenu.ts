import { useEffect } from 'react'
import { useMenuManager } from '@/contexts/MenuManagerContext'

export function useManagedMenu(menuId: string) {
  const { activeMenuId, setActiveMenu, clearActiveMenu } = useMenuManager()
  
  const isOpen = activeMenuId === menuId
  
  const openMenu = () => {
    console.log(`useManagedMenu[${menuId}]: Opening menu`)
    setActiveMenu(menuId)
  }
  
  const closeMenu = () => {
    console.log(`useManagedMenu[${menuId}]: Closing menu`)
    if (activeMenuId === menuId) {
      clearActiveMenu()
    }
  }
  
  const toggleMenu = () => {
    console.log(`useManagedMenu[${menuId}]: Toggling menu (currently ${isOpen ? 'open' : 'closed'})`)
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