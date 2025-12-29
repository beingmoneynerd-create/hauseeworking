import { EvaluationCategory } from '../types';

export const EVALUATION_CATEGORIES: EvaluationCategory[] = [
  {
    id: 'exteriors',
    title: 'Exteriors',
    icon: 'Home',
    items: [
      { id: 'roof_condition', label: 'Roof condition', type: 'rating' },
      { id: 'exterior_walls_condition', label: 'Exterior walls condition', type: 'rating' },
      { id: 'foundation_visible', label: 'Foundation (visible areas)', type: 'rating' },
      { id: 'driveway_walkways', label: 'Driveway & walkways', type: 'rating' },
      { id: 'landscaping_grading', label: 'Landscaping & grading', type: 'rating' },
      { id: 'eavestroughs_downspouts', label: 'Eavestroughs & downspouts', type: 'rating' },
      { id: 'exterior_lighting', label: 'Exterior lighting', type: 'rating' },
    ],
  },
  {
    id: 'interiors',
    title: 'Interiors',
    icon: 'Layout',
    items: [
      { id: 'floors', label: 'Floors', type: 'rating' },
      { id: 'walls', label: 'Walls', type: 'rating' },
      { id: 'ceilings', label: 'Ceilings', type: 'rating' },
      { id: 'lighting', label: 'Lighting', type: 'rating' },
      { id: 'closet_spaces', label: 'Closet spaces', type: 'rating' },
      { id: 'doors_hardware', label: 'Doors & hardware', type: 'rating' },
      { id: 'trim', label: 'Trim', type: 'rating' },
      { id: 'stairs_railings', label: 'Stairs & railings', type: 'rating' },
      { id: 'windows_general', label: 'Windows (general condition)', type: 'rating' },
      { id: 'smoke_detectors', label: 'Smoke detectors', type: 'rating' },
      { id: 'co_detectors', label: 'CO detectors', type: 'rating' },
      { id: 'heating_vents', label: 'Heating vents', type: 'rating' },
      { id: 'return_vents', label: 'Return vents', type: 'rating' },
      { id: 'hallways', label: 'Hallways', type: 'rating' },
      { id: 'general_cleanliness', label: 'General cleanliness', type: 'rating' },
      { id: 'general_smell', label: 'General smell', type: 'rating' },
      { id: 'other_interior', label: 'Other interior conditions', type: 'rating' },
    ],
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    icon: 'Utensils',
    items: [
      { id: 'cabinets', label: 'Cabinets', type: 'rating' },
      { id: 'countertops', label: 'Countertops', type: 'rating' },
      { id: 'appliances', label: 'Appliances', type: 'rating' },
      { id: 'sink_faucet', label: 'Sink & faucet', type: 'rating' },
      { id: 'water_flow', label: 'Water flow', type: 'rating' },
      { id: 'ventilation', label: 'Ventilation', type: 'rating' },
      { id: 'backsplash', label: 'Backsplash', type: 'rating' },
      { id: 'electrical_outlets', label: 'Electrical outlets', type: 'rating' },
      { id: 'storage', label: 'Storage', type: 'rating' },
      { id: 'lighting_kitchen', label: 'Lighting', type: 'rating' },
      { id: 'overall_functionality', label: 'Overall functionality', type: 'rating' },
    ],
  },
  {
    id: 'bathrooms',
    title: 'Bathrooms',
    icon: 'Droplet',
    items: [
      { id: 'bathroom_fixtures', label: 'Fixtures condition', type: 'rating' },
      { id: 'bathroom_tiles', label: 'Tiles & grout', type: 'rating' },
      { id: 'bathroom_ventilation', label: 'Ventilation', type: 'rating' },
      { id: 'bathroom_water_pressure', label: 'Water pressure', type: 'rating' },
      { id: 'bathroom_storage', label: 'Storage space', type: 'rating' },
      { id: 'bathroom_lighting', label: 'Lighting', type: 'rating' },
      { id: 'shower_tub', label: 'Shower/tub condition', type: 'rating' },
      { id: 'vanity_condition', label: 'Vanity & countertops', type: 'rating' },
    ],
  },
  {
    id: 'home_systems',
    title: 'Home Systems',
    icon: 'Settings',
    items: [
      { id: 'hvac_condition', label: 'HVAC system', type: 'rating' },
      { id: 'electrical_condition', label: 'Electrical system', type: 'rating' },
      { id: 'plumbing_condition', label: 'Plumbing system', type: 'rating' },
      { id: 'water_heater_ownership', label: 'Hot water heater ownership', type: 'radio', options: ['Owned', 'Leased'] },
      { id: 'water_heater_type', label: 'Hot water heater type', type: 'radio', options: ['Tank', 'Tankless'] },
    ],
  },
  {
    id: 'smart_features',
    title: 'Smart Home Features',
    icon: 'Smartphone',
    items: [
      { id: 'smart_thermostat', label: 'Smart thermostat', type: 'checkbox' },
      { id: 'smart_lights', label: 'Smart lights', type: 'checkbox' },
      { id: 'smart_doorbell', label: 'Smart doorbell', type: 'checkbox' },
      { id: 'smart_locks', label: 'Smart locks', type: 'checkbox' },
      { id: 'security_cameras', label: 'Security cameras', type: 'checkbox' },
      { id: 'smart_other', label: 'Other', type: 'checkbox_with_text' },
    ],
  },
  {
    id: 'additional_features',
    title: 'Additional Features',
    icon: 'Star',
    items: [
      { id: 'fireplace', label: 'Fireplace', type: 'checkbox' },
      { id: 'finished_basement', label: 'Finished basement', type: 'checkbox' },
      { id: 'garage', label: 'Garage', type: 'checkbox' },
      { id: 'deck', label: 'Deck', type: 'checkbox' },
      { id: 'backyard_features', label: 'Backyard features', type: 'checkbox' },
      { id: 'additional_other', label: 'Other', type: 'checkbox_with_text' },
    ],
  },
  {
    id: 'location',
    title: 'Location',
    icon: 'MapPin',
    items: [
      { id: 'street_noise', label: 'Street noise', type: 'rating' },
      { id: 'privacy', label: 'Privacy', type: 'rating' },
      { id: 'sunlight', label: 'Sunlight', type: 'rating' },
      { id: 'parking', label: 'Parking', type: 'rating' },
      { id: 'walkability', label: 'Walkability', type: 'rating' },
      { id: 'transit', label: 'Transit access', type: 'rating' },
      { id: 'schools', label: 'Schools nearby', type: 'rating' },
      { id: 'grocery_stores', label: 'Grocery stores', type: 'rating' },
      { id: 'parks', label: 'Parks & recreation', type: 'rating' },
      { id: 'safety', label: 'Safety', type: 'rating' },
      { id: 'neighbourhood_feel', label: 'Neighbourhood feel', type: 'rating' },
    ],
  },
  {
    id: 'monthly_costs',
    title: 'Monthly Costs',
    icon: 'DollarSign',
    items: [
      { id: 'utilities_cost', label: 'Utilities', type: 'currency' },
      { id: 'insurance_cost', label: 'Insurance', type: 'currency' },
      { id: 'condo_fees', label: 'Condo/POTL fees', type: 'currency' },
      { id: 'other_costs', label: 'Other costs', type: 'currency' },
    ],
  },
  {
    id: 'other_observations',
    title: 'Other Observations',
    icon: 'FileText',
    items: [
      { id: 'general_notes', label: 'General observations', type: 'textarea' },
    ],
  },
];

