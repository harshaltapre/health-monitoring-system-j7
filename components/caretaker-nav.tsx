"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Heart, User, Activity, Bell, Settings, LogOut, Users, Baby } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"

export function CaretakerNav() {
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
    { href: "/caretaker", icon: Activity, label: "Overview" },
    { href: "/caretaker/patients", icon: Users, label: "My Patients" },
    { href: "/caretaker/baby-monitoring", icon: Baby, label: "Baby Monitoring" },
    { href: "/caretaker/alerts", icon: Bell, label: "Alerts" },
    { href: "/caretaker/profile", icon: User, label: "Profile" },
    { href: "/caretaker/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <nav className="flex flex-col h-full bg-card border-r">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">HealthMonitor</span>
        </div>
        <div className="mt-2">
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">Caretaker</span>
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
