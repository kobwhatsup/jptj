import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Alert, AlertDescription } from "../components/ui/alert"

interface Order {
  id: string
  status: string
  name: string
  phone: string
  address: string
  items: Array<{
    product_id: number
    quantity: number
    price: number
    name: string
    image?: string
  }>
  total_amount: number
}

const statusMessages = {
  "待付款": { message: "等待支付", color: "text-yellow-600" },
  "已付款": { message: "支付成功", color: "text-green-600" },
  "已发货": { message: "商品已发货", color: "text-blue-600" },
  "已取消": { message: "订单已取消", color: "text-red-600" },
  "已退货": { message: "商品已退货", color: "text-gray-600" },
}

export default function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`)
        if (!response.ok) {
          throw new Error("获取订单信息失败")
        }
        const data = await response.json()
        
        if (data.status === "error") {
          throw new Error(data.message || "获取订单信息失败")
        }
        
        setOrder(data)
      } catch (error) {
        console.error("Error fetching order:", error)
        setError(error instanceof Error ? error.message : "获取订单信息失败")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">加载中...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          className="mt-4"
          onClick={() => navigate("/")}
        >
          返回首页
        </Button>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">未找到订单信息</p>
            <Button
              className="mt-4 w-full"
              onClick={() => navigate("/")}
            >
              返回首页
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusInfo = statusMessages[order.status as keyof typeof statusMessages] || {
    message: order.status,
    color: "text-gray-600"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">订单状态</h1>
          
          <div className="mb-6">
            <div className={`text-xl font-semibold ${statusInfo.color}`}>
              {statusInfo.message}
            </div>
            <p className="text-gray-600">订单号: {order.id}</p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">收货信息</h2>
              <div className="space-y-1">
                <p>收货人: {order.name}</p>
                <p>电话: {order.phone}</p>
                <p>地址: {order.address}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">订单明细</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          数量: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      ¥{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">总计:</span>
                <span className="text-xl font-bold">
                  ¥{order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-6"
            onClick={() => navigate("/")}
          >
            返回首页
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
