import React from 'react'
import { Box, Button } from '@mui/material';
import './linkBarber&Haircut.css'
import CustomList from './CustomList';

const baseUrl = process.env.REACT_APP_BASEURL

const LinkBarberAndHaircut = () => {
  const [checkedBarber, setCheckedBarber] = React.useState([0]);
  const [originalHaircuts, setOriginalHaircuts] = React.useState([]);
  const [checkedHaircuts, setCheckedHaircuts] = React.useState([]);
  const [barbers, setBarbers] = React.useState([])
  const [haircuts, setHaircuts] = React.useState([])

  React.useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/barbersAndHaircuts`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        const data = await response.json();
        setBarbers(data.barbers);
        setHaircuts(data.haircuts);
        return
      }
      return //setBarbers(response.statusText)
    } catch (error) {
      console.error('Error al obtener los barberos:', error);
    }
  }

  const handleToggleBarber = (id) => {
    if (checkedBarber === id) {
      setCheckedBarber([0])
      return setCheckedHaircuts([])
    }
    setCheckedBarber([id])
    getLinkedHaircuts(id)
  };

  const handleToggleHaircut = (id) => {
    const isHaircutChecked = checkedHaircuts.includes(id);

    if (isHaircutChecked) {
      const updatedHaircuts = checkedHaircuts.filter(haircutId => haircutId !== id);
      setCheckedHaircuts(updatedHaircuts);
    } else {
      const updatedHaircuts = [...checkedHaircuts, id];
      setCheckedHaircuts(updatedHaircuts);
    }
  };

  const getLinkedHaircuts = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/linkedHaircuts?id=${id}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        const data = await response.json();
        setCheckedHaircuts(data)
        setOriginalHaircuts(data)
      }
      return //setBarbers(response.statusText)
    } catch (error) {
      console.error('Error al obtener los barberos:', error);
    }
  }

  const saveChanges = async () => {
    try {
      const body = { barberId: checkedBarber[0], haircutIds: checkedHaircuts, linkedHaircutsIds: originalHaircuts }
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/associateHaircutsWithBarber`, {
        method: "POST",
        headers:
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body)
      })

      const parseRes = await response.json()

      if (response.status === 409) return console.log(parseRes)

      console.log('exito')

    } catch (error) {
      console.log(error)
    }
  }

  const sameArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
  }

  return (
    <Box className='link-lists-container'>
      <CustomList title={'Barberos'} items={barbers} onFunction={handleToggleBarber} checks={checkedBarber} />
      <CustomList title={'Cortes de pelo'} items={haircuts} onFunction={handleToggleHaircut} checks={checkedHaircuts} />
      <Button variant='contained' disabled={sameArrays(originalHaircuts, checkedHaircuts)} onClick={saveChanges}>Guardar cambios</Button>
    </Box>
  )
}

export default LinkBarberAndHaircut