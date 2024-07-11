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

export interface Category {
  id: string;
  name: string;
  parent?: { name: string };
  updatedAt: Date;
}

export interface LatestCategoriesProps {
  categories?: Category[];
  sx?: SxProps;
}

export function LatestCategories({ categories = [], sx }: LatestCategoriesProps): React.JSX.Element {
  return (
    <>
    
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Create New Category</InputLabel>
                <OutlinedInput placeholder='New Category' label="First name" name="firstName" />
              </FormControl>
            </Grid>
           
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select defaultValue="No Parent Category" label="State" name="state" variant="outlined" placeholder='parent Category'>
                  {categories.map((category) => (
                    <MenuItem  key={category.id} value={category.id}>{category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">Save details</Button>
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
            <IconButton edge="end">
              <DotsThreeVerticalIcon weight="bold" />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
    </>
  );
}

export const LatestCategoriesContainer = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data.map((category: any) => ({
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

  return <LatestCategories categories={categories} />;
};
