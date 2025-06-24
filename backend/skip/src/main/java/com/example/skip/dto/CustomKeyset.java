package com.example.skip.dto;

import com.blazebit.persistence.Keyset;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomKeyset implements Keyset {

    private Serializable[] tuple;


    public CustomKeyset(Keyset keyset) {
        tuple = keyset.getTuple();
    }

    @Override
    public Serializable[] getTuple() {
        return tuple;
    }
}
