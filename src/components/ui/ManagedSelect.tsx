import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useManagedMenu } from '@/hooks/useManagedMenu'

interface ManagedSelectProps {
  menuId: string
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
  name?: string
}

export function ManagedSelect({
  menuId,
  value,
  onValueChange,
  placeholder,
  children,
  disabled,
  className,
  name
}: ManagedSelectProps) {
  const { isOpen, toggleMenu, closeMenu } = useManagedMenu(menuId)

  const handleValueChange = (newValue: string) => {
    console.log(`ManagedSelect[${name || menuId}]: Value changing from "${value}" to "${newValue}"`)
    onValueChange?.(newValue)
    closeMenu() // Close menu after selection
  }

  const handleOpenChange = (open: boolean) => {
    console.log(`ManagedSelect[${name || menuId}]: Open state changing to ${open}`)
    if (open) {
      toggleMenu()
    } else {
      closeMenu()
    }
  }

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      open={isOpen}
      onOpenChange={handleOpenChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  )
}

// Re-export SelectItem for convenience
export { SelectItem }