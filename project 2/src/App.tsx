import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, Search, Trash2, Star, StarHalf, Heart, Ruler } from 'lucide-react'
import { Image } from "@/components/common/Image"
import { ProductDetail } from '@/pages/ProductDetail'
import Checkout from "@/pages/Checkout"
import OrderStatus from "@/pages/OrderStatus"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Separator } from "@/components/ui/separator"

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface CartItem extends TShirt {
  quantity: number;
}

interface TShirt {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  reviews: Review[];
  tags: string[];
  isWishlisted?: boolean;
  sizes?: {
    chest: number;    // 胸围
    shoulders: number; // 肩宽
    length: number;   // 衣长
    sleeves: number;  // 袖长
  };
  sizeGuide?: {
    cn: string;  // Chinese size
    us: string;  // US size
    eu: string;  // EU size
  };
}

const tshirts: TShirt[] = [
  {
    id: 1,
    name: "街头艺术T恤",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
    description: "街头风格图案设计",
    category: "街头风格",
    sizes: {
      chest: 108,
      shoulders: 45,
      length: 70,
      sleeves: 22
    },
    sizeGuide: {
      cn: "XL",
      us: "L",
      eu: "42"
    },
    reviews: [
      {
        id: 1,
        userName: "小明",
        rating: 5,
        comment: "超爱这种街头风格！",
        date: "2024-02-20"
      },
      {
        id: 2,
        userName: "小红",
        rating: 4,
        comment: "质量很好，尺码很准",
        date: "2024-02-18"
      }
    ],
    tags: ["街头风格", "都市", "图案", "艺术", "现代"]
  },
  {
    id: 2,
    name: "霓虹梦境",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    description: "充满活力的霓虹美学",
    category: "图案设计",
    reviews: [
      {
        id: 1,
        userName: "小李",
        rating: 5,
        comment: "颜色和设计都太棒了！",
        date: "2024-02-19"
      }
    ],
    tags: ["图案", "霓虹", "活力", "现代", "艺术"]
  },
  {
    id: 3,
    name: "简约单色",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop",
    description: "简洁现代的设计",
    category: "基础款",
    reviews: [
      {
        id: 1,
        userName: "小张",
        rating: 5,
        comment: "完美的基础款，质量很好",
        date: "2024-02-15"
      },
      {
        id: 2,
        userName: "小王",
        rating: 4,
        comment: "简单又优雅",
        date: "2024-02-10"
      }
    ],
    tags: ["基础款", "简约", "单色", "必备"]
  },
  {
    id: 4,
    name: "复古乐队T恤",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop",
    description: "经典摇滚乐队风格",
    category: "复古",
    sizes: {
      chest: 106,
      shoulders: 44,
      length: 69,
      sleeves: 21
    },
    sizeGuide: {
      cn: "L",
      us: "M",
      eu: "40"
    },
    reviews: [
      {
        id: 1,
        userName: "小陈",
        rating: 5,
        comment: "真正的复古感觉！",
        date: "2024-02-17"
      }
    ],
    tags: ["复古", "摇滚", "乐队", "怀旧", "经典"]
  }
]

const categories = ['全部', '街头风格', '休闲', '设计师款', '限量版', '图案设计', '基础款', '复古']

