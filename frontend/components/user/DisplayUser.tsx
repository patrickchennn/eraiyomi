"use client"

import React from 'react'
import Profile from './display-user/Profile'


interface DisplayUserProps{
  userName: string
}
export default function DisplayUser({userName}: DisplayUserProps) {
  return (
    <Profile userName={userName}/>
  )
}
