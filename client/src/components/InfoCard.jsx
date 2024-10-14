import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const InfoCard = ({ url, title, text }) => {
  return (
    <Card sx={{ maxWidth: 345, height: 360, opacity: 1 }}>
      <CardMedia
        component="img"
        height="150"
        image={url}
        alt={`foto de ${title}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h3">
          {title}
        </Typography>
        <Typography variant="body2" component="p" color="text.secondary">
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
};

InfoCard.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
};

export default InfoCard;
