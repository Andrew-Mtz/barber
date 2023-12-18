import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import React from 'react'

const InfoCard = ({ url, title, text }) => {
  return (
    <Card sx={{ maxWidth: 345, height: 360, opacity: 1 }}>
      <CardMedia
        component="img"
        height="140"
        image={url}
        alt={`foto de ${title}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoCard