import type { ReactNode } from 'react';

type CardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function Card({ title, description, children }: CardProps) {
  return (
    <div className="card border border-base-200 bg-base-100 shadow-sm">
      <div className="card-body">
        <h3 className="card-title text-lg">{title}</h3>
        {description ? <p className="text-sm text-base-content/70">{description}</p> : null}
        {children}
      </div>
    </div>
  );
}
