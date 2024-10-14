import { loadingStyles } from './loading.style';

const Loading = () => {
  return (
    <div style={loadingStyles.container}>
      <img
        src="/scissors.svg"
        alt="Loader con tijeras"
        className="scissor-svg"
      />
      <div style={loadingStyles.text}>CARGANDO...</div>
    </div>
  );
};

export default Loading;
