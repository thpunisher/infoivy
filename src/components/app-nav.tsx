'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FileText, Settings, CreditCard, Home, Users, Sparkles, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/app', icon: Home },
  { name: 'Invoices', href: '/app/invoices', icon: FileText },
  { name: 'Clients', href: '/app/clients', icon: Users },
  { name: 'Templates', href: '/app/settings/templates', icon: Sparkles },
  { name: 'Settings', href: '/app/settings', icon: Settings },
  { name: 'Billing', href: '/app/billing', icon: CreditCard },
]

export function AppNav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-white border-r border-gray-200 min-h-screen transition-transform duration-300 ease-in-out",
        "lg:w-64 lg:translate-x-0 lg:static lg:block",
        "fixed top-0 left-0 w-64 z-40",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Invoify</span>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start',
                      isActive && 'bg-blue-50 text-blue-700 border-blue-200'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    <span className="sm:inline">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
