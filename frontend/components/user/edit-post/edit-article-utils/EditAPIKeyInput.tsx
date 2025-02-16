
interface EditAPIKeyInput{
  API_keyState:[string, React.Dispatch<React.SetStateAction<string>>]
}
export default function EditAPIKeyInput({API_keyState}: EditAPIKeyInput) {
  const [API_key,set_API_key] = API_keyState
  
  return (
    <div>
      <label htmlFor="api-key" className='block'>Key<span className='text-red-600'>*</span></label>
      <input 
        required
        id="api-key"
        className="rounded px-2 w-full bg-slate-50 dark:bg-zinc-700 valid:bg-slate-100 focus:bg-white" 
        type="password"
        value={API_key}
        data-cy="api-key-input"
        onChange={e=>set_API_key(e.target.value)}
      />
    </div>
  )
}