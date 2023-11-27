const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function index (req, res) {

    const data = await prisma.tag.findMany();
    res.json(data);

}

async function store (req, res) {
    const tagData = req.body;
    const newTag = await prisma.tag.create({
        data: {
            name: tagData.name
        }
    })
    res.json(newTag);
}

module.exports = {
    index,
    store
}