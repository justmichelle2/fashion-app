import { useState } from "react";
import { Star, Send, AlertCircle } from "lucide-react";
import { submitReview } from "../services/reviewsService";

export function ReviewForm({ orderId, designerId, customerId, onSubmitSuccess, onCancel }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a review title");
      return;
    }

    if (!comment.trim()) {
      setError("Please enter a review comment");
      return;
    }

    setLoading(true);

    try {
      await submitReview({
        designerId,
        customerId,
        orderId,
        rating,
        title,
        comment
      });

      setSuccess(true);
      // Call callback after success
      setTimeout(() => {
        onSubmitSuccess?.();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="text-green-600 mb-3">✓</div>
        <h3 className="text-green-700 font-semibold mb-2">Review Submitted!</h3>
        <p className="text-green-600 text-sm">Thank you for your feedback. It helps other customers find great designers.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl p-6 border border-gray-100">
      <h3 className="text-[#2D2D2D] font-semibold text-lg">Share Your Experience</h3>

      {/* Rating Selection */}
      <div>
        <label className="text-[#2D2D2D] text-sm font-semibold mb-3 block">
          How would you rate this designer?
        </label>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={`${
                  star <= rating
                    ? "text-[#F4A261] fill-[#F4A261]"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-[#4B5563] text-sm mt-2">
            {rating === 5 && "Excellent!"}
            {rating === 4 && "Very Good!"}
            {rating === 3 && "Good"}
            {rating === 2 && "Could be better"}
            {rating === 1 && "Needs improvement"}
          </p>
        )}
      </div>

      {/* Review Title */}
      <div>
        <label className="text-[#2D2D2D] text-sm font-semibold mb-2 block">
          Review Title
        </label>
        <input
          type="text"
          placeholder="Summarize your experience..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength="100"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-[#2D2D2D]"
        />
        <p className="text-[#4B5563] text-xs mt-1">{title.length}/100</p>
      </div>

      {/* Review Comment */}
      <div>
        <label className="text-[#2D2D2D] text-sm font-semibold mb-2 block">
          Your Review
        </label>
        <textarea
          placeholder="Share details about the designer's work, communication, timeline, quality, etc..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength="500"
          rows="5"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-[#2D2D2D] resize-none"
        />
        <p className="text-[#4B5563] text-xs mt-1">{comment.length}/500</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-50 rounded-xl">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-3 border border-gray-200 text-[#2D2D2D] rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
          style={{ fontWeight: "600" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="flex-1 px-4 py-3 bg-[#E76F51] text-white rounded-xl hover:bg-[#D35F41] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ fontWeight: "600" }}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Review
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
