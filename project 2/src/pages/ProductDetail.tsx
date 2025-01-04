import { useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Image } from "../components/common/Image";

interface TShirt {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  reviews: {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
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

interface ProductDetailProps {
  tshirts: TShirt[];
  onAddToCart: (tshirt: TShirt) => void;
  onToggleWishlist: (tshirt: TShirt) => void;
  isInWishlist: (id: number) => boolean;
}

export function ProductDetail({ 
  tshirts, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist 
}: ProductDetailProps) {
  const { id } = useParams();
  const tshirt = tshirts.find(t => t.id === Number(id));
  
  if (!tshirt) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-center">商品未找到</h2>
          <p className="text-gray-600 mt-2">该商品可能已下架或不存在</p>
        </Card>
      </div>
    );
  }

  const averageRating = tshirt.reviews.reduce((acc, review) => acc + review.rating, 0) / tshirt.reviews.length;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 商品图片 */}
        <div className="relative">
          <Image 
            src={tshirt.image} 
            alt={tshirt.name} 
            className="w-full h-[500px] object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* 商品信息 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{tshirt.name}</h1>
            <p className="text-gray-600 mt-2">{tshirt.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">¥{tshirt.price}</span>
            <div className="flex items-center">
              <span className="text-yellow-400">{'★'.repeat(Math.floor(averageRating))}</span>
              <span className="text-gray-300">{'★'.repeat(5 - Math.floor(averageRating))}</span>
              <span className="ml-2 text-sm text-gray-600">
                ({tshirt.reviews.length} 条评价)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-4">
              <Button 
                onClick={() => onAddToCart(tshirt)}
                className="flex-1"
              >
                加入购物车
              </Button>
              <Button 
                variant="outline"
                onClick={() => onToggleWishlist(tshirt)}
                className={isInWishlist(tshirt.id) ? "bg-pink-50" : ""}
              >
                {isInWishlist(tshirt.id) ? "已收藏" : "收藏"}
              </Button>
            </div>
          </div>

          {/* 尺码信息 */}
          {tshirt.sizes && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">尺码信息</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">胸围: {tshirt.sizes.chest} cm</p>
                  <p className="text-sm text-gray-600">肩宽: {tshirt.sizes.shoulders} cm</p>
                  <p className="text-sm text-gray-600">衣长: {tshirt.sizes.length} cm</p>
                  <p className="text-sm text-gray-600">袖长: {tshirt.sizes.sleeves} cm</p>
                </div>
                {tshirt.sizeGuide && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">国际尺码对照</h3>
                    <p className="text-sm text-gray-600">中国尺码: {tshirt.sizeGuide.cn}</p>
                    <p className="text-sm text-gray-600">美国尺码: {tshirt.sizeGuide.us}</p>
                    <p className="text-sm text-gray-600">欧洲尺码: {tshirt.sizeGuide.eu}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {tshirt.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 评价 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">商品评价</h2>
            <div className="space-y-4">
              {tshirt.reviews.map((review, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{review.userName}</span>
                    <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                  </div>
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
