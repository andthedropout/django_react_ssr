import { createFileRoute } from '@tanstack/react-router'
import Logout from '@/pages/auth/Logout'

export const Route = createFileRoute('/logout')({
  component: Logout,
  head: () => ({ meta: [{ title: 'Sign out' }] }),
})
