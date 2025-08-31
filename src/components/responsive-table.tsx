'use client'

import { cn } from '@/lib/utils'

interface ResponsiveTableProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="min-w-full">
        {children}
      </div>
    </div>
  )
}

interface ResponsiveTableRowProps {
  children: React.ReactNode
  className?: string
  mobileLayout?: React.ReactNode
}

export function ResponsiveTableRow({ children, className, mobileLayout }: ResponsiveTableRowProps) {
  if (mobileLayout) {
    return (
      <>
        {/* Desktop view */}
        <div className={cn("hidden md:flex", className)}>
          {children}
        </div>
        {/* Mobile view */}
        <div className="md:hidden">
          {mobileLayout}
        </div>
      </>
    )
  }

  return (
    <div className={cn("flex items-center", className)}>
      {children}
    </div>
  )
}

interface MobileCardProps {
  title: string
  subtitle?: string
  status?: React.ReactNode
  actions?: React.ReactNode
  metadata?: string[]
  className?: string
}

export function MobileCard({ 
  title, 
  subtitle, 
  status, 
  actions, 
  metadata = [], 
  className 
}: MobileCardProps) {
  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-lg p-4 space-y-3",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        {status && (
          <div className="ml-2">
            {status}
          </div>
        )}
      </div>
      
      {metadata.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {metadata.map((item, index) => (
            <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {item}
            </span>
          ))}
        </div>
      )}
      
      {actions && (
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          {actions}
        </div>
      )}
    </div>
  )
}
