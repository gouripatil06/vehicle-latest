"use client"

import { useUser, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Header() {
  const { user } = useUser()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold shadow-sm">
              V
            </div>
            <span className="hidden font-bold sm:inline-block text-lg">
              Vehicle Tracking
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Public links - visible to everyone */}
            <Link
              href="/info"
              className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
            
            {/* Protected links - only visible when signed in */}
            <SignedIn>
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/analytics"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground"
              >
                Analytics
              </Link>
              <Link
                href="/settings"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground"
              >
                Settings
              </Link>
            </SignedIn>
          </nav>
        </div>

        {/* Right side - Theme toggle and User */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {/* User Button */}
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

