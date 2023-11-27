const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { matchedData } = require("express-validator");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");


async function login (req, res) {

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