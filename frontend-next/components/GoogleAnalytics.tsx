'use client'


import React from 'react'
import Script from 'next/script'

export default function GoogleAnalytics() {
  return (
    <>
      {/* Google tag (gtag.js) for G. Analytics 4
        docs:
        - https://developers.google.com/analytics/devguides/collection/ga4/tag-options (accessed 17 Nov 2023) 
        - https://support.google.com/analytics/answer/9304153#add-tag&zippy=%2Cadd-the-google-tag-directly-to-your-web-pages (accessed 17 Nov 2023)
        - https://stackoverflow.com/questions/76144321/google-analytics-with-nextjs-13
      */}
      <Script async strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-Q879BR7270" />
      <Script async strategy="lazyOnload" id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-Q879BR7270');
        `}
      </Script>
    </>
  )
}
