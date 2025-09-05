"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Heart, User, Activity, Bell, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"

export function DashboardNav() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    setIsLoading(false)
  }

  const navItems = [
    { href: "/dashboard", icon: Activity, label: "Overview" },
    { href: "/dashboard/metrics", icon: Heart, label: "Health Metrics" },
    { href: "/dashboard/ecg", icon: Activity, label: "ECG Monitor" },
    { href: "/dashboard/profile", icon: User, label: "Profile" },
    { href: "/dashboard/alerts", icon: Bell, label: "Alerts" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <nav className="flex flex-col h-full bg-card border-r">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">HealthMonitor</span>
        </div>
      </div>

      <div className="flex-1 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </div>
      </div>

      <div className="p-3">
        <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut} disabled={isLoading}>
          <LogOut className="mr-2 h-4 w-4" />
          {isLoading ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </nav>
  )
}
