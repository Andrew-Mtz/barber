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

const Haircut = ({ onSelect, url, name, price, description, id, selected }) => {
  return (
    <Card
      sx={{ maxWidth: 260, minWidth: 260, borderRadius: '10px' }}
      onClick={() => onSelect(id, name)}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="250"
          image={url}
          alt="Corte de pelo"
        />
        <CardContent>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>
            {selected && (
              <CheckCircleOutlineIcon sx={{ color: 'var(--primary-color)' }} />
            )}
          </Box>
          <Typography gutterBottom variant="body2" component="div">
            ${price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

Haircut.propTypes = {
  onSelect: PropTypes.func,
  url: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.number,
  description: PropTypes.string,
  id: PropTypes.string,
  selected: PropTypes.bool,
};

export default Haircut;
