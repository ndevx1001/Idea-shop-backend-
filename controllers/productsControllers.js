import productModel from "../models/productModel.js";



const allowedCategories = [
  "Для девочек",
  "Для мальчиков",
  "Для новорожденных",
  "Канцелярия",
  "Аксессуары",
  "Спорт",
  "Настольные игры",
  "Коляски",
  "Развитие",
  "Конструкторы",
  "Хиты",
  "Новинки",
  "Акции",
  "Популярное",
];

export async function getAllProducts(req, res) {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      tags,
      color,
      name,
      material,
      country_of_origin,
      minWeight,
      maxWeight,
      minRating,
      maxRating,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

   
    const query = {};

    if(search){
     query.name = { $regex: search, $options: "i" };
    }

   
    if (category && allowedCategories.includes(category)) {
      query.category = category;
    }

   
    if (name) {
      query.name = { $regex: name, $options: "i" }; 
    }


  
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if(color){
      query['characteristics.color'] = { $regex: color, $options: "i" };
    }
    
    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagsArray.map((tag) => new RegExp(`^${tag}$`, "i")) };
    }

    if (material) {
      query["characteristics.material"] = material;
    }

  
    if (country_of_origin) {
      query["characteristics.country_of_origin"] = country_of_origin;
    }

   
    if (minWeight || maxWeight) {
      query["characteristics.weight"] = {};
      if (minWeight) query["characteristics.weight"].$gte = minWeight + " kg"; 
      if (maxWeight) query["characteristics.weight"].$lte = maxWeight + " kg";
    }

    
    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = Number(minRating);
      if (maxRating) query.rating.$lte = Number(maxRating);
    }

    
    const skip = (page - 1) * limit;
    let queryBuilder = productModel.find(query);

    
    if (sort) {
      const sortOptions = {
        "price-asc": { price: 1 },
        "price-desc": { price: -1 },
        "rating-asc": { rating: 1 },
        "rating-desc": { rating: -1 },
        "name-asc": { name: 1 },
        "name-desc": { name: -1 },
      };
      queryBuilder = queryBuilder.sort(sortOptions[sort] || { _id: 1 }); 
    }

    const products = await queryBuilder.skip(skip).limit(Number(limit));

    
    const totalProducts = await productModel.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    if (products.length === 0) {
      return res
        .status(404)
        .json({ type: "not found", message: "Товар с такими фильтрами не найден" });
    }
    

    res.json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalProducts,
        limit: Number(limit),
      },
    });
  } catch (err) {
    console.error("Ошибка при получении продуктов:", err);
    res.status(500).json({ error: "Ошибка при получении товаров" });
  }
}


export const getProductsById = async(req, res) => {
  try{
    const { id } = req.params
    if(!id) return res.status(400).json({ type: "Введите id" })
    const product = await productModel.findById(id)
  return res.status(200).json(product)
  } catch(err){
    return res.status(500).json({ type: 'error' })
  }
}




 
