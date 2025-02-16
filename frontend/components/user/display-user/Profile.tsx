import { getUser } from "@/services/user/userService";
import { User } from "@shared/User"
import Image from "next/image"
import { useEffect, useState } from "react";


interface ProfileProps{
  userName: string
}
export default function Profile({userName}: ProfileProps){
  const [userInfo,setUserInfo] = useState<{status:string,message:any,data:User|null}|null>(null)



  
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  useEffect(() => {
    getUser({username:userName})
      .then(resData => {
        setUserInfo(resData)
      })
    ;

  }, [])




  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if(userInfo===null) return <div className='loader'></div>

  if(userInfo.data===null){
    return (
      <pre>{JSON.stringify(userInfo, null, 4)}</pre>
    )
  }

  return (
    <div className="px-6">
      <h1>Profiles</h1>
      <div>
        <div>
          {
            userInfo.data.profilePictureUrl?
            <Image 
              width={70}
              height={70}
              // className="w-full"
              src={userInfo.data.profilePictureUrl} 
              alt="profile picture" 
            />
            :
            <p>No profile picture</p>
          }
        </div>
        <div>
          Username: {userInfo.data.username}
        </div>
        <div>
          Name: {userInfo.data.name}
        </div>
        <div>
          Email: {userInfo.data.email}
        </div>
      </div>
    </div>
  )
}