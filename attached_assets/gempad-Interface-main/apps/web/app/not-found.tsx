import images from '@/public/assets/images/images';
import { Box, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const styles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '20px',
};

export default function NotFound() {
    return (
        <Box sx={styles}>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '50%',
                }}
            >
                <Image alt="404" src={images.notfound} fill style={{ objectFit: 'contain' }} />
            </Box>
            <Link href="/">
                <Button variant="contained" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                    Back Home
                </Button>
            </Link>
        </Box>
    );
}
