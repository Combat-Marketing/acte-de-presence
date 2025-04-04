import Background from "@/app/admin/components/background";
import LoginForm from "@/app/admin/components/login/login-form";
export default function LoginPage() {
    return (
        <div>
            <Background blur={false} />
            <div className="min-h-screen flex items-center justify-center bg-transparent md:w-full">
                <LoginForm />
            </div>
        </div>
    )
}
