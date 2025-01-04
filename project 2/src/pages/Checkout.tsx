import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"

interface CheckoutProps {
  cartItems: any[],
  totalAmount: number,
  clearCart?: () => void
}

export default function Checkout({ cartItems, totalAmount, clearCart }: CheckoutProps) {
  const navigate = useNavigate()
  
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !phone || !address) {
      setError("请填写完整的收货信息")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 生成本地订单号
      const orderId = "order_" + Date.now()
      const orderPayload = {
        id: orderId,
        status: "待付款",
        name,
        phone,
        address,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image
        })),
        total_amount: totalAmount
      }

      // 调用后端创建订单和模拟支付接口
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      })

      if (!resp.ok) {
        throw new Error("创建订单失败")
      }

      const data = await resp.json()
      
      if (data.status === "success") {
        // 支付成功，清空购物车
        clearCart?.()
        // 跳转到订单状态页面
        navigate(`/order-status/${orderId}`)
      } else {
        // 支付失败
        throw new Error("支付失败，请重试")
      }

    } catch (error) {
      console.error("支付处理失败:", error)
      setError(error instanceof Error ? error.message : "支付处理失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">结算</h1>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">收货信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    收货人姓名
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="请输入姓名"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    联系电话
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="请输入手机号码"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    收货地址
                  </label>
                  <Input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="请输入详细地址"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">订单明细</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">¥{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">总计:</span>
                    <span className="text-xl font-bold">¥{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full bg-black hover:bg-gray-800"
              onClick={handleCheckout}
              disabled={loading || !name || !phone || !address}
            >
              {loading ? "处理中..." : "确认订单并支付"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
