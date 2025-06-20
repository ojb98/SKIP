package com.example.skip.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

@Document(indexName = "rent")
public class RentDocument {
    @Id
    private String rentId;

    private String category;

    private String name;

    private String regionFullName;

    private String regionShortname;

    private String streetAddress;

    private String basicAddress;
}
