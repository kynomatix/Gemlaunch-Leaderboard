'use client';

import * as React from 'react';
import { toast, ToastBar, Toaster } from 'react-hot-toast';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
export default function DismissableToast() {
    return (
        <div>
            <Toaster
                reverseOrder={false}
                position="top-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        borderRadius: '8px',
                        color: '#fff',
                        minWidth: '300px',
                    },
                }}
            >
                {(t) => (
                    <ToastBar
                        toast={t}
                        style={{ background: t.type === 'success' ? '#253935' : '#E04337' }}
                    >
                        {({ icon, message }) => (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ alignSelf: 'center' }}>{icon}</div>
                                    <div>{message}</div>
                                </div>
                                <div style={{ alignSelf: 'flex-start' }}>
                                    {t.type !== 'loading' && (
                                        <div
                                            onClick={() => toast.dismiss(t.id)}
                                            onKeyDown={(e) => {
                                                // Handle keyboard events if needed
                                                if (e.key === 'Enter' || e.key === 'Space') {
                                                    toast.dismiss(t.id);
                                                }
                                            }}
                                        >
                                            <IconButton>
                                                <CloseIcon
                                                    sx={{ color: '#fff' }}
                                                    fontSize="small"
                                                />
                                            </IconButton>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </ToastBar>
                )}
            </Toaster>
        </div>
    );
}
