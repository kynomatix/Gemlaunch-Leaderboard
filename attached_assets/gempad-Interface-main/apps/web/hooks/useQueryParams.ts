'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function useQueryParams() {
    const router = useRouter();
    const [queryParams, setQueryParams] = useState({});

    useEffect(() => {
        const params = router.query;
        const parsedParams = {};

        // Loop through the query parameters and parse them into an object
        for (const key in params) {
            if (Object.hasOwnProperty.call(params, key)) {
                // If the parameter is an array, use the first value
                if (Array.isArray(params[key])) {
                    parsedParams[key] = params[key][0];
                } else {
                    parsedParams[key] = params[key];
                }
            }
        }

        setQueryParams(parsedParams);
    }, [router.query]);

    return queryParams;
}
