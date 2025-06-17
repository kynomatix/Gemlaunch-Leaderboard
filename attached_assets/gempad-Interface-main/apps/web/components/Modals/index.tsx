'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

interface IModal {
    children: React.ReactNode;
    title: string;
    openModal: boolean;
    onClose: () => void;
    maxWidth?: number;
}
export interface IModalState {
    open: boolean;
    setOpen: (boolean: boolean) => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function MainModal({
    children,
    title = 'Modal',
    openModal,
    onClose,
    maxWidth,
}: IModal) {
    return (
        <div>
            <BootstrapDialog
                onClose={onClose}
                aria-labelledby="customized-dialog-title"
                open={openModal}
                disableScrollLock
                PaperProps={{
                    style: {
                        position: 'relative',
                        boxShadow: 'none',
                        width: '100%',
                        margin: '1rem',
                        backgroundColor: 'rgba(49, 77, 71)',
                        maxWidth: maxWidth ? `${maxWidth}%` : '464px',
                    },
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, color: '#fff' }} id="customized-dialog-title">
                    {title}
                </DialogTitle>

                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent dividers>{children}</DialogContent>
            </BootstrapDialog>
        </div>
    );
}
