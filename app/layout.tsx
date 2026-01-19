import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';

// Inter for readable body text
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

// JetBrains Mono for that "Neural/Technical" aesthetic
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'LUMI AI',
  description: 'Next-Gen AI Interface - Powered by Lumi v4',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body 
        className={`
          ${inter.variable} 
          ${jetbrains.variable} 
          font-sans antialiased 
          bg-[#020202] text-slate-200 
          selection:bg-fuchsia-500/30 selection:text-fuchsia-200
        `}
      >
        <AuthProvider>
          {/* Main content wrapper with custom scrollbar behavior */}
          <div className="relative flex flex-col min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}