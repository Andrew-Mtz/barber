import React from 'react'
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Barber = ({ onSelect, url, name, lastName, description, id, selected }) => {
  return (
    <Card sx={{ maxWidth: 260, borderRadius: '10px' }} onClick={() => onSelect(id, name, lastName)}>
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
            {selected && <CheckCircleOutlineIcon sx={{ color: '#1976d2' }} />}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default Barber