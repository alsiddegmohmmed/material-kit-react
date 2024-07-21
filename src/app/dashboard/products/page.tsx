import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import Link from 'next/link';
import { LatestProductsContainer } from '../../../components/dashboard/overview/latest-products';

export default function page(): React.ReactElement {
  return (
    <Stack>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Products</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Link href="/dashboard/products/new">
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
              Add
            </Button>
          </Link>
        </div>
      </Stack>
      <LatestProductsContainer />
    </Stack>
  );
}