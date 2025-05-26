package com.example.skip.util;

import java.security.SecureRandom;
import java.util.Random;

public class RandomStringGenerator {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    public static final String ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    public static final String NUMERIC = "0123456789";


    public static final String generate(int length, String charSet) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            stringBuilder.append(charSet.charAt(SECURE_RANDOM.nextInt(charSet.length())));
        }
        return stringBuilder.toString();
    }
}
