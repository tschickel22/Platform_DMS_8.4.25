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
}

export function ManagedSelect({
  menuId,
  value,
  onValueChange,
  placeholder,
  children,
  disabled,
  className
}: ManagedSelectProps) {
  const { isOpen, toggleMenu, closeMenu } = useManagedMenu(menuId)

  const handleValueChange = (newValue: string) => {
    onValueChange?.(newValue)
    closeMenu() // Close menu after selection
  }

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          toggleMenu()
        } else {
          closeMenu()
        }
      }}
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