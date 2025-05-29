const AdminPagination =({ currentPage, totalItems, pageSize, groupSize = 5, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize)
  const currentGroup = Math.floor((currentPage - 1) / groupSize)
  const startPage = currentGroup * groupSize + 1
  const endPage = Math.min(startPage + groupSize - 1, totalPages)

  if (totalPages <= 1) return null

  return (
    <div
      className="pagination"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '4px',
        margin: '20px auto'
      }}
    >
      {startPage > 1 && (
        <button
          onClick={() => onPageChange(startPage - 1)}
          style={buttonStyle}
        >
          {'◀ 이전'}
        </button>
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(startPage + i)}
          style={{
            ...buttonStyle,
            background: currentPage === startPage + i ? '#0d3765' : '#fff',
            color: currentPage === startPage + i ? '#fff' : '#000'
          }}
        >
          {startPage + i}
        </button>
      ))}

      {endPage < totalPages && (
        <button
          onClick={() => onPageChange(endPage + 1)}
          style={buttonStyle}
        >
          {'다음 ▶'}
        </button>
      )}
    </div>
  )
}

const buttonStyle = {
  fontSize: '10px',
  padding: '2px 8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer'
}

export default AdminPagination
