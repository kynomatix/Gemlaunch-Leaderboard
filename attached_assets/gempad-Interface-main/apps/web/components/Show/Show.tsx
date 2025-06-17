import React from 'react';
import type { PropsWithChildren } from 'react';
import { ReactReduxContextInstance } from 'react-redux/es/components/Context';

interface Props {
    isShow: boolean;
}

const Show = ({ isShow, children }: PropsWithChildren<Props>) => {
    return isShow && <>{children}</>;
};

export default Show;
