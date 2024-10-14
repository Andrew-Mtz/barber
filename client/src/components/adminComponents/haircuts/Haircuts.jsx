import React from 'react';
import { Box } from '@mui/material';
import EditHaircutForm from './EditHaircutForm';
import AddHaircutForm from './AddHaircutForm';
import './haircuts.css';

const baseUrl = process.env.REACT_APP_BASEURL;

const Haircuts = () => {
  const [haircuts, setHaircuts] = React.useState(null);
  const [successfullyEdit, setSuccessfullyEdit] = React.useState(false);
  const [selectedHaircut, setSelectedHaircut] = React.useState(null);
  const [addHaircutActive, setAddHaircutActive] = React.useState(false);

  React.useEffect(() => {
    getHaircuts();
  }, [successfullyEdit]);

  const getHaircuts = async () => {
    try {
      const response = await fetch(`${baseUrl}/haircut`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (data.error !== '') {
        return alert(data.error); //a corregir
      }
      setHaircuts(data.response);
    } catch (error) {
      alert('Error al obtener los cortes de pelo:', error);
    }
  };

  const toggleEdit = haircut => {
    if (selectedHaircut?.id === haircut.id) {
      return setSelectedHaircut(null);
    }
    setSelectedHaircut(haircut);
    setAddHaircutActive(false);
  };

  const addHaircut = () => {
    setAddHaircutActive(!addHaircutActive);
    setSelectedHaircut(null);
  };

  const handleHaircut = (property, event) => {
    setSelectedHaircut(prevHaircut => ({
      ...prevHaircut,
      [property]: event.target.value,
    }));
  };

  return (
    <>
      <Box className="container-btn-choose-haircut">
        {haircuts?.map(haircut => (
          <div
            className={`btn-choose-haircut ${selectedHaircut?.id === haircut.id && 'active'}`}
            key={haircut.id}
            onClick={() => {
              toggleEdit(haircut);
            }}
          >
            {haircut.name}
          </div>
        ))}
        <div
          className={`btn-add-haircut ${addHaircutActive && 'active'}`}
          onClick={() => {
            addHaircut();
          }}
        >
          Agregar +
        </div>
      </Box>
      {selectedHaircut && (
        <EditHaircutForm
          selectedHaircut={selectedHaircut}
          handleHaircut={handleHaircut}
          successfullyEdit={successfullyEdit}
          setSuccessfullyEdit={setSuccessfullyEdit}
        />
      )}
      {addHaircutActive && <AddHaircutForm />}
    </>
  );
};

export default Haircuts;
