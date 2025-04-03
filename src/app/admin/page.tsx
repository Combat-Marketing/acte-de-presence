import { metadata } from "@/app/admin/layout";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    metadata.title += " - Dashboard";
    const session = await auth();
    if (!session) {
        redirect("/admin/login");
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Dashboard</h1>
        </div>
    )
}
