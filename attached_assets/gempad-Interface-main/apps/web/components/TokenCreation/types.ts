import { CreateTokenInput } from '@/app/(application)/create-token/types';
import { Address } from 'viem';
import React from 'react';
import { UseFormReset } from 'react-hook-form';

export interface TokenCreationProps {
    address: Address;
    txHash: string;
    data: CreateTokenInput;
    setShowTokenCreation: React.Dispatch<React.SetStateAction<boolean>>;
    reset: UseFormReset<CreateTokenInput>
}
