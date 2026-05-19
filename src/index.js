const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO ESPECIAL PARA VERCEL NÃO FICAR BRANCO
const options = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
  ]
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, options));

// Rotas
app.use('/pessoas', require('./routes/pessoas'));
app.use('/experiencias', require('./routes/experiencias'));

app.get('/', (req, res) => {
  res.send('API Currículo Express funcionando! Vá para /api-docs');
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));
}