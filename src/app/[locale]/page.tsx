import { redirect } from 'next/navigation';
import { auth } from '@/libs/auth';

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect('/home');
  } else {
    redirect('/auth/signin');
  }
}
