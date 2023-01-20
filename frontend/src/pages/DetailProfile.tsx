import React from 'react'
import { AccountInfo } from '../App'

interface DetailProfileProps{
  accountInfo: AccountInfo
}
const DetailProfile = () => {
  return (
    <div>
      {/* <h1>Welcome {accountInfo.responsePayload.given_name}</h1> */}
    </div>
  )
}

export default DetailProfile