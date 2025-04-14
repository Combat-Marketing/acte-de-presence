import { auth } from "@/auth"
import { signIn } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Background from "@/components/ui/background"

export default async function LoginPage() {
  const session = await auth()
  
  if (session) {
    return null // Will be redirected by middleware
  }

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
              await signIn("keycloak", { 
                redirectTo: "/",
                callbackUrl: "/"
              })
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