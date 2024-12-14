import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'REMOVED';
  author_id: string;
  created_at: string;
  updated_at: string;
}

interface ForumComment {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  status: 'PENDING' | 'APPROVED' | 'REMOVED';
  created_at: string;
}

const ForumManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postStatusFilter, setPostStatusFilter] = useState('all');
  const [commentStatusFilter, setCommentStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const categories = [
    { name: '经验交流', key: 'EXPERIENCE' },
    { name: '案例分享', key: 'CASE' },
    { name: '技能提升', key: 'SKILL' },
    { name: '政策讨论', key: 'POLICY' },
    { name: '调解心得', key: 'INSIGHT' },
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/forum/posts?page=${page}&size=${itemsPerPage}${
          postStatusFilter !== 'all' ? `&status=${postStatusFilter}` : ''
        }${categoryFilter !== 'all' ? `&category=${categoryFilter}` : ''}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('获取帖子列表失败');
      const data = await response.json();
      setPosts(data.items);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取帖子列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/forum/comments?page=${page}&size=${itemsPerPage}${
          commentStatusFilter !== 'all' ? `&status=${commentStatusFilter}` : ''
        }`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('获取评论列表失败');
      const data = await response.json();
      setComments(data.items);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取评论列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    } else {
      fetchComments();
    }
  }, [activeTab, page, postStatusFilter, commentStatusFilter, categoryFilter]);

  const handleApprovePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/forum/posts/approve?post_id=${postId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('审核帖子失败');
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '审核帖子失败');
    }
  };

  const handleRemovePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/forum/posts/remove?post_id=${postId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('删除帖子失败');
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除帖子失败');
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/forum/comments/approve?comment_id=${commentId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('审核评论失败');
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : '审核评论失败');
    }
  };

  const handleRemoveComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/forum/comments/remove?comment_id=${commentId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('删除评论失败');
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除评论失败');
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
          <Button onClick={activeTab === 'posts' ? fetchPosts : fetchComments}>
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">论坛管理</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="posts">帖子管理</TabsTrigger>
          <TabsTrigger value="comments">评论管理</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <div className="flex space-x-4">
            <Select value={postStatusFilter} onValueChange={setPostStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="PENDING">待审核</SelectItem>
                <SelectItem value="APPROVED">已通过</SelectItem>
                <SelectItem value="REMOVED">已删除</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="分类筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>发布时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>
                      {categories.find((c) => c.key === post.category)?.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          post.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : post.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {post.status === 'PENDING' && '待审核'}
                        {post.status === 'APPROVED' && '已通过'}
                        {post.status === 'REMOVED' && '已删除'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString('zh-CN')}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {post.status === 'PENDING' && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleApprovePost(post.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemovePost(post.id)}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <div className="flex space-x-4">
            <Select
              value={commentStatusFilter}
              onValueChange={setCommentStatusFilter}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="PENDING">待审核</SelectItem>
                <SelectItem value="APPROVED">已通过</SelectItem>
                <SelectItem value="REMOVED">已删除</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>内容</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>发布时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>{comment.content}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          comment.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : comment.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {comment.status === 'PENDING' && '待审核'}
                        {comment.status === 'APPROVED' && '已通过'}
                        {comment.status === 'REMOVED' && '已删除'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(comment.created_at).toLocaleDateString('zh-CN')}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {comment.status === 'PENDING' && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleApproveComment(comment.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveComment(comment.id)}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
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
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ForumManagement;
