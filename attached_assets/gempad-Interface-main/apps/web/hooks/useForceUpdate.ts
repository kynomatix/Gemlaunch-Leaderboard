import React from 'react';

export default function useForceUpdate() {
    const [, setTick] = React.useState(0);
    const forceUpdate = React.useCallback(() => {
        setTick((tick) => tick + 1);
    }, []);
    return forceUpdate;
}
