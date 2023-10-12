import express, { static as expressStatic } from 'express';
import path from 'path';
import cors from 'cors';
import * as url from 'url';
const app = express();
import multer, { diskStorage } from 'multer';

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};
app.use(cors(corsOptions));

// Configurar el almacenamiento de archivos con multer
const storage = diskStorage({
  destination: function (req, file, cb) {
    const tipo = req.body.tipo || 'default'; // Valor predeterminado si no se proporciona "tipo"
    const directorio = path.join('public/uploads', tipo);
    cb(null, directorio);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Ruta para subir una imagen
app.post('/upload', upload.single('image'), (req, res) => {
  // Aquí puedes guardar la URL de la imagen en tu base de datos
  const imageUrl = '/uploads/' + (req.body.tipo || 'default') + '/' + req.file.filename;
  // Realiza la lógica necesaria para vincular la imagen a un registro en la base de datos
  // ...
  res.status(200).json({ imageUrl });
});

// Obtener la ruta completa al directorio actual
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// Ruta para acceder a las imágenes
app.use('/uploads', expressStatic(path.join(__dirname, 'public', 'uploads')));

// Tu aplicación de Express escucha en un puerto específico
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
  console.log(`El directorio actual es ${__dirname}`);
});
