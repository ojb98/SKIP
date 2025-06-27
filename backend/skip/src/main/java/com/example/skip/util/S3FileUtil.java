package com.example.skip.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3FileUtil {

    private final S3Client s3Client;

    @Value("${cloud.aws.bucket-name}")
    private String bucketName;

    @Value("${cloud.aws.region.static}")
    private String region;

    // 파일 등록
    public String uploadFile(MultipartFile file, String subDir) {
        try {
            String key = subDir + File.separator + UUID.randomUUID() + "_" + file.getOriginalFilename();

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    //.acl(ObjectCannedACL.PUBLIC_READ)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;
        } catch (IOException | S3Exception e) {
            log.error("S3 업로드 실패", e);
            throw new RuntimeException("S3 업로드 중 오류 발생", e);
        }
    }

    //파일 수정 시 새로운 파일을 반환하거나, 파일이 없으면 기존 파일을 반환하는 메소드
    public String uploadFileAndUpdateUrl(MultipartFile file, String currentFile, String directory){
        if(file != null && !file.isEmpty()){  //새로운 파일이 있을 경우
            // 기존 파일이 있으면 삭제
            if (currentFile != null && !currentFile.isEmpty() && !"undefined".equalsIgnoreCase(currentFile)) {
                try {
                    System.out.println("기존파일 ===============> "+currentFile);
                    deleteFile(currentFile);
                } catch (Exception e) {
                    e.printStackTrace();  // 파일 삭제 실패 시 로그에 기록
                }
            }
            // 새로운 파일 업로드
            return uploadFile(file, directory);  // 새 이미지 S3 업로드
        }

        // 파일이 없으면 기존 파일 그대로 반환
        return currentFile;
    }

    public void deleteFile(String fileUrl) {
        try {
            // 정확한 prefix 지정
            String prefix = "https://" + bucketName + ".s3." + region + ".amazonaws.com/";

            // fileUrl이 해당 형식인지 체크
            if (!fileUrl.startsWith(prefix)) {
                throw new IllegalArgumentException("S3 URL 형식이 올바르지 않습니다: " + fileUrl);
            }

            // S3에 저장된 key 부분만 추출 (예시: rents/45d42c2b-a5ae-49d9-b4e4-285d6615cfba_곤지암.jpeg)
            String key = fileUrl.substring(prefix.length());

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);

            log.info("S3 파일 삭제 성공: {}", key);
        } catch (Exception e) {
            log.error("S3 파일 삭제 실패: {}", fileUrl, e);
        }
    }
}