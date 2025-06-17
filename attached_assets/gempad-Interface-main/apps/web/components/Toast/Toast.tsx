// 'use client';

// import * as React from 'react';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
// import { ToastProps, toastTypes } from '.';
// import { Card, IconButton, Typography } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
// import { toast, Toaster, ToastBar } from 'react-hot-toast';
// interface State extends SnackbarOrigin {
//     open: boolean;
// }

// const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// export default function Toast({
//     toast = {
//         id: '',
//         type: '',
//         title: '',
//     },
//     onRemove,
//     style,
//     ttl,
//     ...props
// }: ToastProps) {
//     const timer = React.useRef<number>();
//     const ref = React.useRef(null);
//     const { id, title, description, type } = toast || {};
//     const handleRemove = React.useCallback(() => onRemove(id), [id, onRemove]);
//     const handleMouseEnter = () => {
//         clearTimeout(timer.current);
//     };
//     const handleMouseLeave = () => {
//         if (timer.current) {
//             clearTimeout(timer.current);
//         }
//         timer.current = window.setTimeout(() => {
//             handleRemove();
//         }, ttl);
//     };
//     React.useEffect(() => {
//         const timer = setTimeout(() => {
//             handleRemove();
//         }, ttl);
//         return () => {
//             clearTimeout(timer);
//         };
//     }, [ttl, handleRemove]);
//     const action = (
//         <>
//             <IconButton size="small" aria-label="close" color="inherit" onClick={handleRemove}>
//                 <CloseIcon fontSize="small" />
//             </IconButton>
//         </>
//     );

//     return (
//         <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
//             <Snackbar
//                 anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                 open={!!toast}
//                 action={action}
//                 onClose={handleRemove}
//                 message={
//                     <>
//                         <h5>Title:{title}</h5>
//                         <p>Description: {description}</p>
//                     </>
//                 }
//                 // key={vertical + horizontal}
//             />

//             <Snackbar
//                 anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                 open={!!toast}
//                 action={action}
//                 // transitionDuration={{ enter: 1000, exit: 1000 }}
//                 autoHideDuration={6000}
//             >
//                 <Alert onClose={handleRemove} severity={type as AlertColor} sx={{ width: '100%' }}>
//                     <>
//                         <h3>{title}</h3>
//                         <p>{description}</p>
//                     </>
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// }