export const RATING_VALUES = {
  good: { value: 5, color: 'green', label: 'Good' },
  fair: { value: 3, color: 'yellow', label: 'Fair' },
  poor: { value: 1, color: 'red', label: 'Poor' },
};

export function getTotalEvaluationItems(): number {
  return EVALUATION_CATEGORIES.reduce((total, category) => {
    return total + category.items.filter((item) => item.type === 'rating').length;
  }, 0);
}

export function calculateOverallRating(ratings: {
  [categoryId: string]: { [itemId: string]: string | number | boolean };
}): number {
  let totalValue = 0;
  let totalItems = 0;

  Object.values(ratings).forEach((category) => {
    Object.entries(category).forEach(([, value]) => {
      if (typeof value === 'string' && ['good', 'fair', 'poor'].includes(value)) {
        const points = value === 'good' ? 5 : value === 'fair' ? 3 : 1;
        totalValue += points;
        totalItems++;
      }
    });
  });

  if (totalItems === 0) return 0;

  const averageScore = totalValue / (totalItems * 5);
  const overallRating = averageScore * 5;

  return Math.round(overallRating * 10) / 10;
}

export function calculateCompletionPercentage(ratings: {
  [categoryId: string]: { [itemId: string]: string | number | boolean };
}): number {
  let completedItems = 0;
  let totalItems = 0;

  EVALUATION_CATEGORIES.forEach((category) => {
    category.items.forEach((item) => {
      totalItems++;
      const rating = ratings[category.id]?.[item.id];
      if (rating !== undefined && rating !== null && rating !== '') {
        completedItems++;
      }
    });
  });

  return Math.round((completedItems / totalItems) * 100);
}
