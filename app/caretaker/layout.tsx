import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CaretakerNav } from "@/components/caretaker-nav"

export default async function CaretakerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is a caretaker
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (profile?.role !== "caretaker") {
    redirect("/dashboard")
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <CaretakerNav />
      </div>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
