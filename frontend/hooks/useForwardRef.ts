import {ForwardedRef,useEffect,useRef} from 'react'

const useForwardRef = <T,>(
  ref: ForwardedRef<T>,
  initialValue: any = null
) => {
  const targetRef = useRef<T>(initialValue);

  useEffect(() => {
    console.log(ref)
    if (!ref) return;

    if (typeof ref === 'function') {
      ref(targetRef.current);
    } else {
      ref.current = targetRef.current;
    }
  });

  return targetRef;
};

export default useForwardRef