import { createFileRoute } from '@tanstack/react-router'
import AppleMinimal from '@/pages/static/AppleMinimal'

export const Route = createFileRoute('/lander')({
  component: AppleMinimal,
})
