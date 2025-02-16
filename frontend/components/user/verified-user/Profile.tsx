"use client"

import { AppContext } from '@/hooks/appContext'
import Image from 'next/image'
import React, { useContext } from 'react'


export default function ShowProfile() {
  const c = useContext(AppContext)
  const [userInfo] = c.userInfoStates

  if(userInfo===null){
    return (
      <pre>User is null</pre>
    )
  }


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
          Name: {userInfo.name}
        </div>
        <div>
          Email: {userInfo.email}
        </div>
      </div>
    </div>
  )
}
