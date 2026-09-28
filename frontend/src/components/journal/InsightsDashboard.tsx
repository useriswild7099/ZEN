'use client';

import { InsightCard } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { TrendingUp, Lightbulb, Target, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface InsightsDashboardProps {
  insights: InsightCard[];
}

export function InsightsDashboard({ insights }: InsightsDashboardProps) {
  const getInsightIcon = (type: InsightCard['type']) => {
    switch (type) {
      case 'correlation':
        return TrendingUp;
      case 'pattern':
        return Target;
      case 'suggestion':
        return Lightbulb;
      case 'milestone':
        return Trophy;
    }
  };

  const getInsightColor = (type: InsightCard['type']) => {
    switch (type) {
      case 'correlation':
        return 'text-blue-500';
      case 'pattern':
        return 'text-purple-500';
      case 'suggestion':
        return 'text-amber-500';
      case 'milestone':
        return 'text-green-500';
    }
  };

  if (insights.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
        <div>
          <h3 className="text-lg font-medium">No insights yet</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Keep journaling to unlock patterns and correlations in your life.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Your Insights</h2>
        <p className="text-muted-foreground">
          The Mirror reveals patterns you might not have noticed
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          const colorClass = getInsightColor(insight.type);

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 space-y-4 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shadow-lg bg-gradient-to-br ${
                    insight.type === 'correlation' ? 'from-blue-500 to-cyan-500' :
                    insight.type === 'pattern' ? 'from-purple-500 to-pink-500' :
                    insight.type === 'suggestion' ? 'from-amber-500 to-orange-500' :
                    'from-green-500 to-emerald-500'
                  }`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                    {insight.confidence < 1 && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${insight.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
