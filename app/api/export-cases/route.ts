import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all cases with related data
    const { data: cases, error } = await supabase
      .from('cases')
      .select(`
        *,
        scam_types (
          name
        ),
        users (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert to CSV format
    const headers = [
      'ID',
      'Scam Type',
      'Amount Lost',
      'State',
      'Date',
      'Description',
      'Reported By',
      'Status',
      'Created At',
      'Updated At'
    ]

    const csvRows = cases.map(case_ => [
      case_.id,
      case_.scam_types?.name || 'N/A',
      case_.amount_lost,
      case_.state,
      case_.date,
      case_.description,
      `${case_.users?.full_name || 'N/A'} (${case_.users?.email || 'N/A'})`,
      case_.status,
      case_.created_at,
      case_.updated_at
    ])

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.map(cell => 
        typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(','))
    ].join('\n')

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="cases_export_${new Date().toISOString()}.csv"`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 