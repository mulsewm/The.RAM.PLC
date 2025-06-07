import { redirect } from 'next/navigation';

export default function Home() {
  // This will redirect to the login page by default
  redirect('/login');
  
  // This return statement is just to satisfy TypeScript
  return null;
}
