const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { matchedData } = require("express-validator");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const AuthError = require("../exceptions/AuthError");


async function login (req, res) {
      // Recuperare i dati inseriti dall'utente
  const { email, password } = req.body;

  // controllare che ci sia un utente con quella email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return next(new AuthError("Utente non trovato"));
  }

  // controllare che la password sia corretta
  const passMatch = await bcrypt.compare(password, user.password);

  if (!passMatch) {
    return next(new AuthError("Password errata"));
  }

  // generare il token JWT
  const token = jsonwebtoken.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // ritornare il token ed i dati dell'utente

  // rimuovo la password dall'oggetto user
  delete user.password;

  res.json({ user, token });
}

async function register (req, res) {
    const sanitizedData =  matchedData(req);

    sanitizedData.password = await bcrypt.hash(sanitizedData.password, 10)

   const user = await prisma.user.create({
        data: {
            ...sanitizedData
        }, select : {
            id:true,
            name: true,
            email: true,
            role: true
        }
   })

   const token = jsonwebtoken.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

   res.json({user, token});
}

module.exports = {
    login,
    register
}