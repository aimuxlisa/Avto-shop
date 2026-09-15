import './globals.css';

export const metadata = {
  title: 'AutoHub — Premium Electric & Luxury Automotive Marketplace',
  description: 'Explore, compare and book next-generation luxury, sports and electric vehicles with seamless online booking, transparent pricing and 24/7 AI Concierge.',
  keywords: 'AutoHub, electric cars, luxury cars, car comparison, test drive booking, auto marketplace, Tesla, BMW, Porsche, Audi',
  openGraph: {
    title: 'AutoHub — Next-Gen Auto Marketplace',
    description: 'Explore, compare and book next-generation luxury and electric vehicles with live AI concierge.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Orbitron:wght@600;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050914] text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
