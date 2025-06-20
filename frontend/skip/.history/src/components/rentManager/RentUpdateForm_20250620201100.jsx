import axios from "axios";
import { useEffect, useRef, useState } from "react";
import '../../css/rentInsertForm.css';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import caxios from "../../api/caxios";
import { Lock, Pencil } from "lucide-react";

const RentUpdateForm = () => {
    const { rentId } = useParams();
    const profile = useSelector(state => state.loginSlice);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [isBizChecked, setIsBizChecked] = useState(false);

    const [bizRegNumberReadonly, setBizRegNumberReadonly] = useState(true);

    const toggleBizRegReadonly = () => {
        setBizRegNumberReadonly(prev => !prev);
    };

    const [formData, setFormData] = useState({
        rentId: "",
        userId: profile.userId || "",
        category: '',
        name: '',
        phone: '',
        postalCode: '',
        basicAddress: '',
        streetAddress: '',
        detailedAddress: '',
        description: '',
        bizRegNumber: '',
        bizStatus: '',
        bizClosureFlag: '',
    });

    const fileRefs = {
        thumbnail: useRef(),
        image1: useRef(),
        image2: useRef(),
        image3: useRef()
    };

    useEffect(() => {
        const fetchRent = async () => {
            try {
                const res = await caxios.get(/api/rents/${rentId});
                const data = res.data;
                setFormData(prev => ({
                    ...prev,
                    rentId: data.rentId,
                    userId: data.userId,
                    category: data.category,
                    name: data.name,
                    phone: data.phone,
                    postalCode: data.postalCode,
                    basicAddress: data.basicAddress,
                    streetAddress: data.streetAddress,
                    detailedAddress: data.detailedAddress,
                    description: data.description,
                    bizRegNumber: data.bizRegNumber,
                    bizStatus: data.bizStatus,
                    bizClosureFlag: data.bizClosureFlag
                }));
                setIsBizChecked(true);
            } catch (err) {
                console.error("렌탈 정보 불러오기 실패", err);
                alert("렌탈 정보를 불러오지 못했습니다.");
                navigate("/rentAdmin/list");
            }
        };
        fetchRent();
        caxios.get('/api/enums/rentCategory')
            .then(res => setCategories(res.data))
            .catch(err => {
                console.error("카테고리 불러오기 실패", err);
                setCategories([]);
            });
    }, [rentId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === "bizRegNumber") {
            setIsBizChecked(false);
        }
    };

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: (data) => {
                setFormData(prev => ({
                    ...prev,
                    postalCode: data.zonecode,
                    basicAddress: data.jibunAddress || data.autoJibunAddress,
                    streetAddress: data.roadAddress
                }));
            }
        }).open();
    };

    const handleBizNumberCheck = async () => {
        if (!formData.bizRegNumber || formData.bizRegNumber.includes("-")) {
            alert("사업자등록번호를 하이픈 없이 입력하세요.");
            return;
        }
        try {
            const response = await caxios.post("/api/business/verify", {
                bizRegNumber: formData.bizRegNumber
            });
            const bizInfo = response.data;
            if (!bizInfo || bizInfo.utcc_yn === "") {
                alert("유효하지 않은 사업자입니다.");
                setFormData(prev => ({
                    ...prev,
                    bizStatus: "",
                    bizClosureFlag: ""
                }));
                return;
            }
            setFormData(prev => ({
                ...prev,
                bizStatus: bizInfo.b_stt_cd === "01" ? "Y" : "N",
                bizClosureFlag: bizInfo.utcc_yn
            }));
            setIsBizChecked(true);
        } catch (err) {
            console.error("사업자번호 진위확인 실패", err);
            alert("진위확인 중 오류 발생");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isBizChecked) {
            alert("사업자 진위확인을 먼저 해주세요.");
            return;
        }
        const requiredFields = ["category", "name", "phone", "bizRegNumber", "postalCode", "basicAddress", "streetAddress"];
        for (const field of requiredFields) {
            if (!formData[field]) {
                alert("필수 항목을 모두 입력해주세요.");
                return;
            }
        }
        const phonePattern = /^[0-9-]+$/;
        if (!phonePattern.test(formData.phone) || !formData.phone.includes("-")) {
            alert("전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678");
            return;
        }
        if (formData.bizStatus !== 'Y' && formData.bizClosureFlag === 'Y') {
            alert("운영 중인 사업자가 아닙니다.");
            return;
        }
        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });
        Object.entries(fileRefs).forEach(([key, ref]) => {
            if (ref.current && ref.current.files.length > 0) {
                submitData.append(key, ref.current.files[0]);
            }
        });
        try {
            await caxios.post("/api/rents/update", submitData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("렌탈샵 정보가 수정되었습니다.");
            navigate("/rentAdmin/list");
        } catch (err) {
            console.error("렌탈샵 수정 실패", err);
            alert("렌탈샵 수정 중 오류 발생");
        }
    };

    return (
        <div className="rent-page-wrapper">
            <h1 className="top-subject">가맹점 수정하기</h1>
            <div className="rent-detail-wrapper" style={{ maxWidth: 600, margin: '0 auto' }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input type="hidden" name="rentId" value={formData.rentId} />
                    <input type="hidden" name="userId" value={formData.userId} />
                    <div className="form-group">
                        <label htmlFor="category"><span className="required">*</span>카테고리</label>
                        <select name="category" id="category" value={formData.category} onChange={handleChange} disabled>
                            <option value="">카테고리를 선택하세요</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat.code}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name"><span className="required">*</span>상호명</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone"><span className="required">*</span>전화번호</label>
                        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="010-111-1234" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="postalCode"><span className="required">*</span>우편번호</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} readOnly style={{ flex: 1 }} />
                            <button type="button" onClick={handleAddressSearch} className="rent-insert-btn" style={{ width: 120 }}>주소 검색</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="basicAddress"><span className="required">*</span>지번 주소</label>
                        <input type="text" id="basicAddress" name="basicAddress" value={formData.basicAddress} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="streetAddress"><span className="required">*</span>도로명 주소</label>
                        <input type="text" id="streetAddress" name="streetAddress" value={formData.streetAddress} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="detailedAddress">상세 주소</label>
                        <input type="text" id="detailedAddress" name="detailedAddress" value={formData.detailedAddress} onChange={handleChange} />
                    </div>
                    <span style={{ color: '#e74c3c', fontSize: 13, display: 'block', marginBottom: 10 }}>*사업자등록번호 변경시 다시 심사 받아야 합니다.</span>
                    <div className="form-group">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <label htmlFor="bizRegNumber">사업자 등록번호</label>
                            <button type="button" onClick={toggleBizRegReadonly} className="rent-readonly-btn" style={{ width: 32, height: 32, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                {bizRegNumberReadonly ? (
                                    <Pencil width={20} />
                                  
                                ) : (
                                    <Lock width={20} />
                                
                                )}    
                                
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input type="text" id="bizRegNumber" name="bizRegNumber" value={formData.bizRegNumber} onChange={handleChange}
                                readOnly={bizRegNumberReadonly} placeholder="숫자만 입력하세요" required style={{ flex: 1 }} />
                            <button type="button" onClick={handleBizNumberCheck} className="rent-insert-btn" style={{ width: 120 }}>진위확인</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bizStatus">사업자 상태</label>
                        <input type="text" name="bizStatus" id="bizStatus" value={formData.bizStatus} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bizClosureFlag">휴업 및 폐업 여부</label>
                        <input type="text" name="bizClosureFlag" id="bizClosureFlag" value={formData.bizClosureFlag} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="thumbnail"><span className="required">*</span>썸네일 이미지</label>
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
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                </form>
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <button type="submit" form="" className="rent-insert-btn" style={{ width: 180, fontSize: 16 }}>수정</button>
                </div>
            </div>
        </div>
    );
};

export default RentUpdateForm;