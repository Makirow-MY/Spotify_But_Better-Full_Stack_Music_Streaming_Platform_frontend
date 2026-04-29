// components/InfiniteScroll.tsx
import SectionGridSkeleton from "@/pages/home/components/SectionGridSkeleton";
import { useEffect, useRef, useCallback } from "react";


type InfiniteScrollProps = {
  children: React.ReactNode;
  loadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  loader?: React.ReactNode;
};

const InfiniteScroll = ({
  children,
  loadMore,
  hasMore,
  isLoadingMore,
  
}: InfiniteScrollProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoadingMore) {
        loadMore();
      }
    },
    [hasMore, isLoadingMore, loadMore]
  );

  useEffect(() => {
    const currentTarget = targetRef.current;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: "300px",   // Start loading early (feels smoother)
      threshold: 0.1,
    });

    if (currentTarget) {
      observerRef.current.observe(currentTarget);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver]);

  return (
    <>
      {children}

      {/* Loading Skeleton while fetching more */}
      {isLoadingMore && (
        <div className="mt-8">
          <SectionGridSkeleton />
        </div>
      )}

      {/* Invisible trigger element */}
      {hasMore && <div ref={targetRef} className="h-10 w-full" />}

      {/* End message */}
      {!hasMore && !isLoadingMore && (
        <div className="text-center text-zinc-500 py-10 text-sm">
          You've reached the end • No more songs to load
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;








