"use client"

import { Archive, Megaphone, BarChart3, Settings, User, LogOut, Bell, Cog } from "lucide-react"
import { signOut } from "next-auth/react"
import Image from "next/image"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import ErrorBoundary from "@/components/error-boundary"
import { SideMenuLoading } from "@/components/ui/loading"

function handleLogout() {
  signOut({ redirectTo: "/login" })
}

export default function SideMenu() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SideMenuLoading />}>
        <SideMenuContent />
      </Suspense>
    </ErrorBoundary>
  )
}

function SideMenuContent() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  return (
    <>
      <div className="w-12 bg-[var(--color-bg-secondary)] h-full border-r border-r-[var(--color-primary)] flex flex-col">
        <div className="py-5 px-1 flex justify-center items-center border-b border-b-gray-300">
          <Image
            src="/acp-icon.svg"
            alt="ACP Logo"
            width={341}
            height={146}
            className="w-auto h-10"
          />
        </div>
        <div className="p-1 flex flex-col flex-1 gap-2 border-b border-b-gray-300">
          <MenuButton
            id="dashboard"
            icon={<Archive className="w-5 h-5" />}
            disabled={true}
            label="File"
            onClick={() => {}}
          />
          <MenuButton
            id="marketing-settings"
            icon={<Megaphone className="w-5 h-5" />}
            disabled={true}
            label="Marketing Settings"
            onClick={() => {}}
          />
          <MenuButton
            id="reports"
            icon={<BarChart3 className="w-5 h-5" />}
            disabled={true}
            label="Reports"
            onClick={() => {}}
          />
          <MenuButton
            id="settings"
            icon={<Cog className="w-5 h-5" />}
            disabled={true}
            label="Settings"
            onClick={() => {}}
          />
        </div>
        <div className="mt-auto p-1 flex flex-col gap-2">
          <MenuButton
            id="notifications"
            icon={<Bell className="w-5 h-5" />}
            disabled={false}
            badge={1}
            label="Notifications"
            onClick={() => {}}
          />
          <MenuButton
            id="profile"
            icon={<User className="w-5 h-5" />}
            disabled={true}
            label="Profile"
            onClick={() => {}}
          />
          <MenuButton
            id="logout"
            icon={<LogOut className="w-5 h-5" />}
            disabled={false}
            label="Logout"
            onClick={() => setShowLogoutDialog(true)}
          />
        </div>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

const MenuButton = ({
  id,
  icon,
  label,
  disabled,
  badge,
  onClick,
}: {
  id: string
  icon: React.ReactNode
  label: string
  disabled?: boolean
  badge?: number
  onClick: () => void
}) => {
  return (
    <Button
      id={id}
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={cn(
        "group relative w-10 h-10 flex justify-center items-center text-white rounded-md p-2 transition-colors duration-300",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[var(--color-bg-primary)] active:bg-[var(--color-bg-primary)]"
      )}
    >
      {icon}
      {!disabled && (
        <div className="absolute left-12 bg-[var(--color-bg-primary)] text-white px-2 py-1 rounded-md text-sm text-left opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
          {label}
        </div>
      )}
      {badge && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
          {badge}
        </div>
      )}
    </Button>
  )
}