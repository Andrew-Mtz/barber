export const accountStyles = {
  size: {
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 4,
    paddingBottom: 0,
    '@media (max-width: 425px)': {
      width: 'auto',
    },
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
  },
  headerBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'black',
  },
  avatar: {
    margin: 0,
    backgroundColor: 'pink',
  },
  inactiveAvatar: {
    margin: 0,
    backgroundColor: '#EEEDED',
  },
  inactiveText: {
    color: '#EEEDED',
  },
  activeText: {
    color: 'black',
  },
};
