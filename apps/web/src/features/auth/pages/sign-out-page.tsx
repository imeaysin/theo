import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PageLoading } from "@workspace/ui/components/page-loading"
import { useSignOutMutation } from "@/features/auth/hooks/use-auth-mutations"
import { paths } from "@/config/paths"

export function SignOutPage() {
  const navigate = useNavigate()
  const signOut = useSignOutMutation()

  useEffect(() => {
    void signOut.mutateAsync().finally(() => {
      navigate(paths.auth.signIn, { replace: true })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, [])

  return <PageLoading message="Signing out…" />
}
