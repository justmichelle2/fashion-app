import { useEffect, useState } from "react";
import { Star, ThumbsUp, Calendar, User } from "lucide-react";
import { getDesignerReviews, getReviewsSummary, markReviewHelpful } from "../services/reviewsService";

export function ReviewsList({ designerId, limit = 10 }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("recent"); // recent, helpful, highest, lowest

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        const [reviewsData, summaryData] = await Promise.all([
          getDesignerReviews(designerId, { pageLimit: limit }),
          getReviewsSummary(designerId)
        ]);

        setReviews(reviewsData);
        setSummary(summaryData);
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [designerId, limit]);

  const getSortedReviews = () => {
    const sorted = [...reviews];
    switch (filter) {
      case "helpful":
        return sorted.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      case "recent":
      default:
        return sorted;
    }
  };

  const getPercentage = (count) => {
    if (!summary || summary.totalReviews === 0) return 0;
    return Math.round((count / summary.totalReviews) * 100);
  };

  const sortedReviews = getSortedReviews();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-[#E76F51] rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      {summary && summary.totalReviews > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-start gap-6 mb-6">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-[#2D2D2D]">
                  {summary.averageRating}
                </span>
                <span className="text-[#4B5563]">out of 5</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < Math.round(summary.averageRating)
                        ? "text-[#F4A261] fill-[#F4A261]"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[#4B5563] text-sm">
                Based on {summary.totalReviews} review{summary.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[#4B5563] text-sm min-w-[30px]">{star}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F4A261] transition-all"
                      style={{
                        width: `${getPercentage(summary.ratingBreakdown[star])}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-[#4B5563] text-sm min-w-[40px] text-right">
                    {summary.ratingBreakdown[star]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter & Sort */}
      {reviews.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "recent", label: "Most Recent" },
            { id: "helpful", label: "Most Helpful" },
            { id: "highest", label: "Highest Rated" },
            { id: "lowest", label: "Lowest Rated" }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                filter === option.id
                  ? "bg-[#E76F51] text-white"
                  : "bg-gray-100 text-[#4B5563] hover:bg-gray-200"
              }`}
              style={{ fontWeight: "600", fontSize: "13px" }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4B5563] mb-2">No reviews yet</p>
            <p className="text-[#4B5563] text-sm">Be the first to review this designer</p>
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#E76F51]/30 transition-all"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < review.rating
                              ? "text-[#F4A261] fill-[#F4A261]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[#2D2D2D] font-semibold text-sm">
                      {review.rating} out of 5
                    </span>
                  </div>
                  <h4 className="text-[#2D2D2D] font-semibold text-base mb-1">
                    {review.title}
                  </h4>
                </div>
                {review.verified && (
                  <span className="text-[#E76F51] text-xs font-semibold px-2 py-1 bg-[#E76F51]/10 rounded-lg">
                    Verified
                  </span>
                )}
              </div>

              {/* Review Comment */}
              <p className="text-[#4B5563] text-sm mb-4 leading-relaxed">
                {review.comment}
              </p>

              {/* Review Footer */}
              <div className="flex items-center justify-between text-xs text-[#4B5563]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })
                      : "Recently"}
                  </span>
                </div>
                <button
                  onClick={() => markReviewHelpful(review.id)}
                  className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded transition-all"
                >
                  <ThumbsUp size={12} />
                  <span>{review.helpful || 0} helpful</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {reviews.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-[#4B5563]">No reviews available yet</p>
        </div>
      )}
    </div>
  );
}

export default ReviewsList;
