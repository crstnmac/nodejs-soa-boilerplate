import { Link } from '@tanstack/react-router';
import { useOrders, useCancelOrder } from '../hooks';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { OrderStatus } from '../types';
import { toast } from 'sonner';

export default function Orders() {
  const { data, isLoading } = useOrders({ page: 1, limit: 20 });
  const cancelOrder = useCancelOrder();

  const handleCancel = async (orderId: number) => {
    try {
      await cancelOrder.mutateAsync(orderId);
      toast.success('Order cancelled successfully');
    } catch (error) {
      // Error handling done in mutation
    }
  };

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          icon: Clock,
          color: 'bg-yellow-500',
          text: 'Pending',
        };
      case OrderStatus.PROCESSING:
        return {
          icon: Package,
          color: 'bg-blue-500',
          text: 'Processing',
        };
      case OrderStatus.SHIPPED:
        return {
          icon: Truck,
          color: 'bg-purple-500',
          text: 'Shipped',
        };
      case OrderStatus.DELIVERED:
        return {
          icon: CheckCircle,
          color: 'bg-green-500',
          text: 'Delivered',
        };
      case OrderStatus.CANCELLED:
        return {
          icon: XCircle,
          color: 'bg-red-500',
          text: 'Cancelled',
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-500',
          text: 'Unknown',
        };
    }
  };

  const orders = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Link to="/products">
          <Button variant="outline">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {/* Orders List */}
      <div className="grid gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-64">
              <CardContent className="flex items-center justify-center h-full">
                <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
                  Loading order...
                </div>
              </CardContent>
            </Card>
          ))
        ) : orders.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
                <Package className="h-16 w-16 text-muted-foreground" />
                <div>
                  <h3 className="text-xl font-semibold">No orders yet</h3>
                  <p className="text-muted-foreground">
                    Start shopping to create your first order!
                  </p>
                  <Link to="/products">
                    <Button>Browse Products</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">
                        Order #{order.id}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="mr-1 h-4 w-4" />
                        {statusInfo.text}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Items</h4>
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {item.product?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="flex items-center justify-between p-4 bg-muted rounded">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold">
                      ${order.total}
                    </span>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2 text-sm">
                    {order.shippingAddress && (
                      <div>
                        <span className="text-muted-foreground">Shipping:</span>{' '}
                        <span className="font-medium">{order.shippingAddress}</span>
                      </div>
                    )}
                    {order.paymentMethod && (
                      <div>
                        <span className="text-muted-foreground">Payment:</span>{' '}
                        <span className="font-medium">{order.paymentMethod}</span>
                      </div>
                    )}
                  </div>

                  {/* Cancel Button */}
                  {order.status === OrderStatus.PENDING ||
                   order.status === OrderStatus.PROCESSING ? (
                    <Button
                      variant="destructive"
                      onClick={() => handleCancel(order.id)}
                      className="w-full"
                    >
                      Cancel Order
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Cannot Cancel
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page 1 of {pagination.totalPages}
          </span>
          <Button variant="outline" disabled>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
