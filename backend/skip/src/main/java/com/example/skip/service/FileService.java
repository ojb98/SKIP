package com.example.skip.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {

    @Value("${file.upload-path}")
    private String uploadDir;

    public String uploadFile(MultipartFile file,String subDir){
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            String uploadPath = uploadDir + subDir;

            Path path = Paths.get(uploadPath); //String -> Path객체 변환
            if(Files.notExists(path)){  //해당 경로에 파일 또는 디렉토리가 존재하지 않으면
                Files.createDirectories(path);  //디렉토리 생성
            }

            //파일명 (UUID + 원본파일명)
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            //저장할 파일 경로 (디렉토리 + 파일명)
            Path filePath = path.resolve(fileName);

            //파일 복사하기
            file.transferTo(filePath);

            //프론트에서 접근할수 있는 경로(URL : /images/{subDir}/{filename})
            return "/images/" + subDir + "/" + fileName;

        }catch (IOException ie){
            throw new RuntimeException("파일업로드 실패", ie);
        }
    }

    //파일 삭제
    public void deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            Files.delete(path);  // 실제 파일 삭제
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 실패", e);
        }
    }

}
