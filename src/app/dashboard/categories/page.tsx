import { LatestCategoriesContainer } from '@/components/dashboard/categories/LatestCategories'

import React from 'react'
import Stack from '@mui/material/Stack';

export default function page() {
  return (
    <Stack spacing={3}>

    <LatestCategoriesContainer />
    </Stack>
  )
}
