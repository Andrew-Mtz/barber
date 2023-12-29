import { Container } from '@mui/material'

export const ValidationContext = ({ children }) => {

  console.log('context')

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '15vh',
    width: '100%',
    overflow: 'hidden'
  }

  return (
    <Container sx={containerStyle}>
      {children}
    </Container>
  )
}