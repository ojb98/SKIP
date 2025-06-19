import axios from "axios";
import { useEffect, useRef, useState } from "react";
import '../../css/rentInsertForm.css';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import caxios from "../../api/caxios";

const RentInsertForm=()=>{

    //userId값 꺼내오기
    const profile = useSelector(state => state.loginSlice);
    console.log("profile=====>",profile);

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        userId: profile.userId, 
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
    }) 


    const fileRefs = {
        thumbnail: useRef(),
        image1: useRef(),
        image2: useRef(),
        image3: useRef()
    }

    //이동
    const navigate=useNavigate();
    //진위여부버튼 상태
    const [isBizChecked, setIsBizChecked] = useState(false);

    //카테고리 
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await caxios.get('/api/enums/rentCategory');
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

    //주소
    const handleAddressSearch=()=>{
        new window.daum.Postcode({
            oncomplete: (data) => {
                setFormData({
                    ...formData,
                    postalCode: data.zonecode,
                    basicAddress: data.jibunAddress || streetAddress,
                    streetAddress: data.roadAddress
                });
            }
        }).open();

    };


    //사업자등록
    const handleBizNumberCheck = async()=>{
        if(!formData.bizRegNumber){
            alert("사업자등록번호를 입력하세요.");
            return;
        }

        // 하이픈 포함 여부 확인
        if (formData.bizRegNumber.includes("-")) {
            alert("사업자등록번호는 하이픈(-) 없이 숫자만 입력해주세요.");
            return;
        }

        try {
            const response = await caxios.post("http://localhost:8080/api/business/verify", {
                bizRegNumber: formData.bizRegNumber  // 백엔드에서 기대하는 이름과 맞추기
            });


            console.log("응답 데이터: ", response.data);

            //응답이 data 배열 형태일 경우
            const bizInfo = response.data;

            if (!bizInfo) {
                alert("사업자 정보를 찾을 수 없습니다.");
                return;
            }

            // 국세청에 등록되지 않은 사업자
            if (bizInfo.utcc_yn === "") {
                alert("국세청에 등록되지 않은 사업자등록번호입니다.");
                setFormData({
                    ...formData,
                    bizStatus: "",        
                    bizClosureFlag: "",    
                });
                return;
            }

            setFormData({
                ...formData,
                bizStatus: bizInfo.b_stt_cd === "01" ? "Y" : "N", // 예: 01이면 유효한 사업자
                bizClosureFlag: bizInfo.utcc_yn,

            });

            setIsBizChecked(true);

        } catch (error) {
            console.error("사업자 진위 확인 실패", error);
            alert("사업자번호 확인 중 오류가 발생했습니다.");
        }
        
    };


    //등록
    const handleSubmit = async(e) => {
        e.preventDefault();
        
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        if (name === "bizRegNumber") {
            setIsBizChecked(false);  // 사업자번호 변경 시 진위확인 초기화
        }

        if (!isBizChecked) {
            alert("사업자등록번호 진위확인을 먼저 해주세요.");
            return;
        }


        if(!formData.category || !formData.name || !formData.phone || !formData.bizRegNumber || !formData.postalCode || !formData.basicAddress || !formData.streetAddress){
            alert("필수 항목을 모두 입력해주세요.");
        }

        // 전화번호에 숫자와 하이픈(-)만 포함되는지 검사
        const phonePattern = /^[0-9-]+$/;

        if (!phonePattern.test(formData.phone)) {
            alert("전화번호 형식이 올바르지 않습니다");
            return;
        }

        // 하이픈 포함 여부도 검사
        if (!formData.phone.includes("-")) {
            alert("전화번호는 하이픈(-)을 포함해서 입력해주세요. 예: 010-1234-5678");
            return;
        }

        // 사업자 상태가 Y이면서 휴업/폐업 여부가 N인지를 확인
        if (formData.bizStatus !== 'Y' && formData.bizClosureFlag === 'Y') {
            alert("운영중인 사업자가 아닙니다.");
            return;
        }

        try {
            // DB에서 사업자등록번호 중복 체크
            const resp = await caxios.get("http://localhost:8080/api/business/duplicate", {
                params: { bizRegNumber: formData.bizRegNumber }
            });

            if (resp.data === true) {
                alert("이미 등록된 사업자등록번호입니다.");
                return;
            }
        } catch (error) {
                console.error("사업자번호 중복 체크 실패", error);
                alert("사업자번호 중복 확인 중 오류가 발생했습니다.");
            return;
        }
        
        //ref값 얻어오기
        const thumbnailInput = fileRefs.thumbnail.current;

        if (!thumbnailInput || thumbnailInput.files.length === 0) {
            alert("썸네일 이미지는 필수입니다.");
            return;
        }

        //FormData는 파일 업로드가 포함된 multipart/form-data 전송을 위해 사용
        //텍스트 + 파일을 한 번에 보낼 수 있는 특수한 객체
        const submitData = new FormData();

        for(const key in formData){
            submitData.append(key,formData[key]);
        }

        //FormData객체에 파일 추가
        submitData.append("thumbnail",thumbnailInput.files[0]);

        //이미지 있다면 FormData객체에 추가
        ["image1","image2", "image3"].forEach((key) => {
            const fileInput = fileRefs[key].current;
            if(fileInput && fileInput.files.length > 0 ){
                submitData.append(key,fileInput.files[0]);
            }
        });

        caxios.post("http://localhost:8080/api/rents",submitData, {
            headers:{
                "Content-Type" : "multipart/form-data"
            }
        })
        .then((res)=>{
            console.log("rent insert success==>",res);
            alert("렌탈샵이 등록이 완료했습니다.");

            
            //초기화
            setFormData({
                userId: "",
                category: "",
                name: "",
                phone: "",
                postalCode: "",
                basicAddress: "",
                streetAddress: "",
                detailedAddress: "",
                bizRegNumber: "",
                bizStatus: "",
                bizClosureFlag: "",
                description: "",
            });

            //file input 초기화
            Object.values(fileRefs).forEach(ref => {
                if (ref.current) {
                    ref.current.value = null;
                }
            });
            
            //여기 useNavigetor 사용해서 이동(원하는 페이지로 이동)
            navigate("/rentAdmin/list")            

        })
        .catch((err)=>{
            console.log("렌탈샵 등록 실패", err);
            alert("렌탈샵 등록중 오류 발생")
        });
    }



    return (
        <div className="rent-container">
            <h1 className="top-subject">가맹점 등록하기</h1>
            <div className="form-container">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="hidden" id="userId" name="userId" value={formData.userId} />
                <div className="form-group">
                    <label htmlFor="category">*카테고리</label>
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
                    <label htmlFor="name">*상호명</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">*전화번호</label>
                    <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="010-111-1234" required />
                </div>
                <div className="form-group">
                    <label htmlFor="postalCode">*우편번호</label>
                    <div className="flex">
                        <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} readOnly />
                        <button type="button" onClick={handleAddressSearch}>주소 검색</button>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="basicAddress">*지번 주소</label>
                    <input type="text" id="basicAddress" name="basicAddress" value={formData.basicAddress} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="streetAddress">*도로명 주소</label>
                    <input type="text" id="streetAddress" name="streetAddress" value={formData.streetAddress} readOnly />
                </div>  
                <div className="form-group">
                    <label htmlFor="detailedAddress">상세 주소</label>
                    <input type="text" id="detailedAddress" name="detailedAddress" onChange={handleChange} />
                </div>
                
                <div className="form-group">
                    <label htmlFor="bizRegNumber">*사업자 등록번호</label>
                    <div className="flex">
                        <input type="text" id="bizRegNumber" name="bizRegNumber" value={formData.bizRegNumber} onChange={handleChange} placeholder="숫자만 입력하세요" required/>
                        <button type="button" onClick={handleBizNumberCheck}>진위확인</button>
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


                {/* accept="image/*" : 모든 종류의 이미지(JPEG, PNG, GIF 등)만 선택 */}
                <div className="form-group">
                    <label htmlFor="thumbnail">*썸네일 이미지</label>
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

                <button type="submit">등록</button>
            </form>
            </div>
        </div>
    )
}
export default RentInsertForm;


