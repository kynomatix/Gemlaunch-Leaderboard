import React from 'react';

interface Props {
    color?: string;
    opacity?: string;
    mt?: number;
    mb?: number;
}

const Divider = ({ color, opacity, mt, mb }: Props) => {
    return (
        <div
            style={{
                height: '1px',
                background: color ? color : '#FFFFFF',
                opacity: opacity ? opacity : '0.2',
                marginTop: mt ? `${mt}px` : '11px',
                marginBottom: mb ? `${mb}px` : '17px',
            }}
        />
    );
};

export default Divider;
