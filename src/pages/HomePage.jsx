import React, { useState, useEffect } from "react";
import { getProducts } from "../apis/ApiProducts.js";
import { Container, Typography, Card, CardContent, Button, Box } from "@mui/material";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const isLoggedIn = Boolean(localStorage.getItem("user"));

    useEffect(() => {
        getProducts()
            .then(data => {
                setProducts(data);
            })
            .catch(e => {
                setProducts([]);
            });
    }, []);

    return (
        <Container maxWidth="md">
            <Box display="flex" justifyContent="flex-end" mt={2}>
                {!isLoggedIn && (
                    <>
                        <Button variant="outlined" sx={{ mr: 1 }}>Login</Button>
                        <Button variant="contained">Register</Button>
                    </>
                )}
            </Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Danh sách sản phẩm
            </Typography>
            {products.length === 0 && (
                <Typography>Chưa có sản phẩm nào.</Typography>
            )}
            {products.map(product => (
                <Card key={product.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                            Giá: {product.price.toLocaleString()}đ | Tồn kho: {product.stock}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Mô tả: {product.description}
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                            Tạo lúc: {new Date(product.createdAt).toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
}
