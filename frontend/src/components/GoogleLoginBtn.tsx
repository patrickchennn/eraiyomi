import React from 'react'

const GoogleLoginBtn = React.forwardRef((_, googleLoginBtnRef: React.MutableRefObject<HTMLDivElement>) => {
  return (
    <>
      <div 
        id="g_id_onload"
        data-client_id="230251855708-ag2ddqf9luk40cdkgakgfljdl3s8bmp2.apps.googleusercontent.com"
        data-context="signin"
        data-callback="handleCredentialResponse"
      >
      </div>

      <div 
        ref={currEle => googleLoginBtnRef.current = currEle}
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="continue_with"
        data-size="large"
        data-logo_alignment="left"
      >
      </div>
    </>
  )
})

export default GoogleLoginBtn