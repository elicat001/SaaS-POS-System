import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Reply, Eye, EyeOff, Loader2 } from 'lucide-react';
import { appApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import type { Review } from '../../types';

const ReviewsApp: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'visible' | 'hidden' | 'all'>('visible');
  const [replyModal, setReplyModal] = useState<{ review: Review | null; text: string }>({ review: null, text: '' });
  const { success: showSuccess, error: showError } = useNotification();

  const fetchReviews = async () => {
    try {
      const status = activeTab === 'all' ? undefined : activeTab;
      const data = await appApi.listReviews(status);
      setReviews(data);
    } catch (e) {
      showError('错误', '获取评价列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  // 回复评价
  const handleReply = async () => {
    if (!replyModal.review || !replyModal.text.trim()) return;
    try {
      await appApi.replyReview(replyModal.review.id, replyModal.text);
      showSuccess('成功', '回复成功');
      setReplyModal({ review: null, text: '' });
      fetchReviews();
    } catch (e) {
      showError('错误', '回复失败');
    }
  };

  // 切换可见性
  const handleToggleVisibility = async (reviewId: string, status: 'visible' | 'hidden') => {
    try {
      await appApi.toggleReviewVisibility(reviewId, status);
      showSuccess('成功', status === 'visible' ? '已显示' : '已隐藏');
      fetchReviews();
    } catch (e) {
      showError('错误', '操作失败');
    }
  };

  // 渲染星级
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            size={16}
            className={i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
          />
        ))}
      </div>
    );
  };

  // 统计
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="text-yellow-500" />
          评价管理
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-yellow-50 rounded-lg px-4 py-2 flex items-center gap-2">
            <Star size={18} className="fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-700 font-bold">{avgRating}</span>
            <span className="text-yellow-600 text-sm">平均评分</span>
          </div>
          <div className="bg-slate-50 rounded-lg px-4 py-2">
            <span className="text-slate-600 text-sm">共 </span>
            <span className="text-slate-800 font-bold">{reviews.length}</span>
            <span className="text-slate-600 text-sm"> 条评价</span>
          </div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex gap-2 border-b">
        {(['visible', 'hidden', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'visible' ? '显示中' : tab === 'hidden' ? '已隐藏' : '全部'}
          </button>
        ))}
      </div>

      {/* 评价列表 */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                    {review.isAnonymous ? '匿' : (review.customerName?.[0] || '客')}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">
                      {review.isAnonymous ? '匿名用户' : review.customerName || '顾客'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {review.createdAt ? new Date(review.createdAt).toLocaleString() : '-'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <button
                    onClick={() => handleToggleVisibility(review.id, review.status === 'visible' ? 'hidden' : 'visible')}
                    className={`p-2 rounded-lg ${
                      review.status === 'visible'
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                    }`}
                    title={review.status === 'visible' ? '隐藏' : '显示'}
                  >
                    {review.status === 'visible' ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {review.content && (
                <p className="text-slate-600 text-sm mb-3">{review.content}</p>
              )}

              {/* 详细评分 */}
              {(review.tasteRating || review.serviceRating || review.environmentRating) && (
                <div className="flex gap-4 text-xs text-slate-500 mb-3">
                  {review.tasteRating && <span>口味: {review.tasteRating}分</span>}
                  {review.serviceRating && <span>服务: {review.serviceRating}分</span>}
                  {review.environmentRating && <span>环境: {review.environmentRating}分</span>}
                </div>
              )}

              {/* 商家回复 */}
              {review.reply ? (
                <div className="bg-slate-50 rounded-lg p-3 text-sm">
                  <div className="text-xs text-slate-500 mb-1">商家回复:</div>
                  <div className="text-slate-700">{review.reply}</div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyModal({ review, text: '' })}
                  className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
                >
                  <Reply size={14} />
                  回复
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400">暂无评价</div>
        )}
      </div>

      {/* 回复弹窗 */}
      {replyModal.review && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">回复评价</h3>
            </div>
            <div className="p-6">
              <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm text-slate-600">
                {replyModal.review.content || '(无评价内容)'}
              </div>
              <textarea
                value={replyModal.text}
                onChange={(e) => setReplyModal({ ...replyModal, text: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                rows={3}
                placeholder="输入回复内容..."
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
              <button onClick={() => setReplyModal({ review: null, text: '' })} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button onClick={handleReply} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                发送回复
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsApp;
