import { ChainId } from '@dapp/chains';
import { getBlockExploreLink, getBlockExploreName } from '@/utils';
import truncateHash from '@dapp/utils/truncateHash';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import LinkIcon from '@mui/icons-material/Link';
import { useNetwork } from 'wagmi';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

interface DescriptionWithTxProps {
    description?: string;
    txHash?: string;
    txChainId?: number;
    title?: string;
}

const DescriptionWithTx: React.FC<React.PropsWithChildren<DescriptionWithTxProps>> = ({
    txHash,
    txChainId,
    children,
    title,
    description,
}) => {
    const { chainId } = useActiveChainId(); // use this active chainId

    return (
        <div>
            <div>
                {title && (
                    <Typography variant="h5" fontSize={14}>
                        {title}
                    </Typography>
                )}
            </div>
            <div>
                {description && (
                    <Typography variant="body1" fontSize={12}>
                        {description}
                    </Typography>
                )}
            </div>

            {typeof children === 'string' ? (
                <Typography variant="body1" fontSize={12}>
                    {children}
                </Typography>
            ) : (
                children
            )}
            {txHash && (
                <Link
                    target="_blank"
                    rel="noreferrer noopener"
                    href={getBlockExploreLink(txHash, 'transaction', txChainId || chainId)}
                >
                    <Typography sx={{ textDecoration: 'underline' }} fontSize={12} variant="body1">
                        {`View on ${getBlockExploreName(txChainId || chainId)} ${truncateHash(
                            txHash,
                            8,
                            0,
                        )}`}
                        {(txChainId || chainId) === ChainId.BSC && (
                            <LinkIcon color="primary" sx={{ ml: 1 }} />
                        )}
                    </Typography>
                </Link>
            )}
        </div>
    );
};

export default DescriptionWithTx;
