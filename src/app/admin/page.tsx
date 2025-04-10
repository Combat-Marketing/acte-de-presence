import { metadata } from "@/app/admin/layout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Accordion from "./components/accordion";
import SideMenu from "./components/side-menu";
import ResizableContainer from "./components/resizable-container";

export default async function AdminPage() {
    metadata.title += " - Dashboard";
    const session = await auth();
    if (!session) {
        redirect("/admin/login");
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <SideMenu />
            <ResizableContainer>
            <Accordion items={[{
                id: "documents",
                title: "Documents",
                content: <div>Documents</div>
            }, {
                id: "assets",
                title: "Assets",
                content: <div>Assets</div>
            }, {
                id: "data-objects",
                title: "Data Objects",
                content: <div>Data Objects</div>
                }]} />
            </ResizableContainer>
            <div className="flex-1 bg-gray-100">
                <h1>Dashboard</h1>
            </div>
        </div>
    )
}
