import { AppContextProvider } from '@/context/AppContext';
import ClientSessionProvider from '@/components/ClientSessionProvider';
import './globals.css';

export const metadata = {
  title: 'Supply Chain Management System',
  description: 'A comprehensive supply chain management solution',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientSessionProvider>
          <AppContextProvider>{children}</AppContextProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
