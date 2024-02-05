import { User } from '@patorikkuuu/eraiyomi-types'
import React from 'react'
import Profile from './display-user/Profile'

interface DisplayUserProps{
  user: User
}
export default function DisplayUser({user}: DisplayUserProps) {
  return (
    <div>
      <Profile userInfo={user}/>
    </div>
  )
}
