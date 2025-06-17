// import React from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import SecondaryCard from '../Cards/SecondaryCard';
// import images from '../../public/assets/images/images';
// import Image from 'next/image';
// import ArtIcon from 'public/assets/icons/art.svg';
// import RocketIcon from 'public/assets/icons/rocket.svg';
// import HotNFTIcon from 'public/assets/icons/create-token.svg';
// import { GemlaunchToken } from '@/src/gql/graphql';
// import ListCardRow from './ListCardRow';
// import { Address } from 'viem';
// import { erc20ABI } from '@/config/abi/erc20';
// import { useContractReads } from 'wagmi';

// interface  Data {
//     chainId: number;
//     image: string;
//     title: string;
//     desc: string;
// }
// interface ListCardProps {
//     iconText: string;
//     data: Data[];
// }

// const ListCard: React.FC<ListCardProps> = ({ iconText, data }) => {

//     return (
//         <Box sx={{ width: { xs: '100%', md: '354px' } }}>
//             <Box
//                 sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '10px',
//                     mb: '20px',
//                     ml: '20px',
//                 }}
//             >
//                 <ArtIcon fill="#2DFE87" />
//                 <Typography>{iconText}</Typography>
//             </Box>
//             <SecondaryCard px={20} py={25}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                     {data?.map((x, id) => {
//                         return (
//                             <ListCardRow
//                                 key={id}
//                                 chainId={x?.chainId}
//                                 image={x?.image}
//                                 title={x?.title}
//                                 desc={x?.desc}
//                             />
//                         );
//                     })}
//                 </Box>
//             </SecondaryCard>
//         </Box>
//     );
// };

// export default ListCard;
