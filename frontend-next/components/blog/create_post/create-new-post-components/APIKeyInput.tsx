import React, { Dispatch, SetStateAction } from 'react'

interface APIKeyInputProps{
  API_keyState: [string,Dispatch<SetStateAction<string>>]
}
export default function APIKeyInput({API_keyState}: APIKeyInputProps) {
  const [API_key,set_API_key] = API_keyState
  return (
    <div>
      <label htmlFor="api-key" className='block'>key<span className='text-red-600'>*</span></label>
      <input 
        required
        id="api-key"
        className="px-2 border bg-gray-100" 
        type="password"
        value={API_key}
        data-cy="api-key-input"
        onChange={e=>set_API_key(e.target.value)}
      />
    </div>
  )
}
