import React from 'react';
import RowLoader from './RowLoader';

const TableSkeleton = () => {
    return (
        <>
            {[1, 2, 3, 4, 5].map((x) => (
                <RowLoader key={x} />
            ))}
        </>
    );
};

export default TableSkeleton;
