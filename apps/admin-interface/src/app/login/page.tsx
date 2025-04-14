import { auth, signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Background from "@/components/ui/background"

export default async function LoginPage() {
  const session = await auth()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Background blur={false} />
      <Card className="w-[400px] mx-auto z-20 bg-white shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image src="/img/acp-logo.svg" alt="Logo" width={100} height={100} className="animate-scaleIn" />
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
            <form
              action={async () => {
                "use server"
                await signIn("keycloak", { redirectTo: "/dashboard" })
              }}
            >
              <Button className="w-full animate-slideUp" type="submit">
                Sign in with Keycloak
              </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  )
} 