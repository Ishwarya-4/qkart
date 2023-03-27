import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
import { useSnackbar } from "notistack";

const ProductCard = ({ product, handleAddToCart }) => {
  
  return (
    <Card className="card">
      <CardContent>
      
      <CardMedia
        component="img"
        size="150"
        image={product.image}
        alt={product.name}
        sx={{objectFit: "contain"}}
      />
      
        <Typography gutterBottom variant="p" component="p" sx={{ m: 2 }}>
         {product.name}
        </Typography>
        <Typography variant="p" sx={{fontWeight:"bold",  mx: 2, my: 2}}>
        ${product.cost}
        </Typography>
        <br/>
        <Rating name="read-only" value={product.rating} readOnly sx={{ my: 2, mx:2}}/>
        <CardActions>
        <Button size="small" variant="contained" fullWidth onClick={handleAddToCart}><AddShoppingCartOutlined/>ADD TO CART</Button>
      </CardActions>
      </CardContent>
      
    </Card>
  );
};

export default ProductCard;
