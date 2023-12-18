import React from 'react'
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Haircut = ({ onSelect, name, price, description, id, selected }) => {

  return (
    <Card sx={{ maxWidth: 260 }} onClick={() => onSelect(id, name)}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="250"
          image="https://www.latest-hairstyles.com/wp-content/uploads/edgar-haircuts-1x1-1.jpg"
          alt="Corte de pelo"
        />
        <CardContent>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>
            {selected && <CheckCircleOutlineIcon sx={{ color: '#1976d2' }} />}
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
  )
}

export default Haircut