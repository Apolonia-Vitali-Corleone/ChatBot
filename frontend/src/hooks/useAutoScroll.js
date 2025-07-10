import { useEffect } from 'react';

function useAutoScroll(deps, ref) {
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [deps, ref]);
}

export default useAutoScroll;
