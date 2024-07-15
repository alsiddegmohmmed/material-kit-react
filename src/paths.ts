export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    products: '/dashboard/products', 
    orders: '/dashboard/orders',
    categories: '/dashboard/categories',
    test: '/dashboard/test',
    newproduct: '/dashboard/products/new',
    editproduct: '/dashboard/products/edit'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
