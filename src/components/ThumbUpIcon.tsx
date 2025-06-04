import React from 'react';

interface ThumbUpIconProps extends React.SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export default function ThumbUpIcon({ filled = false, ...props }: ThumbUpIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 10v12"></path>
      <path d="M17 10V5a1 1 0 00-1-1h-3.5a2.5 2.5 0 00-2.4 3.4L8.5 10H7"></path>
      <path d="M17 10l-2.9 7.8a1 1 0 01-.9.2H7"></path>
    </svg>
  );
}
