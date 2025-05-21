import axios from "axios";
import { useEffect, useRef, useState } from "react";
import '../css/RentInsertForm.css';

const RentInsertForm=()=>{

    //스토어에서 나중에 userId값 꺼내오기

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        userId: "1",
        category: '',
        name: '',
        phone: '',
        postalCode: '',
        basicAddress: '',
        streetAddress: '',
        detailedAddress: '',
        description: '',
        status: 'PENDING',
        useYn: 'Y',
        remainAdCash: 0,
        bizRegNumber: '',
        isValid: '',
        regNumberValidity: '',
        regCheckDate: '',
        createdAt: new Date().toISOString(),
        
    }) 


    const fileRefs = {
        thumbnail: useRef(),
        image1: useRef(),
        image2: useRef(),
        image3: useRef()
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/enums/rentCategory');
                console.log("카테고리 데이터: ", response.data);
                setCategories(response.data);
            } catch (error) {
                console.error("카테고리 불러오기 실패==>", error);
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);


    const handleChange=(e)=>{

        const {name,value} = e.target;

        setFormData({
            ...formData,
            [name] : value
        })
    }

    const handleAddressSearch=()=>{
        new window.daum.Postcode({
            oncomplete: (data) => {
                setFormData({
                    ...formData,
                    postalCode: data.zonecode,
                    basicAddress: data.jibunAddress,
                    streetAddress: data.roadAddress
                });
            }
        }).open();

    };


    const handleBizNumberCheck = async()=>{
        if(!formData.bizRegNumber){
            alert("사업자등록번호를 입력하세요.");
            return;
        }

    try {
        const response = await axios.post("http://localhost:8080/api/business/verify", {
            bizRegNumber: formData.bizRegNumber  // 백엔드에서 기대하는 이름과 맞추기
        });

        const { isValid, regNumberValidity, regCheckDate } = response.data;

        setFormData((prev) => ({
            ...prev,
            isValid,
            regNumberValidity,
            regCheckDate,
        }));

        } catch (error) {
            console.error("사업자 진위 확인 실패", error);
            alert("사업자번호 확인 중 오류가 발생했습니다.");
        }

        
    };


    const handleSubmit=()=>{


    }

    return (
        <div className="form-container">
            <h1>가맹점 등록하기</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="hidden" id="userId" name="userId" value={formData.userId} />
                <div className="form-group">
                    <label htmlFor="category">카테고리</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange}>
                        <option value="">카테고리를 선택하세요</option>
                        {
                            categories.map((cat,index) => (
                                <option key={index} value={cat.code}>
                                {cat.label}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="name">상호명</label>
                    <input type="text" id="name" name="name" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">전화번호</label>
                    <input type="text" id="phone" name="phone" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="postalCode">우편번호</label>
                    <div className="flex">
                        <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} readOnly />
                        <button type="button" onClick={handleAddressSearch}>주소 검색</button>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="basicAddress">지번 주소</label>
                    <input type="text" id="basicAddress" name="basicAddress" value={formData.basicAddress} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="streetAddress">도로명 주소</label>
                    <input type="text" id="streetAddress" name="streetAddress" value={formData.streetAddress} readOnly />
                </div>  
                <div className="form-group">
                    <label htmlFor="detailedAddress">상세 주소</label>
                    <input type="text" id="detailedAddress" name="detailedAddress" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="bizRegNumber">사업자 등록번호</label>
                    <div className="flex">
                        <input type="text" id="bizRegNumber" name="bizRegNumber" value={formData.bizRegNumber} onChange={handleChange} placeholder="숫자만 입력하세요" required/>
                        <button type="button" onClick={handleBizNumberCheck}>진위확인</button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="isValid">유효한 사업자여부</label>
                    <input type="text" name="isValid" id="isValid" value={formData.isValid} readOnly/>
                </div>

                <div className="form-group">
                    <label htmlFor="regNumberValidity">진위여부</label>
                    <input type="text" name="regNumberValidity" id="regNumberValidity" value={formData.regNumberValidity} readOnly/>
                </div>

                <div className="form-group">
                    <label htmlFor="regCheckDate">사업자등록날짜</label>
                    <input type="text" name="regCheckDate" id="regCheckDate" value={formData.regCheckDate} readOnly/>
                </div>

                {/* accept="image/*" : 모든 종류의 이미지(JPEG, PNG, GIF 등)만 선택 */}
                <div className="form-group">
                    <label htmlFor="thumbnail">썸네일 이미지</label>
                    <input type="file" id="thumbnail" name="thumbnail" ref={fileRefs.thumbnail} accept="image/*" />
                </div>
                <div className="form-group">
                    <label htmlFor="image1">이미지 1</label>
                    <input type="file" id="image1" name="image1" ref={fileRefs.image1} accept="image/*" />
                </div>
                <div className="form-group">
                    <label htmlFor="image2">이미지 2</label>
                    <input type="file" id="image2" name="image2" ref={fileRefs.image2} accept="image/*" />
                </div>
                <div className="form-group">
                    <label htmlFor="image3">이미지 3</label>
                    <input type="file" id="image3" name="image3" ref={fileRefs.image3} accept="image/*" />
                </div>

                <div className="form-group">
                    <label htmlFor="description">설명</label>
                    <textarea id="description" name="description" onChange={handleChange}></textarea>
                </div>
                <input type="hidden" name="status" value={formData.status} />
                <input type="hidden" name="useYn" value={formData.useYn} />
                <input type="hidden" name="remainAdCash" value={formData.remainAdCash} />
                <input type="hidden" name="createdAt" value={formData.createdAt} />

                <button type="submit">렌탈샵 등록</button>
            </form>
        </div>
    )
}
export default RentInsertForm;



