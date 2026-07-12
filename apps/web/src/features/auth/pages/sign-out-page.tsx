import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PageLoading } from "@workspace/ui-shadcn/components/page-loading"
import { useSignOut } from "@workspace/auth/react"
import { routes } from "@/config/routes"

export function SignOutPage() {
  const navigate = useNavigate()
  const { mutateAsync: signOut } = useSignOut()

  useEffect(() => {
    void signOut().finally(() => {
      navigate(routes.signIn, { replace: true })
    })
  }, [navigate, signOut])

  return <PageLoading message="Signing out…" />
}
