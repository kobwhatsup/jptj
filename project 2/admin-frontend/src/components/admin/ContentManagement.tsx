import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Plus, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { Policy, PolicyCategory, PolicyResponse } from '@/lib/types/policy';
import type { IndustryNews, IndustryCategory, IndustryNewsResponse } from '@/lib/types/industry';

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'policy' | 'news'>('policy');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [news, setNews] = useState<IndustryNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Policy | IndustryNews | null>(null);
  const itemsPerPage = 10;

  const fetchContent = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'policy' ? 'policies' : 'news';
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/${endpoint}?page=${page}&limit=${itemsPerPage}&search=${searchTerm}&category=${categoryFilter}`
      );
      if (!response.ok) throw new Error(`Failed to fetch ${activeTab}`);
      const data: PolicyResponse | IndustryNewsResponse = await response.json();
      if (activeTab === 'policy') {
        setPolicies(data.items as Policy[]);
      } else {
        setNews(data.items as IndustryNews[]);
      }
      setTotalPages(Math.ceil(data.total / data.limit));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : `获取${activeTab === 'policy' ? '政策' : '新闻'}列表失败`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [activeTab, page, searchTerm, categoryFilter]);

  const handleDelete = async (item: Policy | IndustryNews) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    try {
      const endpoint = activeTab === 'policy' ? 'policies' : 'news';
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/${endpoint}/${selectedItem.id}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to delete item');
      await fetchContent();
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-destructive space-y-2">
          <p>{error}</p>
          <Button onClick={fetchContent}>重试</Button>
        </div>
      </div>
    );
  }

  const policyCategories: PolicyCategory[] = ['最新政策', '重点解读', '实务指南', '案例分析', '专家观点'];
  const newsCategories: IndustryCategory[] = ['行业要闻', '发展趋势', '经验分享', '活动报道', '人物访谈'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">内容管理</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          添加{activeTab === 'policy' ? '政策' : '新闻'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'policy' | 'news')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="policy">政策管理</TabsTrigger>
          <TabsTrigger value="news">新闻管理</TabsTrigger>
        </TabsList>

        <div className="flex space-x-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`搜索${activeTab === 'policy' ? '政策' : '新闻'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="分类筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {(activeTab === 'policy' ? policyCategories : newsCategories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="policy" className="border rounded-md mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>发布部门</TableHead>
                <TableHead>作者</TableHead>
                <TableHead>发布时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>{policy.title}</TableCell>
                  <TableCell>{policy.category}</TableCell>
                  <TableCell>{policy.department}</TableCell>
                  <TableCell>{policy.author}</TableCell>
                  <TableCell>{new Date(policy.publishDate).toLocaleDateString('zh-CN')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(policy)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="news" className="border rounded-md mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>作者</TableHead>
                <TableHead>浏览量</TableHead>
                <TableHead>发布时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>{item.views}</TableCell>
                  <TableCell>{new Date(item.publishDate).toLocaleDateString('zh-CN')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page === 1}
                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(p => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(pageNum);
                  }}
                  isActive={page === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={page === totalPages}
                className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(p => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除 "{selectedItem?.title}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentManagement;
