import { sanitizeDescription } from '@/utils/discriptionFormater';
import { Box, Typography } from '@mui/material';
import React, { useMemo, useRef, useEffect } from 'react';

const DangrousHtmlParagraph = ({ description }: { description: string }) => {
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  // Memoize sanitized description and extract iframe tags
  const { sanitizedDescription, iframeSources } = useMemo(() => {
    if (!description) return { sanitizedDescription: '', iframeSources: [] };

    // Extract iframe tags and their src attributes
    const iframeRegex = /<iframe[^>]*src="([^"]+)"[^>]*><\/iframe>/g;
    const iframeSources: string[] = [];
    let sanitizedDescription = description;

    let match;
    while ((match = iframeRegex.exec(description)) !== null) {
      iframeSources.push(match[1]); // Extract src attribute
      sanitizedDescription = sanitizedDescription.replace(match[0], ''); // Remove iframe from description
    }

    return {
      sanitizedDescription: sanitizedDescription, // Sanitize remaining HTML
      iframeSources,
    };
  }, [description]);

  // Use a ref for iframes to mount them only once
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iframeContainerRef.current) {
      // Clear existing iframes before appending new ones
      iframeContainerRef.current.innerHTML = '';

      // Dynamically append iframes
      iframeSources.forEach((src) => {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.width = '100%';
        iframe.height = '400';
        iframe.title = 'Iframe Content';
        iframe.style.border = 'none';
        iframeContainerRef.current?.appendChild(iframe);
      });
    }
  }, [iframeSources]);

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <Box sx={{ mt: '24px', mb: '10px' }}>
      <Typography
        variant="body1"
        maxWidth={654}
        pr={1}
        fontSize={14}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: showFullDescription ? 'unset' : 3,
          WebkitBoxOrient: 'vertical',
        }}
      >
        <span
          style={{ color: '#fff' }}
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      </Typography>

      {/* Render extracted iframes */}
      <div ref={iframeContainerRef} />

      {sanitizedDescription.length >= 280 && (
        <Typography
          fontSize={12}
          onClick={handleToggleDescription}
          color="primary"
          sx={{
            cursor: 'pointer',
            ':hover': { color: 'lightblue' },
            width: 'fit-content',
          }}
        >
          {showFullDescription ? 'Show less' : 'Show more'}
        </Typography>
      )}
    </Box>
  );
};

export default DangrousHtmlParagraph;
