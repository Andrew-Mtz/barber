export const styles = {
  flipCardInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.8s',
    transformStyle: 'preserve-3d',
  },
  flipCardInnerBack: {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.8s',
    transformStyle: 'preserve-3d',
    transform: 'rotateY(180deg)'
  },
  flipCard: {
    backgroundColor: 'transparent',
    minWidth: '400px',
    minHeight: '450px',
    perspective: '1000px',
    fontFamily: 'sans-serif',
    '@media screen and (max-width: 768px)': {
      minWidth: '330px',
    },
  },
  flipCardFront: {
    boxShadow: '0 8px 14px 0 rgba(0,0,0,0.2)',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
    borderRadius: '1rem',
  },
  flipCardBack: {
    boxShadow: '0 8px 14px 0 rgba(0,0,0,0.2)',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    webkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
    borderRadius: '1rem',
    transform: 'rotateY(180deg)'
  },
  form: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '10px',
    width: '350px',
    minHeight: '350px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxSizing: 'border-box',
    '@media screen and (max-width: 768px)': {
      width: '330px'
    },
  },
  title: {
    fontSize: '30px',
    fontWeight: 600,
    letterSpacing: '-1px',
    lineHeight: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submit: {
    padding: '8px',
    outline: 0,
    border: 0,
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 500,
    color: '#fff',
    cursor: 'pointer',
    mt: 2
  },
  rememberBtnContainer: {
    marginTop: 1.5,
    marginBottom: 2
  }
};