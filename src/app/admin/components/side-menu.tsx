"use client";

import { ArchiveBoxIcon, MegaphoneIcon, ChartBarIcon, Cog6ToothIcon, UserIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function SideMenu() {
    return (
        <div className="w-12 bg-[var(--color-bg-secondary)] h-full border-r border-r-[var(--color-primary)] flex flex-col">
            <div className="py-5 px-1 flex justify-center items-center border-b border-b-gray-300">
                <Image src="/admin/acp-icon.svg" alt="ACP Logo" width={341} height={146} className="w-auto h-10" />
            </div>
            <div className="p-1 flex flex-col flex-1 gap-1 border-b border-b-gray-300">
                <MenuButton id="dashboard" icon={<ArchiveBoxIcon />} disabled={true} label="File" onClick={() => {}} />
                <MenuButton id="marketing-settings" icon={<MegaphoneIcon />} disabled={true} label="Marketing Settings" onClick={() => {}} />
                <MenuButton id="reports" icon={<ChartBarIcon />} disabled={true} label="Reports" onClick={() => {}} />
                <MenuButton id="settings" icon={<Cog6ToothIcon />} disabled={true} label="Settings" onClick={() => {}} />
            </div>
            <div className="mt-auto p-1 flex flex-col gap-1">
                <MenuButton id="profile" icon={<UserIcon />} disabled={true} label="Profile" onClick={() => {}} />
                <MenuButton id="logout" icon={<ArrowLeftStartOnRectangleIcon />} disabled={true} label="Logout" onClick={() => {}} />
            </div>
        </div>
    )
}

const MenuButton = ({ id, icon, label, disabled, onClick }: { id: string, icon: React.ReactNode, label:string, disabled?: boolean, onClick: () => void }) => {
    return (
        <button type="button" id={id} onClick={onClick} disabled={disabled} className={`group relative w-10 h-10 flex justify-center items-center text-white rounded-md p-2 transition-colors duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--color-bg-primary)] active:bg-[var(--color-bg-primary)]'}`}>
            {icon}
            {!disabled && <div className="absolute left-14 bg-[var(--color-bg-primary)] text-white px-2 py-1 rounded-md text-sm text-left opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
                {label}
            </div>}
        </button>
    )
}
