import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Image, Alert, Table, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert";

const Admin = () => {
  const [file, setFile] = useState();
  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [validatedProduct, setValidatedProduct] = useState(false);
  const [ProductName, setProductName] = useState("");
  const [ProductPrice, setProductPrice] = useState(0);
  const [ProductDescription, setProductDescription] = useState("");
  const [ProductId, setProductId] = useState(0);
  const [CategoryID, setCategoryID] = useState(0);
  const [ProductImage, setProductImage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    setProductImage(event.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `https://reemkhalid-react-671eff0d960d.herokuapp.com/uploadFile`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    try {
      await axios.post(url, formData, config);
      const response = await axios.post("https://reemkhalid2-app-40072ad251d5.herokuapp.com/api/product", {
        ProductName,
        ProductPrice,
        ProductDescription,
        CategoryID,
        ProductImage
      });
      setSuccessMessage("Product uploaded successfully");
      setErrorMessage("");
      setFile(null);
      setPreview(null);
      fetchProducts();
    } catch (error) {
      console.error("Error uploading product:", error);
      setErrorMessage("Error uploading product");
      setSuccessMessage("");
    }
  };

  const fetchProducts = () => {
    axios
      .get("https://reemkhalid2-app-40072ad251d5.herokuapp.com/api/product")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setErrorMessage("Error fetching products");
      });
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setValidatedProduct(false);
  };

  const handleShowEditProduct = (id) => {
    setProductId(id);
    setShowProductModal(true);
    getProductEdit(id);
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidatedProduct(true);
    ModifyProduct(ProductId);
  };

  const getProductEdit = async (id) => {
    try {
      const response = await axios.get(`https://reemkhalid2-app-40072ad251d5.herokuapp.com/api/product/${id}`);
      const product = response.data[0];
      setProductName(product.ProductName);
      setProductPrice(product.ProductPrice);
      setProductDescription(product.ProductDescription);
      setCategoryID(product.CategoryID);
      setProductImage(product.ProductImage);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setErrorMessage("Error fetching product details: " + error.message);
    }
  };

  const ModifyProduct = async (id) => {
    try {
      await axios.put(`https://reemkhalid2-app-40072ad251d5.herokuapp.com/api/product/${id}`, {
        ProductName,
        ProductPrice,
        ProductDescription,
        CategoryID,
        ProductImage,
      });
      handleCloseProductModal();
      fetchProducts();
    } catch (error) {
      console.error("Error modifying product:", error);
      setErrorMessage("Error modifying product: " + error.message);
    }
  };

  const DeleteProduct = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`https://reemkhalid2-app-40072ad251d5.herokuapp.com/api/product/${id}`);
          fetchProducts();
        } catch (error) {
          console.error("There was an error deleting the product!", error);
          setErrorMessage("Error deleting product: " + error.message);
        }
      }
    });
  };


  
  return (
    <div className="container">
      <Form onSubmit={handleSubmit}>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form.Group>
          <Form.Label>
            <h3>Add Product</h3>
          </Form.Label>
        </Form.Group>
        <Form.Group>
          <Form.Label>Product Image</Form.Label>
          <Form.Control type="file" onChange={handleChange} />
        </Form.Group>
        {preview && (
          <Image
            src={preview}
            width="200"
            height="200"
            alt="Preview"
            thumbnail
          />
        )}
        <Form.Group>
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            value={ProductName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Product Price</Form.Label>
          <Form.Control
            type="number"
            value={ProductPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Product Description</Form.Label>
          <Form.Control
            type="text"
            value={ProductDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>Choose Category</Form.Label>
          <Form.Select value={CategoryID} onChange={(e) => setCategoryID(e.target.value)}>
            <option value="0">All Categories</option>
            <option value="1">Phones</option>
            <option value="2">Tablets</option>
            <option value="3">Laptops</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" className="mt-2">Save Product</Button>
      </Form>

      <div className="section">
        <h3>List Products</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Product Description</th>
              <th>Product Image</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.ProductID}>
                <td>{p.ProductID}</td>
                <td>{p.ProductName}</td>
                <td>{p.ProductPrice}</td>
                <td>{p.ProductDescription}</td>
                <td>
                  <img
                    src={`/uploadFile/${p.ProductImage}`}
                    alt={p.ProductImage}
                    width="120"
                    height="120"
                  />
                </td>
                <td onClick={() => handleShowEditProduct(p.ProductID)}>
                  <i className="bi bi-pencil-square"></i>
                </td>
                <td onClick={() => DeleteProduct(p.ProductID)}>
                  <i className="bi bi-trash-fill"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showProductModal} onHide={handleCloseProductModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              noValidate
              validated={validatedProduct}
              onSubmit={handleSubmitProduct}
            >
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter product name"
                  value={ProductName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Please Enter a name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Enter price"
                  value={ProductPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Please Enter a price.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter description"
                  value={ProductDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Please Enter a description.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="category">
                <Form.Label>Choose Category</Form.Label>
                <Form.Select value={CategoryID} onChange={(e) => setCategoryID(e.target.value)}>
                  <option value="0">All Categories</option>
                  <option value="1">Phones</option>
                  <option value="2">Tablets</option>
                  <option value="3">Laptops</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Product Image</Form.Label>
                <Form.Control type="file" onChange={handleChange} />
              </Form.Group>
              {preview && (
                <Image 
                  src={preview}
                  width="200"
                  height="200"
                  alt="Preview"
                  thumbnail
                />
              )}
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseProductModal}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Admin;
