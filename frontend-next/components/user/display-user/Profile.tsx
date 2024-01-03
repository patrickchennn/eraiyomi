import { User } from "@eraiyomi/types/User"
import Image from "next/image"

interface ProfileProps{
  userInfo: User
}

export default function Profile({userInfo}: ProfileProps){

  return (
    <div className="px-6">
      <h1>Profiles</h1>
      <div>
        <div>
          {
            userInfo.profilePictureUrl?
            <Image 
              width={70}
              height={70}
              // className="w-full"
              src={userInfo.profilePictureUrl} 
              alt="profile picture" 
            />
            :
            <p>No Profile</p>
          }
        </div>
        <div>
          Username: {userInfo.username}
        </div>
        <div>
          Name: {userInfo.name?userInfo.name:'-'}
        </div>
        <div>
          Email: {userInfo.email}
        </div>
      </div>
    </div>
  )
}