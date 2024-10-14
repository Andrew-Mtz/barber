import { Box, Skeleton } from '@mui/material';

const ListItemSkeleton = () => {
  return (
    <Box
      sx={{
        maxWidth: 260,
        minWidth: 260,
        height: 360,
        borderRadius: '10px',
        bgcolor: 'white',
      }}
    >
      <Skeleton sx={{ height: '70%', transform: 'scale(1,1)' }} />
      <Box sx={{ p: 3 }}>
        <Skeleton width="60%" height="20px" sx={{ mb: 1.5 }} />
        <Skeleton width="80%" height="15px" />
      </Box>
    </Box>
  );
};

export default ListItemSkeleton;
