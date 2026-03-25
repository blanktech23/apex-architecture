import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TopNav } from '@/components/TopNav';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kiptra AI — Platform Documentation',
  description:
    'Architecture, plan, and specification documentation for the Kiptra AI agent platform for construction businesses.',
  openGraph: {
    title: 'Kiptra AI — Platform Documentation',
    description:
      'Architecture, plan, and specification documentation for the Kiptra AI agent platform.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0f] antialiased`}>
        <TopNav />
        {children}
      </body>
    </html>
  );
}
