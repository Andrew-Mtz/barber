export const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    borderRadius: '10px',
  },
  card: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ffffff',
    textAlign: 'left',
    borderRadius: '0.5rem',
    width: '500px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  header: {
    padding: '1.25rem 1rem 1rem 1rem',
    backgroundColor: '#ffffff',
  },
  image: {
    display: 'flex',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#FEE2E2',
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '3rem',
    height: '3rem',
    borderRadius: '9999px',
  },
  content: {
    marginTop: '0.75rem',
    textAlign: 'center',
  },
  title: {
    color: '#111827',
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: '2.5rem',
  },
  message: {
    color: '#6B7280',
    fontSize: '0.875rem',
    lineHeight: '2.5rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0.75rem 1rem',
    backgroundColor: '#F9FAFB',
  }
}