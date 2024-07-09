import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProductList() {
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchProduct = () => {
    axios
      .get("https://reemkhalid2-app-40072ad251d5.herokuapp.com/api/product")
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  }

  const fetchCategories = (CategoryID) => {
    if (CategoryID === '0') {
      fetchProduct();
    } else {
      axios
        .get(`https://reemkhalid2-app-40072ad251d5.herokuapp.com/api/product/category/${CategoryID}`)
        .then((response) => {
          setProduct(response.data);
        })
        .catch((error) => {
          alert("Error: " + error);
        });
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    fetchCategories(event.target.value);
  };

  const filteredProducts = product.filter((product) => {
    return (
      product.ProductName.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === '' || selectedCategory === '0' || product.CategoryID === parseInt(selectedCategory))
    );
  });

  return (
    <Container className="mt-4">
      <Form className="mb-3">
        <Form.Group controlId="search">
          <Form.Label>Search Products</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by product name"
            value={search}
            onChange={handleSearch}
          />
        </Form.Group>

        <Form.Group controlId="category">
          <Form.Label>Filter by Category</Form.Label>
          <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="0">All Categories</option>
            <option value="1">Phones</option>
            <option value="2">Tablets</option>
            <option value="3">Laptops</option>
          </Form.Select>
        </Form.Group>
      </Form>

      <Row>
        {filteredProducts.map((product) => (
          <Col key={product.ProductID} sm={12} md={6} lg={3} className="mb-4">
            <Card className="h-100">
              <Card.Img variant="top" src={`uploadFile/${product.ProductImage}`} alt={product.ProductName} className="img-fluid"/>
              <Card.Body>
                <Card.Title>{product.ProductName}</Card.Title>
                <Card.Text>
                  <strong>Price: </strong>{product.ProductPrice} OMR
                </Card.Text>
                <Card.Text>
                  {product.ProductDescription}
                </Card.Text>
                <Button variant="primary">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProductList;
