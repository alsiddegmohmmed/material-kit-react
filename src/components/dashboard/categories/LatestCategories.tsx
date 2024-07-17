
"use client";
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import type { SxProps } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';




interface Category {
  _id: string;
  properties: never[];
  id: string;
  name: string;
  parent?: { name: string };
  updatedAt: Date;
}

export interface LatestCategoriesProps {
  categories?: Category[];
  sx?: SxProps;
}

export function LatestCategories({ sx }: LatestCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState<string | null>(null);
  const [properties, setProperties] = useState<{ name: string; values: string }[]>([]);
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Category[] = await response.json() as Category[];
        setCategories(data.map((category: Category) => ({
          id: category._id,
          name: category.name,
          parent: category.parent ? { name: category.parent.name } : null,
          updatedAt: category.updatedAt,
        })));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, []);

  const handleSaveCategory = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const data = {
      name,
      parent: parentCategory || null,
      properties: properties.map(p => ({ name: p.name, values: p.values.split(',') })),
    };
  
    try {
      if (editedCategory) {
        data._id = editedCategory.id;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        setEditedCategory(null);
        setCategories(categories.map(cat => cat.id === editedCategory.id ? { ...cat, name: data.name, parent: categories.find(c => c.id === data.parent) } : cat));
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        setCategories([...categories, { ...result, parent: categories.find(c => c.id === result.parent) }]);
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
    setName('');
    setParentCategory(null);
    setProperties([]);
  };

  const handleEditCategory = (category: Category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?.name || null);
    setProperties(category.properties || []);
  };

 
const handleDeleteCategory = async (categoryId: string) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?_id=${categoryId}`, { method: 'DELETE' });
    setCategories(categories.filter(category => category.id !== categoryId));
  } catch (error) {
    console.error('Error deleting category:', error);
  }
};

  const addProperty = () => {
    setProperties([...properties, { name: '', values: '' }]);
  };

  const handlePropertyChange = (index: number, key: string, value: string) => {
    const updatedProperties = properties.map((property, i) => i === index ? { ...property, [key]: value } : property);
    setProperties(updatedProperties);
  };

  const removeProperty = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index));
  };

  return (
    <>
      <form onSubmit={handleSaveCategory}>
        <Card>
          <CardHeader subheader="" title="Categories" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>{editedCategory ? `Edit Category ${editedCategory.name}` : 'Create New Category'}</InputLabel>
                  <OutlinedInput
                    placeholder="Category name"
                    label="Category name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Parent Category</InputLabel>
                  <Select
                    label="Parent Category"
                    value={parentCategory}
                    onChange={(event) => setParentCategory(event.target.value)}
                  >
                    <MenuItem value="">No Parent Category</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            {editedCategory && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditedCategory(null);
                  setName('');
                  setParentCategory(null);
                  setProperties([]);
                }}
              >
                Cancel
              </Button>
            )}
            <Button variant="contained" type="submit">
              Save
            </Button>
          </CardActions>
        </Card>
      </form>
      <Card sx={sx}>
        <CardHeader title="Latest Categories" />
        <Divider />
        <List>
          {categories.map((category, index) => (
            <ListItem divider={index < categories.length - 1} key={category.id}>
              <ListItemAvatar>
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: 'var(--mui-palette-neutral-200)',
                    height: '48px',
                    width: '48px',
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={category.name}
                secondary={`Parent: ${category.parent ? category.parent.name : 'None'}`}
                primaryTypographyProps={{ variant: 'subtitle1' }}
                secondaryTypographyProps={{ variant: 'body2' }}
              />
              <button>
                test
              </button>
              <IconButton edge="end" onClick={() => handleEditCategory(category)}>
                <DotsThreeVerticalIcon weight="bold" />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDeleteCategory(category.id)}>
            
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="inherit" endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />} size="small" variant="text">
            View all
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
