import React from 'react';
import { TaskStatus } from '../types';
import { CheckCircle2, Clock, CircleDashed } from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    NOT_STARTED: {
      label: 'À faire',
      className: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: CircleDashed,
      dot: 'bg-slate-400'
    },
    IN_PROGRESS: {
      label: 'En cours',
      className: 'bg-amber-50 text-amber-700 border-amber-100',
      icon: Clock,
      dot: 'bg-amber-500'
    },
    COMPLETED: {
      label: 'Terminé',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      icon: CheckCircle2,
      dot: 'bg-emerald-500'
    },
  };

  const { label, className, icon: Icon, dot } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${className} shadow-sm`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
