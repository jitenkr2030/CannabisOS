// Fallback database connection for development
export const db = {
  user: {
    findMany: () => [],
    findUnique: () => null,
    create: () => null,
    update: () => null,
    delete: () => null,
  },
  product: {
    findMany: () => [],
    findUnique: () => null,
    create: () => null,
    update: () => null,
    delete: () => null,
  },
  sale: {
    findMany: () => [],
    findUnique: () => null,
    create: () => null,
    update: () => null,
    delete: () => null,
  },
  // Add more models as needed
}
