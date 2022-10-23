import { useState } from "react";
export const useFetching = (callback) =>{
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fetching = async () =>{
        try{
            setIsLoading(true);
            await callback();
            setError('');
        } catch(e) {
            setError(e.response);
        } finally {
            setIsLoading(false);
        }
    }
    return [fetching, isLoading, error];
}