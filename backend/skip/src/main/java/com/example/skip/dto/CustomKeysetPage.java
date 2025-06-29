package com.example.skip.dto;

import com.blazebit.persistence.Keyset;
import com.blazebit.persistence.KeysetPage;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomKeysetPage implements KeysetPage {

    private int firstResult;
    private int maxResults;
    private CustomKeyset lowest;
    private CustomKeyset highest;
    private List<CustomKeyset> keysets;


    public CustomKeysetPage(KeysetPage keysetPage) {
        firstResult = keysetPage.getFirstResult();
        maxResults = keysetPage.getMaxResults();
        lowest = new CustomKeyset(keysetPage.getLowest());
        highest = new CustomKeyset(keysetPage.getHighest());
        keysets = keysetPage.getKeysets().stream().map(CustomKeyset::new).toList();
    }

    @Override
    public int getFirstResult() {
        return firstResult;
    }

    @Override
    public int getMaxResults() {
        return maxResults;
    }

    @Override
    public Keyset getLowest() {
        return lowest;
    }

    @Override
    public Keyset getHighest() {
        return highest;
    }

    @Override
    public List<Keyset> getKeysets() {
        return keysets.stream().map(k -> (Keyset) k).toList();
    }
}
