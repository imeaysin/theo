import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PageLoading } from "@workspace/ui/components/page-loading"
import { useSignOutMutation } from "@/features/auth/hooks/use-auth-mutations"
import { paths } from "@/config/paths"

export function SignOutPage() {
  const navigate = useNavigate()
  const { mutateAsync: signOut } = useSignOutMutation()

  useEffect(() => {
    void signOut().finally(() => {
      navigate(paths.auth.signIn, { replace: true })
    })
  }, [navigate, signOut])

  return <PageLoading message="Signing out…" />
}
