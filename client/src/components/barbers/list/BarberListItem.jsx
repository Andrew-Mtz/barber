import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PropTypes from 'prop-types';

const BarberListItem = ({
  onSelect,
  url,
  name,
  lastName,
  description,
  id,
  selected,
}) => {
  return (
    <Card
      sx={{ maxWidth: 260, minWidth: 260, borderRadius: '10px' }}
      onClick={() => onSelect(id, name, lastName)}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="250"
          image={url}
          alt={`Foto de ${name} ${lastName}`}
        />
        <CardContent>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography gutterBottom variant="h5" component="div">
              {name} {lastName}
            </Typography>
            {selected && (
              <CheckCircleOutlineIcon sx={{ color: 'var(--primary-color)' }} />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

BarberListItem.propTypes = {
  onSelect: PropTypes.func,
  url: PropTypes.string,
  name: PropTypes.string,
  lastName: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.string,
  selected: PropTypes.bool,
};

export default BarberListItem;
