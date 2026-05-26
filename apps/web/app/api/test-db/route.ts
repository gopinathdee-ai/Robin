import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      return NextResponse.json(
        { error: 'DATABASE_URL not set' },
        { status: 500 }
      )
    }

    console.log('Testing connection to:', databaseUrl.replace(/password[^@]*/, 'password:***'))

    const pool = new Pool({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 5_000,
    })

    // Try to connect
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    client.release()
    await pool.end()

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      timestamp: result.rows[0].now,
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      {
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
