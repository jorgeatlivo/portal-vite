import { useTranslation } from 'react-i18next';

import { Box, Card, CardMedia, IconButton, Typography } from '@mui/material';
import { IconDownload } from '@tabler/icons-react';

import colors from '@/config/color-palette';

interface FileThumbnailProps {
  fileUrl?: string;
  label: string;
  isExpired?: boolean;
}

const FileThumbnail = ({
  fileUrl,
  label,
  isExpired = false,
}: FileThumbnailProps) => {
  const { t } = useTranslation('shift-claim-list');
  const getFileExtension = (filename: string) => {
    return filename.split('?')[0].split('.').pop()?.toLowerCase() || 'unknown';
  };

  const fileExtension = fileUrl ? getFileExtension(fileUrl) : '';

  return (
    <Card
      sx={{ width: 150, margin: 2, textAlign: 'center', position: 'relative' }}
    >
      {fileUrl ? (
        <Box sx={{ position: 'relative', height: 100 }}>
          <CardMedia
            component={fileExtension === 'pdf' ? 'iframe' : 'img'}
            height="100"
            image={fileUrl}
          />
          {isExpired && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2">
                {t('expired_document_label')}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: colors['Neutral-100'],
            color: colors['Grey-700'],
          }}
        >
          <Typography variant="body2">{t('pending_document_label')}</Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          aria-label="Download"
          onClick={() => {
            if (fileUrl) {
              window.open(fileUrl, '_blank');
            }
          }}
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: 0,
            justifyContent: 'left',
            pr: 1,
            color: fileUrl ? 'inherit' : 'text.secondary',
            bgcolor: '#FFFFFF',
          }}
          disabled={!fileUrl}
        >
          <IconDownload
            color={colors[fileUrl ? 'Primary-500' : 'Grey-400']}
            size={24}
          />
          <Typography
            variant="body2"
            component="div"
            noWrap
            sx={{ marginLeft: 1, color: colors['Text-Default'] }}
          >
            {label}
          </Typography>
        </IconButton>
      </Box>
    </Card>
  );
};

export default FileThumbnail;
