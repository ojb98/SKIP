package com.example.skip.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

@Data
@Builder
@Document(indexName = "rent")
@AllArgsConstructor
public class RentDocument {
    @Id
    private String rentId;

    private String name;

    private String regionFullName;

    private String regionShortname;

    private String streetAddress;

    private String basicAddress;
}
