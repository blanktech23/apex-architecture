import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kiptra AI Mind Map',
  description:
    'Interactive architecture map of the Kiptra AI AI agent platform for construction businesses. Seven specialized agents, seven integrations, one unified system.',
  openGraph: {
    title: 'Kiptra AI Mind Map',
    description:
      'Interactive architecture map of the Kiptra AI AI agent platform for construction businesses.',
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
        {children}
      </body>
    </html>
  );
}
