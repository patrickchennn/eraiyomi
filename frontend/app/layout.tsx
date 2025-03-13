import "@/assets/globals.css"

import Footer from "@/components/Footer"
import TopNav from "@/components/top-nav/TopNav"

import { AppContextProvider } from "@/hooks/appContext";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: {
    default:'Eraiyomi',
    template:'%s - Eraiyomi',
  },
  description: "Good Readings"
}
interface RootLayoutProps {
  children: React.ReactNode
}
export default function RootLayout({children}: RootLayoutProps){


  return (
    <html lang="en" className="dark">
      <head>

        <script async src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
        
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>

      <body className="dark:text-white">
        <AppContextProvider>
          <>
            <TopNav />
            <div className='min-h-screen h-full light-theme-bg dark:dark-theme-bg relative max-[640px]:font-sm'>
              {/* Wrap children in a container that applies the dark background to all its children */}
              <>
                {children}
              </>
            </div>
            <Footer />
          </>
        </AppContextProvider>
      </body>
    </html>
  )
}