// 'use client';

// import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
// import Toast from '@/components/Toast/Toast';
// import { useToast } from '@/components/Toast/ToastsContext';
// import { Container } from '@mui/material';
// import { useNetwork } from 'wagmi';

// // @dev chainId: for selecting Blockchain Explorer
// export default function ExampleToast() {
//     const { toastError, toastSuccess } = useToast();
//     const { chain } = useNetwork();
//     function handleToast() {
//         try {
//             toastSuccess(
//                 'Success',
//                 <DescriptionWithTx txChainId={chain.id} txHash="0xsdlfksjadkfsldkfj">
//                     Other description will goes here
//                 </DescriptionWithTx>,
//             );
//         } catch (error) {
//             console.error(error);
//         }
//     }
//     function handleToastError() {
//         try {
//             toastError(
//                 'Error',
//                 <DescriptionWithTx txChainId={chain.id} txHash="0xsdlfksjadkfsldkfj">
//                     Other description will goes here
//                 </DescriptionWithTx>,
//             );
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     return (
//         <>
//             {/* <Toast /> */}
//             <button onClick={handleToast}>Toast Success</button>
//             <br />
//             <button onClick={handleToastError}>Toast Error</button>
//         </>
//     );
// }
