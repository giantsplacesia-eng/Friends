import '@/app/globals.css';
import { SmoothScrollProvider } from '@/components/ui/SmoothScrollProvider';

export const metadata = {
  title: 'Friends with Giants - AI-First Marketing Agency',
  description: 'Where the Giant meets innovation. AI-powered marketing solutions that scale.',
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
