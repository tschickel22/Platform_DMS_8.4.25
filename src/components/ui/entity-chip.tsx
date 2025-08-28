import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Building2, User, ExternalLink, Mail, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

interface EntityChipProps {
  type: 'account' | 'contact'
  id?: string
  name?: string
  email?: string
  phone?: string
  title?: string
  industry?: string
  showHoverCard?: boolean
  linkTo?: string
  className?: string
}

export function EntityChip({
  type,
  id,
  name,
  email,
  phone,
  title,
  industry,
  showHoverCard = true,
  linkTo,
  className
}: EntityChipProps) {
  const Icon = type === 'account' ? Building2 : User
  
  // Handle missing data
  if (!id || !name) {
    return (
      <Badge variant="outline" className={cn('ri-chip text-muted-foreground', className)}>
        <Icon className="h-3 w-3 mr-1" />
        N/A
      </Badge>
    )
  }

  const chipContent = (
    <Badge variant="outline" className={cn('ri-chip-interactive', className)}>
      <Icon className="h-3 w-3 mr-1" />
      <span className="truncate max-w-32">{name}</span>
      {linkTo && <ExternalLink className="h-3 w-3 ml-1" />}
    </Badge>
  )

  const hoverCardContent = (
    <div className="space-y-3 p-1">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{name}</span>
        </div>
        {title && (
          <p className="text-sm text-muted-foreground">{title}</p>
        )}
        {industry && type === 'account' && (
          <p className="text-sm text-muted-foreground">{industry}</p>
        )}
      </div>
      
      {(email || phone) && (
        <div className="space-y-1 pt-2 border-t">
          {email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{phone}</span>
            </div>
          )}
        </div>
      )}
      
      {linkTo && (
        <div className="pt-2 border-t">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to={linkTo}>
              View Details
              <ExternalLink className="h-3 w-3 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )

  if (!showHoverCard || !email) {
    return linkTo ? (
      <Link to={linkTo} className="inline-block">
        {chipContent}
      </Link>
    ) : chipContent
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {linkTo ? (
          <Link to={linkTo} className="inline-block">
            {chipContent}
          </Link>
        ) : (
          <button className="inline-block">
            {chipContent}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        {hoverCardContent}
      </PopoverContent>
    </Popover>
  )
}

interface EntityPickerChipProps {
  type: 'account' | 'contact'
  onSelect: () => void
  className?: string
}

export function EntityPickerChip({ type, onSelect, className }: EntityPickerChipProps) {
  const Icon = type === 'account' ? Building2 : User
  const label = type === 'account' ? 'Assign Account' : 'Assign Contact'
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onSelect}
      className={cn('ri-chip-interactive text-muted-foreground', className)}
    >
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Button>
  )
}</biltAction>