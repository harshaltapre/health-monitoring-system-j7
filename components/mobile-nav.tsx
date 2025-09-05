"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Heart, Menu } from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex items-center space-x-2 mb-6">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">HealthMonitor</span>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#monitoring"
            className="text-sm font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            Baby Monitoring
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <div className="border-t pt-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/auth/login" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button className="w-full" asChild>
              <Link href="/auth/sign-up" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
