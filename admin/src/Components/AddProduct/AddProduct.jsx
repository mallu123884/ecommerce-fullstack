// import React from 'react'
// import './AddProduct.css'
// import upload_area from '../../assets/upload_area.svg'
// import { useState } from 'react'

// const AddProduct = () => {

//     const [image,setImage] = useState(false);
//     const [productDetails , setProductDetails] = useState({
//       name:"",
//       image:"",
//       category:"",
//       new_price:"",
//       old_price:""
//     })

//     const imageHandler = (e) =>{
//         setImage(e.target.files[0])
//     }
//     const changeHandler = (e)=>{
//         setProductDetails({...productDetails,[e.target.name]:e.target.value})
//     }

//     const AddProduct = async () =>{
//       console.log(productDetails);
//       let responseData;
//       let product = productDetails;

//       let formData = new FormData();
//       formData.append('product',image);

//       await fetch("http://localhost:4000/upload",{
//         method:'POST',
//         headers:{
//           Accept:'application/json',
//         },
//         body:formData,
//       }).then((resp)=>resp.json()).then((data)=>{responseData=data})

//       if(responseData.success)
//       {
//         product.image = responseData.image_url;
//         console.log(product);
//         await fetch("http://localhost:4000/addproduct",{
//           method:"POST",
//           headers:{
//             Accept:'application/json',
//             'Content-Type':'application/json'
//           },
//           body:JSON.stringify(product),

//         }).then((resp)=>resp.json()).then((data)=>{
//           data.success?alert("Product Adedd"):alert("Failed")
//         })
//       }
//     }

//   return (
//     <div className='add-product'>
//       <div className="addproduct-itemfields">
//         <p>Product Title</p>
//         <input value={productDetails.name}  onChange={changeHandler} type="text" name='name' placeholder='Type here..' />
//       </div>
//       <div className="addproduct-price">
//         <div className="addproduct-itemfields">
//             <p>Price</p>
//             <input value={productDetails.old_price}  onChange={changeHandler} type="text" name="old_price" placeholder='Type here..' />
//         </div>
//         <div className="addproduct-itemfields">
//             <p>Offer Price</p>
//             <input  value={productDetails.new_price}  onChange={changeHandler} type="text" name="new_price" placeholder='Type here..' />
//         </div>
//          </div>
//         <div className="addproduct-itemfields">
//             <p>Product Category</p>
//             <select  value={productDetails.category}  onChange={changeHandler} name="category" className='addproduct-selector'>
//                 <option value="women">women</option>
//                 <option value="men">men</option>
//                 <option value="kids">kids</option>
//             </select>
//         </div>
//         <div className="addproduct-itemfields">
//             <label htmlFor="file-input">
//             <img src={ image? URL.createObjectURL(image):upload_area} alt="" className='addproduct-thummnil-img' />
//             </label>
//             <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
//         </div>
//         <button onClick={()=>{AddProduct()}} className='addproduct-btn'>Add</button>
//     </div>
//   )
// }

// export default AddProduct


import React from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
import { useState } from 'react'

const AddProduct = () => {
    const [image, setImage] = useState(null); // Changed from false to null for better semantics
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women", // Default category
        new_price: "",
        old_price: ""
    });
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const imageHandler = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const changeHandler = (e) => {
        setProductDetails({...productDetails, [e.target.name]: e.target.value});
    };

    const AddProduct = async () => {
        // Validate inputs
        if (!productDetails.name || !productDetails.category || 
            !productDetails.new_price || !productDetails.old_price) {
            alert("Please fill all fields");
            return;
        }

        if (!image) {
            alert("Please select an image");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Upload image
            let formData = new FormData();
            formData.append('product', image);

            const uploadResponse = await fetch("http://localhost:4000/upload", {
                method: 'POST',
                body: formData, // Don't set Content-Type header for FormData, let browser set it
            });

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed: ${uploadResponse.status}`);
            }

            const uploadData = await uploadResponse.json();

            if (!uploadData.success) {
                throw new Error("Image upload failed");
            }

            // 2. Add product with image URL
            const product = {
                ...productDetails,
                image: uploadData.image_url
            };

            const addResponse = await fetch("http://localhost:4000/addproduct", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product),
            });

            const addData = await addResponse.json();

            if (addData.success) {
                alert("Product Added Successfully!");
                // Reset form
                setProductDetails({
                    name: "",
                    image: "",
                    category: "women",
                    new_price: "",
                    old_price: ""
                });
                setImage(null);
            } else {
                alert("Failed to add product");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfields">
                <p>Product Title</p>
                <input 
                    value={productDetails.name}  
                    onChange={changeHandler} 
                    type="text" 
                    name='name' 
                    placeholder='Type here..' 
                />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfields">
                    <p>Price</p>
                    <input 
                        value={productDetails.old_price}  
                        onChange={changeHandler} 
                        type="number"  // Changed to number type
                        name="old_price" 
                        placeholder='Type here..' 
                    />
                </div>
                <div className="addproduct-itemfields">
                    <p>Offer Price</p>
                    <input  
                        value={productDetails.new_price}  
                        onChange={changeHandler} 
                        type="number"  // Changed to number type
                        name="new_price" 
                        placeholder='Type here..' 
                    />
                </div>
            </div>
            <div className="addproduct-itemfields">
                <p>Product Category</p>
                <select  
                    value={productDetails.category}  
                    onChange={changeHandler} 
                    name="category" 
                    className='addproduct-selector'
                >
                    <option value="women">women</option>
                    <option value="men">men</option>
                    <option value="kids">kids</option>
                </select>
            </div>
            <div className="addproduct-itemfields">
                <label htmlFor="file-input">
                    <img 
                        src={image ? URL.createObjectURL(image) : upload_area} 
                        alt="" 
                        className='addproduct-thumbnail-img' 
                    />
                </label>
                <input 
                    onChange={imageHandler} 
                    type="file" 
                    name='image' 
                    id='file-input' 
                    accept="image/*"  // Accept only image files
                    hidden 
                />
            </div>
            <button 
                onClick={AddProduct} 
                className='addproduct-btn'
                disabled={isLoading}  // Disable during loading
            >
                {isLoading ? 'Adding...' : 'Add'}
            </button>
        </div>
    );
}

export default AddProduct;