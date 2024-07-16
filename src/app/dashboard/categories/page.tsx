
import React from 'react'
import Stack from '@mui/material/Stack';
import { LatestCategories } from '@/components/dashboard/categories/LatestCategories';

export default function page() {
  return (
    <Stack spacing={3}>

    <LatestCategories />
    </Stack>
  )
}
