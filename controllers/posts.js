const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const NotFound = require ("../exceptions/NotFound");
const ValidationError = require("../exceptions/Validation");
const { validationResult  } = require('express-validator');
// libreria per automatizzare lo slug basandosi sul title
const slugify = require("slugify");
function generateSlug(title) {
    return slugify(title, { replacement: '-', lower: true });
  }

async function store (req, res, next) {
let validation = validationResult(req)
if(!validation.isEmpty) {
  return res.status(422).json(validation.array);
}


    const postData = req.body;

    if(!postData.title) {
      next(new ValidationError("Titolo obbligatorio, non trovato"));
    }

    const slug = generateSlug(postData.title);
    const newPost = await prisma.post.create({
        data:{
            title: postData.title,
            slug: slug,
            image: postData.image,
            content: postData.content,
            published: postData.published,
            category: {
              create: {
                name: postData.name
                }
            },
            tags:{
              connect: postData.tags.map(idTag => ({id : idTag}))
            }
          },
            include: {
              category: true,
              tags: true
            }
          })
    
    return res.json(newPost);
}

async function index (req, res) {
    const data = await prisma.post.findMany({
      include: {
        category: true,
        tags: true
      }
    });
    res.json(data);
    
}

async function show (req, res) {
    const dataBySlug = await prisma.post.findUnique({
        where: {
          slug: req.params.slug  
        }
    })
    if(!dataBySlug) {
      next(new NotFound("Post non trovato"));
    };
    res.json(dataBySlug);
    
}

async function showByFilter (req, res) {
    const filter = req.query.filter;
    const queryfilters = {};

    if(filter && filter.title) {
      queryfilters.title = {
        contains: filter.title
      }
    };
    if(filter && filter.published) {
      queryfilters.published = {
        equals: filter.published === "true"
      }
    };
    const Data = await prisma.post.findMany({
        where: 
            queryfilters
        
    })
    res.json(Data);

}

async function update(req, res) {
  const slug = req.params.slug;
  const dataInComing = req.body;

  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!post) {
    throw new Error('Not Found 404');
  }

  // Aggiornamento dello slug
  const updatedSlug = generateSlug(dataInComing.title);

  const updatePost = await prisma.post.update({
    data: {
      ...dataInComing,
      slug: updatedSlug,
    },
    where: {
      slug: slug,
    },
  });

  res.json(updatePost);
}


async function destroy (req, res) {
    const deletedData = await prisma.post.delete({
        where: {
            slug: req.params.slug
        }
    })
    res.json(deletedData);
}

module.exports = {
    store,
    index,
    show,
    showByFilter,
    update,
    destroy
}