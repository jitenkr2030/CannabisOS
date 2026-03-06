import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow all requests without any authentication checks
  // This will be handled at the route level
  return NextResponse.next()
}

// Remove deprecated middleware configuration
// export const config = {
//   matcher: []
// }