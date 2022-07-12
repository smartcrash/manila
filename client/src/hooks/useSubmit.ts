import { FormEvent, FormEventHandler, useCallback, useState } from "react";

const useSubmit = <T extends (event: FormEvent<HTMLFormElement>) => Promise<void>>(asyncFunction: T) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null);

  const execute: FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault()

    setLoading(true)
    setError(null);

    asyncFunction(event)
      .catch(error => setError(error))
      .finally(() => setLoading(false))
  }, [asyncFunction]);

  return { handleSubmit: execute, loading, error };
};

export default useSubmit
