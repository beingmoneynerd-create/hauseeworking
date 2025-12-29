import { EvaluationItem as EvaluationItemType, RatingValue } from '../../types';
import RatingButtons from './RatingButtons';

interface EvaluationItemProps {
  item: EvaluationItemType;
  categoryId: string;
  value: RatingValue | number | string | null;
  note: string;
  onRatingChange: (categoryId: string, itemId: string, value: RatingValue | number | string) => void;
  onNoteChange: (itemId: string, note: string) => void;
}

export default function EvaluationItemComponent({
  item,
  categoryId,
  value,
  note,
  onRatingChange,
  onNoteChange,
}: EvaluationItemProps) {
  return (
    <div className="border-b border-gray-100 last:border-b-0 py-4">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-900 mb-1">{item.label}</label>
        {item.helperText && <p className="text-xs text-gray-500">{item.helperText}</p>}
      </div>

      {item.type === 'rating' && (
        <RatingButtons
          value={value as RatingValue | null}
          onChange={(newValue) => onRatingChange(categoryId, item.id, newValue)}
        />
      )}

      {item.type === 'radio' && item.options && (
        <div className="flex gap-3">
          {item.options.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`${categoryId}-${item.id}`}
                value={option}
                checked={(value as string) === option}
                onChange={(e) => onRatingChange(categoryId, item.id, e.target.value)}
                className="w-4 h-4 text-primary-400 focus:ring-2 focus:ring-primary-100"
              />
              <span className="text-sm font-medium text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}

      {item.type === 'checkbox' && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!(value as boolean)}
            onChange={(e) => onRatingChange(categoryId, item.id, e.target.checked)}
            className="w-5 h-5 text-primary-400 rounded focus:ring-2 focus:ring-primary-100"
          />
          <span className="text-sm text-gray-600">Has this feature</span>
        </label>
      )}

      {item.type === 'checkbox_with_text' && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!(value as boolean | string)}
              onChange={(e) => {
                if (!e.target.checked) {
                  onRatingChange(categoryId, item.id, false);
                } else {
                  onRatingChange(categoryId, item.id, '');
                }
              }}
              className="w-5 h-5 text-primary-400 rounded focus:ring-2 focus:ring-primary-100"
            />
            <span className="text-sm text-gray-600">Has this feature</span>
          </label>
          {(value as boolean | string) && (
            <input
              type="text"
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => onRatingChange(categoryId, item.id, e.target.value)}
              placeholder="Describe the feature..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          )}
        </div>
      )}

      {item.type === 'currency' && (
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={(value as number) || ''}
            onChange={(e) => onRatingChange(categoryId, item.id, Number(e.target.value))}
            placeholder="0"
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
          />
        </div>
      )}

      {item.type === 'textarea' && (
        <textarea
          value={(value as string) || ''}
          onChange={(e) => onRatingChange(categoryId, item.id, e.target.value)}
          placeholder="Enter your observations..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-400 resize-none"
        />
      )}

      {(item.type === 'rating' || item.type === 'radio') && (
        <div className="mt-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Notes (optional, max 500 characters)
          </label>
          <textarea
            value={note}
            onChange={(e) => onNoteChange(item.id, e.target.value.slice(0, 500))}
            placeholder="Add any specific observations..."
            rows={2}
            maxLength={500}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-400 resize-none"
          />
          <div className="text-xs text-gray-500 text-right mt-1">{note.length}/500</div>
        </div>
      )}
    </div>
  );
}
