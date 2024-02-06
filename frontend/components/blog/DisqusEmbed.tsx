"use client"

import chalk from "chalk";
import { usePathname } from "next/navigation";

export default function DisqusEmbed({articleId}: {articleId: string}) {
  console.log(chalk.yellow("@DisqusEmbed"))

  
  const pathname = usePathname()
  console.log("pathname=",pathname)

  const fullUrl = `${window.location.origin}${pathname}`;
  console.log("fullUrl=",fullUrl)

  console.log("articleId=",articleId)

  interface DisqusConfig {
    page: {
      url: string;
      identifier: string;
    };
    // ... any other configuration properties ...
  }
  /**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables 
  */
  var disqus_config = function (this: DisqusConfig) {
    this.page.url = pathname;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = articleId; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
  };

  (function() { // DON'T EDIT BELOW THIS LINE
    var d = document;
    const s = d.createElement('script');
    s.src = 'https://eraiyomi.disqus.com/embed.js';
    s.setAttribute('data-timestamp', (+new Date()).toString());
    (d.head || d.body).appendChild(s);
  })();

  return (
    <div id="disqus_thread" className="mt-10"></div>
  )
}
