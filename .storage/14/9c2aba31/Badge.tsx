import { Badge as BadgeType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface BadgeProps {
  badge: BadgeType;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Badge({ badge, earned = false, size = 'md' }: BadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
  };

  return (
    <Card className={`${earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50 border-gray-200'} transition-all hover:scale-105`}>
      <CardContent className="p-4 text-center">
        <div className={`${sizeClasses[size]} mx-auto mb-2 rounded-full flex items-center justify-center ${
          earned ? 'bg-gradient-to-br from-yellow-100 to-orange-100' : 'bg-gray-100'
        }`}>
          <span className={earned ? 'opacity-100' : 'opacity-30'}>
            {badge.icon}
          </span>
        </div>
        <h4 className={`font-semibold text-sm ${earned ? 'text-gray-900' : 'text-gray-400'}`}>
          {badge.name}
        </h4>
        <p className={`text-xs mt-1 ${earned ? 'text-gray-600' : 'text-gray-400'}`}>
          {badge.description}
        </p>
      </CardContent>
    </Card>
  );
}