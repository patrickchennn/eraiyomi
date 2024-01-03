import { User } from '@eraiyomi/types/User'
import Image from 'next/image'
import React from 'react'

interface ShowProfileProps{
  userInfo: User
}
export default function ShowProfile({
  userInfo
}: ShowProfileProps) {
  

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
