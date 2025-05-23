import { Dispatch, SetStateAction } from "react"


interface APIKeyInputProps{
  apiKeyState:[string, Dispatch<SetStateAction<string>>]
}
export default function APIKeyInput({apiKeyState}: APIKeyInputProps) {
  const [API_key,set_API_key] = apiKeyState
  
  return (
    <div>
      <label htmlFor="api-key" className='block'>Key<span className='text-red-600'>*</span></label>
      <input 
        required
        id="api-key"
        className="rounded px-2 w-full bg-slate-50 dark:bg-zinc-800 valid:bg-slate-100 focus:bg-white" 
        type="password"
        value={API_key}
        data-cy="api-key-input"
        onChange={e=>set_API_key(e.target.value)}
      />
    </div>
  )
}