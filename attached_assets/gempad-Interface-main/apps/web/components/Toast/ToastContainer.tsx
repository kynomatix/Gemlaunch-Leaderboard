// import React from 'react';
// import { ToastContainerProps } from '.';
// import Toast from './Toast';
// import { Box } from '@mui/material';
// import styles from '@/global.module.css';

// const ToastContainer: React.FC<React.PropsWithChildren<ToastContainerProps>> = (props) => {
//     if (!props?.toasts?.length) return null;
//     const { toasts, ttl, onRemove } = props;
//     return (
//         <Box className={styles.columnStart}>
//             {toasts.map((toast, index) => {
//                 return <Toast key={toast.id} toast={toast} onRemove={onRemove} ttl={ttl} />;
//             })}
//         </Box>
//     );
// };

// export default ToastContainer;
