import { useState } from 'react';
import { useProducts, useCreateOrder } from '../hooks';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function Products() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState<Array<{ productId: number; quantity: number }>>([]);

  const { data, isLoading } = useProducts({ page, limit: 20, search: search || undefined });
  const createOrder = useCreateOrder();

  const handleAddToCart = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      await createOrder.mutateAsync({ items: cart });
      setCart([]);
      toast.success('Order placed successfully!');
    } catch (error) {
      // Error handling done in mutation
    }
  };

  const products = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={() => setCart([])} variant="outline" size="sm">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart ({cart.length})
          </Button>
        </div>
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                return (
                  <div key={item.productId} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-medium">
                      {product?.name}
                    </span>
                    <span className="text-muted-foreground">
                      x{item.quantity}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFromCart(item.productId)}
                      >
                        Remove
                      </Button>
                      <span className="text-sm">
                        ${((parseFloat(product?.price || '0') * item.quantity).toFixed(2))}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-between">
              <div className="font-bold">
                Total: $
                {cart
                  .reduce(
                    (sum, item) => {
                      const product = products.find((p) => p.id === item.productId);
                      return sum + parseFloat(product?.price || '0') * item.quantity;
                    },
                    0
                  )
                  .toFixed(2)}
              </div>
              <Button onClick={handleCheckout} size="lg" className="min-w-32">
                Checkout
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="h-80">
              <CardContent className="flex items-center justify-center h-full">
                <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
                  Loading...
                </div>
              </CardContent>
            </Card>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No products found. Try adjusting your search.
          </div>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Plus className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  {!product.active && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ${product.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Stock: {product.stock}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full"
                    disabled={!product.active}
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
