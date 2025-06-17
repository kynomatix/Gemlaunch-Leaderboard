'use client';

// import React from 'react';
// import { Box, Typography } from '@mui/material';
// import ServiceCard from '@/components/ServiceCard/ServiceCard';
// import Icon from 'public/assets/icons/home.svg';
// import { serviceCards } from '@/constants';

// const Services = () => {
//     return (
//         <Box
//             sx={{
//                 display: 'flex',
//                 alignItems: 'flex-start',
//                 columnGap: '32px',
//                 rowGap: '100px',
//                 flexWrap: 'wrap',
//                 justifyContent: 'space-between',
//                 mt: '100px',
//             }}
//         >
//             {serviceCards.map(({ id, ...rest }) => (
//                 <ServiceCard key={id} {...rest} />
//             ))}
//         </Box>
//     );
// };

// export default Services;

import React from 'react';
import { Grid } from '@mui/material';
import ServiceCard from '@/components/ServiceCard/ServiceCard';
import { serviceCards } from '@/constants';

const Services = () => {
    return (
        <Grid
            container
            spacing={4}
            sx={{
                mt: { xs: 2, md: 4 }, // Responsive top margin
                // mx: 'auto',
            }}
        >
            {serviceCards.map(({ id, ...rest }) => (
                <Grid
                    item
                    key={id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <ServiceCard {...rest} />
                </Grid>
            ))}
        </Grid>
    );
};

export default Services;
