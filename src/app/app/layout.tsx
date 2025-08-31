import { getUser, getProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AppNav } from '@/components/app-nav'
import { UserNav } from '@/components/user-nav'
import { Toaster } from '@/components/ui/sonner'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) {
    redirect('/auth/signin')
  }

  const profile = await getProfile(user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AppNav />

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="ml-12 lg:ml-0">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Invoify</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Professional invoice management</p>
              </div>
              <UserNav user={user} profile={profile} />
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
