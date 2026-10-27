import type { PropertyComment } from '../models/comment';

export function ratingSummary(comments: Pick<PropertyComment, 'rating'>[]) {
  const ratings = comments.map(comment => comment.rating).filter((rating): rating is number =>
    typeof rating === 'number' && Number.isInteger(rating) && rating >= 1 && rating <= 5);
  return { count: ratings.length, average: ratings.length ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : null };
}
