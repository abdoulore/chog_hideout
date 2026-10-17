import type { Metadata } from 'next';
export const metadata:Metadata={title:'Chog Hideout',description:'A little trouble. A guild to come home to.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
