// saveConfig defaults
export const SAVE_CONFIG = {
    refundType: undefined,
    pairToken: undefined,
    amountLimitPerTrade: undefined,
    amountPerBlock: undefined,
    timLimitPerTrade: undefined,
    BlockNumber: undefined,
};

export const placeholder =
    'Insert addresses: \nseparate with breaks line. \nEx: \n0x0A6aD098F65C048d1aa263d38eA174e781ae6899\n0x0A6aD098F65C048d1aa263d38eA174e781ae6899\n0x0A6aD098F65C048d1aa263d38eA174e781ae6899';

export const tableContainerStyles = {
    overflowX: 'auto',
    borderRadius: '15px',
    '::-webkit-scrollbar': {
        height: '2px',
        backgroundColor: 'transparent',
        color: '#fff',
    },
    '::-webkit-scrollbar-thumb': {
        borderRadius: '10px',
        background:
            'linear-gradient(90deg, rgba(255,255,255,0) 2%, #22CDA660 50%, rgba(255,255,255,0) 98%)',
    },
    '::-webkit-scrollbar-track': {
        borderRadius: '10px',
        background: 'transparent',
    },
    mt: '24px',
    backgroundColor: 'transparent',
    boxShadow: 'none',
};
