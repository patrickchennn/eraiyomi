// import React from 'react'
// import jwt_decode from "jwt-decode";
// import { AccountInfo } from '../App';
// import { ResponsePayload } from '../App';
// import GoogleLoginBtn from '../components/GoogleLoginBtn';

// interface SignInProps{
//   SetAccountInfo: React.Dispatch<React.SetStateAction<AccountInfo>>
// }
// const SignIn = ({SetAccountInfo}:SignInProps) => {
//   const googleLoginBtnRef = React.useRef<HTMLDivElement>(null)
//   React.useEffect(() => {
//     window.google.accounts.id.initialize({
//       client_id: "230251855708-ag2ddqf9luk40cdkgakgfljdl3s8bmp2.apps.googleusercontent.com",
//       callback: handleCredentialResponse
//     })
//     // window.google.accounts.id.prompt()
  
//     window.google.accounts.id.renderButton(googleLoginBtnRef.current, {
//       type:"standard",
//       shape:"rectangular",
//       theme:"outline",
//       text:"continue_with",
//       size:"large",
//       logo_alignment:"left"
//     });
//   },[])


//   const handleCredentialResponse = (response: any, error: any) => {
//     if(error){
//       console.error(error)
//       return
//     }

//     console.log(response)
//     // to decode the credential response.

//     const responsePayload: ResponsePayload = jwt_decode(response.credential);
//     SetAccountInfo({
//       isLoggedIn:true,
//       responsePayload
//     })
    
//     console.log(responsePayload)
//     console.log("ID: " + responsePayload.sub);
//     console.log('Full Name: ' + responsePayload.name);
//     console.log('Given Name: ' + responsePayload.given_name);
//     console.log('Family Name: ' + responsePayload.family_name);
//     console.log("Image URL: " + responsePayload.picture);
//     console.log("Email: " + responsePayload.email);
//   }



//   return (
//     <div className='h-screen'>
//       <h1>Sign In With:</h1>
//       {/* google account */}
//       <div>
//         <GoogleLoginBtn ref={googleLoginBtnRef}/>
//       </div>
//     </div>
//   )
// }

// export default SignIn