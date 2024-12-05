package com.example.socialconnect.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;

import jakarta.annotation.PostConstruct;

@Service
public class FileUploadService {
    @Value("${aws.s3.bucketName}")
    private String bucketName;

    @Value("${aws.s3.accessKey}")
    private String accessKey;

    @Value("${aws.s3.secretKey}")
    private String secretKey;

    private AmazonS3 s3Client;

    @PostConstruct
    private void initialize() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
        s3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .withRegion(Regions.US_EAST_2)
                .build();
    }

    public String uploadFile(MultipartFile multipartFile) throws FileUploadException, IOException{
        String filePath = "";
        try {
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(multipartFile.getContentType());
            File processedFile;
            if (multipartFile.getContentType().equals("video/mp4") || multipartFile.getContentType().equals("video/quicktime")) {
                processedFile = formatVideo(multipartFile);
            } else {
                processedFile = File.createTempFile("temp", null);
                multipartFile.transferTo(processedFile);
            }
            

            filePath = multipartFile.getOriginalFilename();
            s3Client.putObject(bucketName, filePath, processedFile);

            // if (!processedFile.delete()) {
            //     System.out.println("Error deleting processed file");
            // }
        } catch (Exception e) {
            throw new FileUploadException("Error occurred in file upload ==> "+e.getMessage());
        }
        return filePath;
    }

    public void deleteFile(String fileName) {
        s3Client.deleteObject(bucketName, fileName.substring(fileName.lastIndexOf("/")+1));
    }

    private File formatVideo(MultipartFile file) throws IOException, InterruptedException {
    if (!file.isEmpty()) {
        String uploadsDir = "/uploads/";
        String realPathtoUploads = System.getProperty("user.dir") + uploadsDir;
        File uploadDir = new File(realPathtoUploads);
        if (!uploadDir.exists()) {
            System.out.println("Creating upload directory");
            uploadDir.mkdir();
        }

        // Original file path (input)
        String orgName = file.getOriginalFilename();
        String inputFilePath = realPathtoUploads + orgName;
        File inputFile = new File(inputFilePath);
        file.transferTo(inputFile);

        String outputFileName = "processed_" + orgName;
        String outputFilePath = realPathtoUploads + outputFileName;
        File outputFile = new File(outputFilePath);

        ProcessBuilder processBuilder = new ProcessBuilder(createFFmpegCommand(inputFilePath, outputFilePath));
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        consumeProcessOutput(process);

        int exitCode = process.waitFor(60, TimeUnit.SECONDS) ? process.exitValue() : -1;
        if (exitCode != 0) {
            throw new IOException("FFmpeg processing failed with exit code: " + exitCode);
        }
        if (!inputFile.delete()) {
            System.out.println("Error deleting original file");
        }
        return outputFile;
    } else {
        throw new IOException("File is empty.");
    }
}

private List<String> createFFmpegCommand(String inputFilePath, String outputFilePath) {
    List<String> command = new ArrayList<>();
    command.add("ffmpeg");
    command.add("-i");
    command.add(inputFilePath);
    command.add("-vf");
    command.add("scale=1080:1920");
    command.add("-c:v");
    command.add("libx264");
    command.add("-c:a");
    command.add("aac");
    command.add("-b:a");
    command.add("128k");
    command.add("-strict");
    command.add("experimental");
    command.add("-movflags");
    command.add("+faststart");
    //command.add("-ignore_unknown");
    // command.add("-f");
    // command.add("MP4");
    command.add(outputFilePath);
    return command;
}

private void consumeProcessOutput(Process process) throws IOException {
    // Consume and discard process output to prevent buffer from blocking
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
    }
}

}
