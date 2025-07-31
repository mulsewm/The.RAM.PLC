// TODO: Implement route protection here if needed. For now, this is a pass-through middleware.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // You can add custom auth logic here if needed
  return NextResponse.next();
}

// Optionally, add a matcher if you want to restrict middleware to certain routes
// export const config = {
//   matcher: ['/dashboard/:path*', '/admin/:path*'],
// };
