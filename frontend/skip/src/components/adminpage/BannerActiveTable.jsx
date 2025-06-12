const BannerActiveTable = () => {
    return (
        <div className="table-container">
            <button style={{ cursor: 'pointer', border: 'none', background: 'none', display: 'flex', alignItems: 'center', marginBottom:"25px" }}>
                <h3>🖼️ 등록 배너 관리</h3>
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>렌탈샵고유ID</th>
                        <th>렌탈샵명</th>                        
                        <th>전화번호</th>
                        <th>이메일</th>
                        <th>등록일</th>
                        <th>사업자등록번호</th>
                        <th>유효사업자여부</th>
                        <th>휴/폐업진위확인</th>                
                    </tr>
                    </thead>
                    <tbody>
                    {/* {rents.length > 0 ? (
                        pagedRents.map((rent) => (
                        <tr 
                            key={rent.rentId} 
                            onClick={() => {
                            handleRowClick(rent);                                        
                            }}                  
                            className={selectedRent && selectedRent.rentId === rent.rentId ? 'selected-row' : ''}
                        > 
                            <td>{rent.rentId || '-'}</td>                 
                            <td>{rent.name}</td>                  
                            <td>{rent.userUserName || '-'}</td>
                            <td>{rent.userName || '-'}</td>
                            <td>{rent.userPhone}</td>                  
                            <td>{rent.userEmail}</td>
                            <td>{formatDate1(rent.createdAt)  || '-'}</td>
                            <td>{rent.bizRegNumber || '-'}</td>
                            <td>{rent.bizStatus === "Y" ? "유효" : "무효" || '-'}</td>
                            <td>{rent.bizClosureFlag === "N" ? "휴업" : "폐업" || '-'}</td>
                                        
                        </tr>                
                        ))
                    ) : ( */}
                        <tr>
                        <td colSpan="9">사용자 정보가 없습니다.</td>
                        </tr>
                    {/* )}             */}
                    </tbody>          
                </table>
            </button>

        </div>
    )
}
export default BannerActiveTable;