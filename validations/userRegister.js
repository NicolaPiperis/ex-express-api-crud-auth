const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
/**
 * @type {import("express-validator").Schema}
 */

module.exports = {
    name: {
        in : ["body"],
        notEmpty: {
            options: {
                ignore_whitespace: true
            },
            errorMessage: "Nome obbligatorio"
        }, 
        isLength: {
            options: {
                min: 2
            },
            errorMessage : "Il nome deve avere almeno la lunghezza minima di 2 caratteri"
        }
    },
    email : {
        in: ["body"],
        isEmail: true,
        errorMessage: "Formato email non supportato, riprova",
        custom: {
            // value è il valore dell'email. Viene passata automaticamente da express-validator
            options: async (value) => {
              // Cerco se esiste a db un utente con la stessa email
              const alreadyExists = await prisma.user.findUnique({
                where: {
                  email: value,
                },
              });
      
              // Se alreadyExists ha un valore, vuol dire che la mail esiste già
              if (alreadyExists) {
                return Promise.reject("L'email inserita è già in uso");
              }
      
              return true;
            },
          }
    }, 
    password : {
        isStrongPassword : {
            options : {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }
        },
        errorMessage : "La password deve contenere almeno 8 caratteri, una maiuscola, un numero ed un simbolo"
    }
}