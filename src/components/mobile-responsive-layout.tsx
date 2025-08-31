'use client'

import { cn } from '@/lib/utils'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  return (
    <div className={cn(
      "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
      className
    )}>
      {children}
    </div>
  )
}

interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export function ResponsiveGrid({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 }, 
  gap = 4,
  className 
}: ResponsiveGridProps) {
  const gridClasses = cn(
    "grid",
    `grid-cols-1`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    `gap-${gap}`,
    className
  )

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

interface ResponsiveHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function ResponsiveHeader({ title, subtitle, action, className }: ResponsiveHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
      className
    )}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="w-full sm:w-auto">
          {action}
        </div>
      )}
    </div>
  )
}

interface ResponsiveCardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

export function ResponsiveCard({ children, className, padding = 'md' }: ResponsiveCardProps) {
  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  }

  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 shadow-sm",
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  )
}
