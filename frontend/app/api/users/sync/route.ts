// API route to sync Clerk user to Supabase users table
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user data from Clerk
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Sync user to Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert({
        clerk_id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        first_name: user.firstName || null,
        last_name: user.lastName || null,
        full_name: user.fullName || null,
        image_url: user.imageUrl || null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'clerk_id',
      })
      .select()
      .single()

    if (error) {
      console.error('Error syncing user to Supabase:', error)
      return NextResponse.json(
        { error: 'Failed to sync user', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'User synced successfully'
    })
  } catch (error: any) {
    console.error('Error in sync route:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

