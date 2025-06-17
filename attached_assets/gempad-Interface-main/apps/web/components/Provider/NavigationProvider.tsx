'use client';

import * as React from 'react';

export const NavigationContext = React.createContext({
    openSidebar: false,
    setOpenSidebar: (value: boolean) => {},
});

export const NavigationProvider = ({ children }: any) => {
    const [openSidebar, setOpenSidebar] = React.useState(false);
    return (
        <NavigationContext.Provider value={{ openSidebar, setOpenSidebar }}>
            {children}
        </NavigationContext.Provider>
    );
};

export default NavigationProvider;
