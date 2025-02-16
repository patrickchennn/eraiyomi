'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import chalk from 'chalk'

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID


export default function GoogleAnalytics() {
  console.log(chalk.blueBright.bgBlack("@GoogleAnalytics"))
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    if (pathname.startsWith('/post/')) {
      window.dataLayer = window.dataLayer || []
      // function gtag() { window.dataLayer.push(arguments) }
      const gtag: Gtag.Gtag = function () {window.dataLayer.push(arguments);};
      console.log("window.dataLayer=",window.dataLayer)

      gtag('js', new Date())
      gtag('config', GA_TRACKING_ID!)

      // Extract `articleId` from query params
      // const articleId = searchParams.get("id")
      // if (articleId) {
      //   console.info(chalk.blueBright.bgBlack("Sending articleId to GA:", articleId))

      //   gtag('event', 'view_article', {
      //     articleId: articleId, // Custom dimension
      //   })
      // }
    }
  }, [pathname,searchParams])

  if (!pathname.startsWith('/post/')) return null // Don't render on other routes

  return (
    <Script async strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
  )
}
/** Useful Docs
 * Introduction to Google Analytics - https://developers.google.com/analytics/devguides/collection/ga4 (Accessed on Feb 2025)
 * gtag function Typescript definition - https://stackoverflow.com/questions/62306920/gtag-function-typescript-definition (Accessed on Feb 2025)
 * Google analytics with nextjs 13? - https://stackoverflow.com/questions/76144321/google-analytics-with-nextjs-13 (Accessed on Feb 2025)
 */