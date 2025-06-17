// 'use client';

// import { ReactNode } from 'react';

// export const toastTypes = {
//     SUCCESS: 'success',
//     ERROR: 'error',
//     WARNING: 'warning',
//     INFO: 'info',
// };

// export type Types = (typeof toastTypes)[keyof typeof toastTypes];

// export interface ToastData {
//     id: string;
//     type: Types;
//     title: string;
//     description?: ReactNode;
// }

// export interface ToastContainerProps {
//     toasts: ToastData[];
//     stackSpacing?: number;
//     ttl?: number;
//     onRemove: (id: string) => void;
// }

// export interface ToastProps {
//     toast: ToastData;
//     onRemove: ToastContainerProps['onRemove'];
//     ttl?: number;
//     style?: Partial<CSSStyleDeclaration>;
// }
