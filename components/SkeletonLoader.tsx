'use client';
import React from 'react';

const Bone = ({ w = 'w-full', h = 'h-4', rounded = 'rounded-xl', extra = '' }) => (
  <div className={`skeleton ${w} ${h} ${rounded} ${extra}`} />
);

export const HomePageSkeleton = () => (
  <div style={{ background: 'var(--black)' }} className="min-h-screen pt-16">
    {/* Hero */}
    <div className="px-4 pb-8">
      <div className="skeleton w-full rounded-3xl" style={{ height: 'min(78vw, 500px)' }} />
    </div>
    {/* Rows */}
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="mb-8 px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="skeleton w-1 h-5 rounded-full" />
          <Bone w="w-36" h="h-4" />
        </div>
        <div className="flex gap-2.5 overflow-hidden">
          {[1,2,3,4,5].map(j => (
            <div key={j} className="flex-shrink-0 w-[108px]">
              <div className="skeleton w-full rounded-xl" style={{ paddingBottom: '150%' }} />
              <Bone extra="mt-2" />
              <Bone w="w-2/3" extra="mt-1.5" h="h-3" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const PlayerPageSkeleton = () => (
  <div style={{ background: '#080d1a' }} className="min-h-screen flex flex-col">
    <div className="skeleton w-full" style={{ aspectRatio: '16/9' }} />
    <div className="p-5 space-y-4 flex-1">
      <Bone w="w-3/4" h="h-8" rounded="rounded-2xl" />
      <Bone w="w-1/2" h="h-5" rounded="rounded-xl" />
      <div className="flex gap-2 pt-1">
        {[1,2,3,4].map(i => <Bone key={i} w="w-16" h="h-8" rounded="rounded-xl" />)}
      </div>
      <Bone h="h-14" rounded="rounded-2xl" />
      <Bone h="h-14" rounded="rounded-2xl" />
      <Bone h="h-28" rounded="rounded-2xl" />
    </div>
  </div>
);
