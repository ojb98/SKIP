const Pagination = ({ page, totalPages, onPageChange, pageBlockSize = 10}) => {
  const currentBlock = Math.floor(page / pageBlockSize);
  const startPage = currentBlock * pageBlockSize;
  const endPage = Math.min(startPage + pageBlockSize, totalPages);

  const handlePageClick = (pageNumber) => {
    if (pageNumber !== page) {
      onPageChange(pageNumber);
    }
  };

  return(
    <div className="pagelist">
      {startPage > 0 && (
        <button onClick={() => handlePageClick(startPage -1)}>이전</button>
      )}

      {Array.from({ length: endPage - startPage}, (_, idx) => (
        <button
          key={idx}
          className={page === startPage + idx ? "active" : ""}
          onClick={() => handlePageClick(startPage + idx)}
        >
          {startPage + idx + 1}
        </button>
      ))}

      {endPage < totalPages && (
        <button onClick={() => handlePageClick(endPage)}>다음</button>
      )}
    </div>
  )
}

export default Pagination;