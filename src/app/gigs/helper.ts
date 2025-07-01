export interface IFilter {
  tier: string[];
  rating: number;
  minReviews: string;
  priceRange: number[];
  educationLevel: string[];
  category: string[];
  duration: string;
  location: string;
}

export const tierOptions = [
  { id: 'bronze', label: 'Bronze', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🥉' },
  { id: 'silver', label: 'Silver', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '🥈' },
  { id: 'gold', label: 'Gold', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '🥇' },
  { id: 'platinum', label: 'Platinum', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '💎' }
];

export const ratingList = [
  { id: '1', label: '1 - 10' },
  { id: '2', label: '11 - 20' },
  { id: '3', label: '21 - 30' },
  { id: '4', label: '31 - 40' },
  { id: '5', label: '41 - 50' },
  { id: '6', label: '50+' },
];

export const educationLevels = [
  { id: 'highschool', label: 'High School' },
  { id: 'bachelor', label: 'Bachelor\'s Degree' },
  { id: 'master', label: 'Master\'s Degree' },
  { id: 'phd', label: 'PhD/Doctorate' },
  { id: 'professional', label: 'Professional Certificate' },
  { id: 'bootcamp', label: 'Bootcamp/Course' }
];

export const categories = [
  'Technology', 'Design', 'Marketing', 'Writing', 'Business',
  'Photography', 'Video', 'Music', 'Programming', 'Consulting'
];