function App() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<TShirt[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isCartOpen, setIsCartOpen] = useState(false)
  // Load wishlist and cart from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    const savedCart = localStorage.getItem('cart')
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
    if (savedCart) setCartItems(JSON.parse(savedCart))
  }, [])

  // Save wishlist and cart to localStorage when they change
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addToCart = (tshirt: TShirt) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === tshirt.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === tshirt.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...tshirt, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    )
  }

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const toggleWishlist = (tshirt: TShirt) => {
    setWishlist(prev =>
      prev.some(item => item.id === tshirt.id)
        ? prev.filter(item => item.id !== tshirt.id)
        : [...prev, tshirt]
    )
  }

  const filteredTshirts = tshirts.filter(tshirt => {
    const matchesSearch = tshirt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tshirt.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || tshirt.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold mr-4">AI Design Tee</h1>
                <Sheet>
                  <SheetTrigger asChild className="block sm:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6 text-gray-400" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>菜单</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          placeholder="搜索T恤..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="block w-full pl-10"
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        {categories.map(category => (
                          <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "ghost"}
                            onClick={() => {
                              setSelectedCategory(category);
                              const sheet = document.querySelector('[role="dialog"]');
                              if (sheet) {
                                const closeButton = sheet.querySelector('button[aria-label="关闭"]') as HTMLButtonElement;
                                closeButton?.click();
                              }
                            }}
                            className="justify-start"
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <div className="hidden sm:flex ml-6 space-x-8">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        placeholder="搜索T恤..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>购物车</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8">
                      {cartItems.length === 0 ? (
                        <p className="text-center text-gray-500">购物车是空的</p>
                      ) : (
                        <div className="space-y-4">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                <div>
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-sm text-gray-500">¥{item.price}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  -
                                </Button>
                                <span>{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  +
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Separator />
                          <div className="flex justify-between items-center">
                            <span className="font-medium">总计:</span>
                            <span className="font-bold">¥{cartTotal.toFixed(2)}</span>
                          </div>
                          <Button 
                            className="w-full"
                            onClick={async () => {
                              await new Promise(resolve => {
                                setIsCartOpen(false);
                                setTimeout(resolve, 300);
                              });
                              navigate('/checkout', { replace: true });
                            }}
                          >
                            结算
                          </Button>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <Routes>
          <Route path="/" element={
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                  <h1 className="text-4xl font-bold text-gray-900">最新上架</h1>
                  <div className="flex flex-wrap gap-2 sm:ml-auto w-full sm:w-auto">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className="text-sm px-3 py-1"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTshirts.map((tshirt) => (
                    <Card key={tshirt.id} id={`product-${tshirt.id}`} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-0">
                        <Link to={`/product/${tshirt.id}`}>
                          <Image 
                            src={tshirt.image} 
                            alt={tshirt.name} 
                            className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity duration-200"
                          />
                        </Link>
                        <div className="p-4">
                          <h2 className="text-xl font-semibold text-gray-900">{tshirt.name}</h2>
                          <p className="text-gray-500 mt-1">{tshirt.description}</p>
                          <div className="flex items-center mt-2">
                            {[...Array(5)].map((_, i) => {
                              const rating = tshirt.reviews.reduce((acc, review) => acc + review.rating, 0) / tshirt.reviews.length;
                              return i < Math.floor(rating) ? (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ) : i === Math.floor(rating) && rating % 1 >= 0.5 ? (
                                <StarHalf key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ) : (
                                <Star key={i} className="w-4 h-4 text-gray-300" />
                              );
                            })}
                            <span className="ml-2 text-sm text-gray-600">
                              ({tshirt.reviews.length} 条评论)
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {tshirt.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-2xl font-bold text-gray-900">¥{tshirt.price}</span>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleWishlist(tshirt)}
                                className="hover:bg-pink-50"
                              >
                                <Heart 
                                  className={`h-5 w-5 ${wishlist.some(item => item.id === tshirt.id) 
                                    ? 'fill-pink-500 text-pink-500' 
                                    : 'text-gray-500'}`}
                                />
                              </Button>
                              {tshirt.sizes && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => alert('尺码指南功能即将推出')}
                                  className="hover:bg-blue-50"
                                  title="查看尺码指南"
                                >
                                  <Ruler className="h-5 w-5 text-gray-500" />
                                </Button>
                              )}
                              <Button 
                                onClick={() => addToCart(tshirt)}
                                className="bg-black hover:bg-gray-800"
                              >
                                加入购物车
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </main>
          } />
          <Route 
            path="/product/:id" 
            element={
              <ProductDetail 
                tshirts={tshirts}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isInWishlist={(id) => wishlist.some(item => item.id === id)}
              />
            } />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} totalAmount={cartTotal} clearCart={() => setCartItems([])} />} />
          <Route path="/order-status/:orderId" element={<OrderStatus />} />
        </Routes>
      </div>
  )
}

export default App
