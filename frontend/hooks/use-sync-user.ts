"use client"

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

/**
 * Hook to sync Clerk user to Supabase users table
 * Runs when user signs in or signs up
 */
export function useSyncUser() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded || !user) return

    // Sync user to Supabase
    const syncUser = async () => {
      try {
        await axios.post('/api/users/sync')
        console.log('✅ User synced to Supabase')
      } catch (error) {
        console.error('❌ Error syncing user:', error)
      }
    }

    syncUser()
  }, [user, isLoaded])
}

