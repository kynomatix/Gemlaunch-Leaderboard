import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import CopyIcon from 'public/assets/icons/copy.svg';

const CopyableElement = ({ value }: { value: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value); // Copy the value to the clipboard
        setCopied(true); // Set copied state to true
        setTimeout(() => setCopied(false), 1000); // Reset copied state after 1 second
    };

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div onClick={handleCopy} style={{ cursor: 'pointer' }}>
            {copied ? <FaCheck size="16px" color="#22CDA6" /> : <CopyIcon color="#22CDA6" />}{' '}
            {/* Display the appropriate icon based on copied state */}
        </div>
    );
};

export default CopyableElement;
