const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

// Importa i middleware personalizzati
const errorHandler = require("./middleware/errorHandler");
const RouteNotFound = require("./middleware/routeNotFound");

// Importa le route
const usersRouter = require("./routers/auth");
const postsRouter = require("./routers/posts");
const tagsRouter = require("./routers/tag");
const categoriesRouter = require("./routers/category");

const port = process.env.PORT || 3000; // Utilizza la porta specificata nell'ambiente o la porta 3000 se non è definita
const app = express();

// Middleware per consentire a qualsiasi dominio di accedere alle API (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Consenti a qualsiasi dominio
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Metodi consentiti
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Intestazioni consentite
  next();
});

// Middleware per il parsing del body
app.use(express.json());

// Definizioni delle route
app.use("/tags", tagsRouter);
app.use("/categories", categoriesRouter);
app.use("", usersRouter); // Nota: Qui sembra che stai gestendo le route principali, assicurati che sia corretto
app.use("/posts", postsRouter);

// Middleware per gestire route non trovate
app.use(RouteNotFound);

// Middleware per gestire errori
app.use(errorHandler);

// Avvia il server
app.listen(port, () => {
    console.log(`Il server è in ascolto sulla porta ${port}`);
});
