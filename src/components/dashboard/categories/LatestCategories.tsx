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
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Category {
  _id?: string;
  properties: { name: string; values: string[] }[];
  name: string;
  parent?: { _id: string; name: string };
  updatedAt: Date;
}
export interface LatestCategoriesProps {
  categories?: Category[];
  sx?: SxProps;
}

interface CategoryResponse {
  _id: string;
  name: string;
  parent?: { _id: string; name: string };
  properties: { name: string; values: string[] }[];
  updatedAt: Date;
}

export function LatestCategories({ sx }: LatestCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState<string | null>(null);
  const [properties, setProperties] = useState<{ name: string; values: string[] }[]>([]);
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: CategoryResponse[] = await response.json();
        setCategories(data.map((category: CategoryResponse) => ({
          _id: category._id,
          name: category.name,
          parent: category.parent ? { _id: category.parent._id, name: category.parent.name } : undefined,
          properties: category.properties,
          updatedAt: category.updatedAt,
        })));
      } catch (error) {
        // console.error('Error fetching categories:', error);
      }
    };
  
    void fetchCategories(); // Explicitly mark as ignored
  }, []);
  
  
  

  const handleSaveCategory = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const baseData = {
      name,
      parent: parentCategory ? { _id: parentCategory, name: categories.find(cat => cat._id === parentCategory)?.name || '' } : undefined,
      properties: properties.map(p => ({ name: p.name, values: p.values })),
    };
  
  
    try {
      if (editedCategory) {
        const data: typeof baseData & { _id: string } = {
          ...baseData,
          _id: editedCategory._id!,
        };
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        setEditedCategory(null);
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(baseData),
        });
      }
      // Refetch categories after saving
      await fetchCategories();
    } catch (error) {
      // console.error('Error saving category:', error);
    }
    setName('');
    setParentCategory(null);
    setProperties([]);
  };
  
  // Refetch categories from server
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: CategoryResponse[] = await response.json();
      setCategories(data.map((category: CategoryResponse) => ({
        _id: category._id,
        name: category.name,
        parent: category.parent ? { _id: category.parent._id, name: category.parent.name } : undefined,
        properties: category.properties,
        updatedAt: category.updatedAt,
      })));
    } catch (error) {
      // console.error('Error fetching categories:', error);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  
  
  const handleEditCategory = (category: Category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent ? category.parent._id : null);
    setProperties(category.properties.map(p => ({ name: p.name, values: p.values })));
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?_id=${categoryId}`, { 
        method: 'DELETE' 
      });

      if (response.ok) {
        setCategories(categories.filter(category => category._id !== categoryId));
      } else {
        // console.error('Error deleting category:', response.statusText);
      }
    } catch (error) {
      // console.error('Error deleting category:', error);
    }
  };

  const handleClickOpen = (categoryId: string) => {
    setCategoryIdToDelete(categoryId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (categoryIdToDelete) {
      await handleDeleteCategory(categoryIdToDelete);
      setOpen(false);
    }
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
                    onChange={(event) => {
                      setName(event.target.value)}}
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Parent Category</InputLabel>
                  <Select
                    label="Parent Category"
                    value={parentCategory || ''} // Ensure empty string if parentCategory is null
                    onChange={(event) => { setParentCategory(event.target.value); }}
                  >
                    <MenuItem value="">No Parent Category</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            {editedCategory ? (
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
            ) : null}
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
            <ListItem divider={index < categories.length - 1} key={category._id}>
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
              <IconButton edge="end" onClick={() => { handleEditCategory(category); }}>
                <DotsThreeVerticalIcon weight="bold" />
              </IconButton>
              <IconButton edge="end" onClick={() => { category._id && handleClickOpen(category._id); }}>
                <DeleteIcon color="error" /> 
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
