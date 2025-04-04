import { metadata } from "@/app/admin/layout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SideMenu from "./components/side-menu";

export default async function AdminPage() {
    metadata.title += " - Dashboard";
    const session = await auth();
    if (!session) {
        redirect("/admin/login");
    }
    
    return (
        <div className="flex h-screen overflow-hidden">
            <SideMenu />
        </div>
    )
}
