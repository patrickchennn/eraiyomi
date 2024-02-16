import "@/assets/globals.css"

import Footer from "@/components/Footer"
import GoogleAnalytics from "@/components/GoogleAnalytics";
import TopNav from "@/components/top-nav/TopNav"

import { AppContextProvider } from "@/hooks/appContext";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: 'Eraiyomi',
}
interface RootLayoutProps {
  children: React.ReactNode
}
export default function RootLayout({children}: RootLayoutProps){


  return (
    <html lang="en" >
      <head>

        <script id="dsq-count-scr" src="//eraiyomi.disqus.com/count.js" async></script>

        <script async src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

        <GoogleAnalytics />

        <link rel="icon" href="/icon.png" sizes="any" />

        {/* G. identity, authentication, Sign In with Google */}
        <script src="https://accounts.google.com/gsi/client" async></script>

      </head>
      <body className="dark:text-white">
        <AppContextProvider>
          <>
            <TopNav />
            <div className='min-h-screen h-full light-theme-bg dark:dark-theme-bg relative max-[640px]:font-sm '>
              {children}
            </div>
            <Footer />
          
          </>
        </AppContextProvider>
      </body>
    </html>
  )
}