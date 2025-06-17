'use client';
import { useState } from 'react';
import ConnectWallet from '../Modals/ConnectWallet';
import styles from '@/global.module.css';
import { useAccount } from 'wagmi';
import { shortenAddress } from '../../utils/format';
import ConnectedModal from '../Modals/ConnectedModal';

const Header = () => {
    const { status, address, isConnected, isDisconnected } = useAccount();
    const [modals, setModals] = useState({
        connectWalletOpen: false,
        connectedModalOpen: false,
    });
    const openModal = (modalName: string) => {
        setModals({ ...modals, [modalName]: true });
    };
    const closeModal = (modalName: string) => {
        setModals({ ...modals, [modalName]: false });
    };
    return (
        <>
            <div className={styles.spaceBetween}>
                <div>
                    <h5>BNB mainnet</h5>
                    <p>gem:$$0.0002</p>
                </div>
                <div>
                    {isConnected && (
                        <div onClick={() => openModal('connectedModalOpen')}>
                            {shortenAddress(address)}
                        </div>
                    )}
                    {isDisconnected && (
                        <button onClick={() => openModal('connectWalletOpen')}>
                            <h4>Connect</h4>
                        </button>
                    )}
                </div>
            </div>

            <ConnectWallet
                open={modals.connectWalletOpen}
                setOpen={() => closeModal('connectWalletOpen')}
            />
            <ConnectedModal
                open={modals.connectedModalOpen}
                setOpen={() => closeModal('connectedModalOpen')}
            />
        </>
    );
};

export default Header;
