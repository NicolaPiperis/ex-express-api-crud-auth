const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function index (req, res) {

    const dataCategory = await prisma.category.findMany();
    res.json(dataCategory);

}

async function store (req, res) {

    const datiCategoryInIngresso = req.body;
    const newCategory = await prisma.category.create({
        data: {
            name: datiCategoryInIngresso.name
        }
    });
    res.json(newCategory);
    
}

module.exports = {
    index,
    store
}