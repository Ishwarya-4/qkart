import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from './Cart.js';
import {generateCartItemsFrom} from './Cart.js';

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const [product,setProduct]=useState([]);
  //all products detail and updated duing search also
  const [loading, setLoading]=useState(false);
  //for circular progress
  const [notFound, setNotFound] = useState(false);
  //for SentimentDissatisfied icon display if product not found
  const [debounceTime, setDebounceTime] = useState(0);
  //to reduce the api calls made
  const [cartProd, setCartProd]= useState([]);
  //to update the products in the cart
  const [productDetail, setProductDetail]= useState([]);
  //all products detail which is unaltered

  useEffect(()=>{
    performAPICall();
  },[]);
  useEffect(()=>{
    fetchCart(localStorage.getItem('token'));
  },[productDetail]);

  const performAPICall = async () => {

    let api=`${config.endpoint}/products`;
    setLoading(true);
    await axios.get(api)
    .then(response=>{
      // console.log(response.data)
      setProduct(response.data);
      setProductDetail(response.data);
      setLoading(false);
    })
    .catch(error=>{
      //console.log(error);
      if(error.response.status>=400){
        enqueueSnackbar(error.response.data.message, {variant: 'error'});
        setLoading(false);
      }
      else
      {
        let msg="Something went wrong. Check that the backend is running, reachable and returns valid JSON.";
        enqueueSnackbar(msg, {variant: 'error'});
      }
    })
   
  };

  //console.log(product)

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
  console.log(text);
  setNotFound(false);
  setLoading(true);
  await axios.get(`${config.endpoint}/products/search?value=${text}`)
  .then((response)=>{
    console.log(response.data);
    setProduct(response.data);
    setLoading(false);
    setNotFound(false);
  })
  .catch((e)=>{
    setNotFound(true);
    setLoading(false);
    enqueueSnackbar("No products found", {variant: 'error'});
  })

  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTime);
    const time = setTimeout(()=>{performSearch(event.target.value)}, debounceTimeout);
    setDebounceTime(time);
  };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      let response= await axios.get(`${config.endpoint}/cart`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },});
        //console.log(response.data);
        // setCartProd(generateCartItemsFrom(response.data, productDetail));
        //let c=
        setCartProd(generateCartItemsFrom(response.data, productDetail));

      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

//console.log(cartProd);
  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for(let i=0;i<items.length;i++)
    {
      if(items[i].productId===productId)
      return true;
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
   const handleQuantity = async (productId,qty,) => {
      try{
        let response=await axios.post(`${config.endpoint}/cart`,{'productId':productId, 'qty':qty},{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },});
          setCartProd(generateCartItemsFrom(response.data, productDetail));
          enqueueSnackbar("Item added to cart", { variant: "success" })
        }
        catch(e){
          if(e.response && e.response.status === 400) {
            enqueueSnackbar(e.response.data.message, { variant: "warning" });
          } else {
            enqueueSnackbar("Could not added product to Cart", { variant: "warning" });
          }
        }
    }



  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(!token){
      enqueueSnackbar("Login to add an item to the Cart", {variant: 'warning'});
    } 
    else{
      if(isItemInCart(items,productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", {variant: 'warning'});
      }
      else{
        try{
        let response=await axios.post(`${config.endpoint}/cart`,{'productId':productId, 'qty':qty},{
          headers: {
            Authorization: `Bearer ${token}`,
          },});
          setCartProd(generateCartItemsFrom(response.data, productDetail));
          enqueueSnackbar("Item added to cart", { variant: "success" })
        }
        catch(e){
          if(e.response && e.response.status === 400) {

            enqueueSnackbar(e.response.data.message, { variant: "warning" });

          } else {

            enqueueSnackbar("Could not added product to Cart", { variant: "warning" });

          }
        }
      }
      // else if(options.preventDuplicate==='handleAdd'){
      //   items[index].qty++;
      // }
      // else{
      //   items[index].qty--;
      // }
  }
  // if(options.preventDuplicate===true){
  //   try{
  //     axios.post(`${config.endpoint}/cart`,{'productId':productId, 'qty':qty},{
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },});
  //   }
  //   catch{}

  // };
  }

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
        className="search-desktop"
        size="small"
        //sx={{width: 300}}
        InputProps={{
          sx:{width: 300},
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event)=>debounceSearch(event,500)}
      />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event)=>debounceSearch(event,500)}
      />
       <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs md >
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India's <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
         <>
         <Grid item md={12} mx={2} my={2}>
         <Grid container spacing={2}>
        {!(loading)?
        ((notFound)?
        // <Grid container alignItems="center" justify="center" direction="column" sx={{height:'50%'}} xs={9}>
        <Grid className='loading' item xs={12} md={12} direction="column">
        <SentimentDissatisfied />
        <br />
        <p>No products found</p>
        </Grid>
        // </Grid>
        :
        product.map((prod)=>
         <Grid item className="product-grid" xs={6} sm={3} md={3} key={prod._id}>
            <ProductCard product={prod} handleAddToCart={() => addToCart(localStorage.getItem('token'),cartProd,productDetail,prod._id,1)}/>
         </Grid>
        ))
      :
        <Grid className='loading' sx={{display:'flex'}} direction="column">
        <CircularProgress/>
        <br/>
        <p align='center'>Loading Products</p>
        </Grid>
      }
      </Grid>
      </Grid>
         </>
         </Grid>
      
        {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
        {(localStorage.getItem("username"))?
        <Grid item sm={12} md={3} my={2} bgcolor ="#E9F5E1">
        <Cart items={cartProd} handleQuantity={handleQuantity}/>
        {/* handleAddToCart={() => addToCart(localStorage.getItem('token'),cartProd,productDetail,prod._id,1)} */}
        </Grid>
        :null
}
        </Grid>
       <br/>
      <Footer />
    </div>
  );
};

export default Products;
