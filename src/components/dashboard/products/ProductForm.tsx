/* eslint-disable*/

import { useRouter } from 'next/router';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { ReactSortable } from 'react-sortablejs';


interface Category {
  _id: string;
  name: string;
  properties: { name: string; values: string[] }[];
  parent?: Category;
}

interface ProductFormProps {
  _id?: string;
  title?: string;
  description?: string;
  price?: number;
  images?: string[];
  category?: string;
  properties?: Record<string, string>;
}

const ProductForm: React.FC<ProductFormProps> = ({
  _id,
  title: existingTitle = '',
  description: existingDescription = '',
  price: existingPrice = '',
  images: existingImages = [],
  category: assignedCategory = '',
  properties: assignedProperties = {},
}) => {
  const [title, setTitle] = useState(existingTitle);
  const [description, setDescription] = useState(existingDescription);
  const [price, setPrice] = useState(existingPrice);
  const [category, setCategory] = useState(assignedCategory);
  const [productProperties, setProductProperties] = useState<Record<string, string>>(assignedProperties);
  const [images, setImages] = useState<string[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }, []);

  const saveProduct = async (ev: FormEvent) => {
    ev.preventDefault();
    const data = {
      title,
      description,
      price: Number(price), // Ensure price is a number
      images,
      category: category || null, // Convert empty category to null
      properties: productProperties,
    };
    console.log('Form Data:', data); // Log form data

    try {
      if (_id) {
        await axios.put('/api/products', { ...data, _id });
      } else {
        await axios.post('/api/products', data);
      }
      router.push('/products'); // Redirect to products page upon successful creation
    } catch (err) {
      console.error('Error:', err.response?.data || err.message); // Log detailed error message
      setError('An error occurred while creating the product. Please try again.');
    }
  };

  const uploadImages = async (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setImages((oldImages) => [...oldImages, ...res.data.links]);
      setIsUploading(false);
    }
  };

  const updateImagesOrder = (images: string[]) => {
    setImages(images);
  };

  const setProductProp = (propName: string, value: string) => {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  };

  const propertiesToFill: { name: string; values: string[] }[] = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    if (catInfo) {
      propertiesToFill.push(...catInfo.properties);
      while (catInfo?.parent?._id) {
        const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
        if (parentCat) {
          propertiesToFill.push(...parentCat.properties);
          catInfo = parentCat;
        }
      }
    }
  }

  return (
    <form onSubmit={saveProduct}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <label>Product Name</label>
      <input
        type="text"
        placeholder="Product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>

      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p, index) => (
          <div className="flex gap-1" key={index}>
            <div>{p.name}</div>
            <select value={productProperties[p.name]} onChange={(ev) => setProductProp(p.name, ev.target.value)}>
              {p.values.map((v, vIndex) => (
                <option key={vIndex} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        ))}

      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap gap-1">
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="h-24">
                <img src={link} alt="Uploaded Image" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 p-1 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 3v13.5M12 3l4.5 4.5M12 3l-4.5 4.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>

      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />

      <label>Price</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />

      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
};

export default ProductForm;
