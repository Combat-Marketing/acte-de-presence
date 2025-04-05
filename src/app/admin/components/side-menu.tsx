"use client";

import { ArchiveBoxIcon, MegaphoneIcon, ChartBarIcon, Cog6ToothIcon, UserIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import Background from "./background";

function handleLogout() {
    signOut({ redirectTo: "/admin/login" });
}

export default function SideMenu() {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    return (
        <>
            <div className="w-12 bg-[var(--color-bg-secondary)] h-full border-r border-r-[var(--color-primary)] flex flex-col">
                <div className="py-5 px-1 flex justify-center items-center border-b border-b-gray-300">
                    <Image src="/admin/acp-icon.svg" alt="ACP Logo" width={341} height={146} className="w-auto h-10" />
                </div>
                <div className="p-1 flex flex-col flex-1 gap-1 border-b border-b-gray-300">
                    <MenuButton id="dashboard" icon={<ArchiveBoxIcon />} disabled={true} label="File" onClick={() => { }} />
                    <MenuButton id="marketing-settings" icon={<MegaphoneIcon />} disabled={true} label="Marketing Settings" onClick={() => { }} />
                    <MenuButton id="reports" icon={<ChartBarIcon />} disabled={true} label="Reports" onClick={() => { }} />
                    <MenuButton id="settings" icon={<Cog6ToothIcon />} disabled={true} label="Settings" onClick={() => { }} />
                </div>
                <div className="mt-auto p-1 flex flex-col gap-1">
                    <MenuButton id="profile" icon={<UserIcon />} disabled={true} label="Profile" onClick={() => { }} />
                    <MenuButton id="logout" icon={<ArrowLeftStartOnRectangleIcon />} disabled={false} label="Logout" onClick={() => setShowLogoutPopup(true)} />
                </div>
            </div>
            {showLogoutPopup && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-100">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10"></div>
                    <div className="bg-white p-8 rounded-lg shadow-lg z-20">
                        <h2 className="text-2xl font-bold mb-4">Logout</h2>
                        <p className="mb-4">Are you sure you want to logout?</p>
                        <div className="flex justify-center">
                            <button type="button" className="bg-[var(--color-bg-primary)] hover:cursor-pointer text-white px-4 py-2 rounded-md mr-2" onClick={handleLogout}>Logout</button>
                            <button type="button" className="bg-[var(--color-bg-secondary)] hover:cursor-pointer text-white px-4 py-2 rounded-md" onClick={() => setShowLogoutPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

const MenuButton = ({ id, icon, label, disabled, onClick }: { id: string, icon: React.ReactNode, label: string, disabled?: boolean, onClick: () => void }) => {
    return (
        <button type="button" id={id} onClick={onClick} disabled={disabled} className={`group relative w-10 h-10 flex justify-center items-center text-white rounded-md p-2 transition-colors duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--color-bg-primary)] active:bg-[var(--color-bg-primary)]'}`}>
            {icon}
            {!disabled && <div className="absolute left-14 bg-[var(--color-bg-primary)] text-white px-2 py-1 rounded-md text-sm text-left opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
                {label}
            </div>}
        </button>
    )
}
