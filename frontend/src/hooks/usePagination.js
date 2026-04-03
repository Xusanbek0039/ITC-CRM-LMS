import { useState, useCallback } from 'react';

const usePagination = (initialPage = 1, initialPageSize = 20) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const updateFromResponse = useCallback((data) => {
    setTotalCount(data.count || 0);
    setTotalPages(data.total_pages || Math.ceil((data.count || 0) / pageSize));
  }, [pageSize]);

  const goToPage = useCallback((newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages || 1)));
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage]);
  const prevPage = useCallback(() => goToPage(page - 1), [page, goToPage]);

  const resetPage = useCallback(() => setPage(1), []);

  return {
    page,
    pageSize,
    totalCount,
    totalPages,
    setPage: goToPage,
    setPageSize,
    nextPage,
    prevPage,
    resetPage,
    updateFromResponse,
  };
};

export default usePagination;
