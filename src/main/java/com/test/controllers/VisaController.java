package com.test.controllers;

import com.framework.annotation.RestController;
import com.framework.annotation.PostMapping;
import com.framework.annotation.RequestBody;
import com.framework.util.ResponseEntity;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

@RestController
public class VisaController {

    private static final String API_URL = "http://localhost:8888/api/visa/demandes"; // À MODIFIER avec l'URL de votre ami
    private static final Gson gson = new Gson();

    @PostMapping("/submitVisa")
    public ResponseEntity submitVisa(@RequestBody Map<String, Object> visaData) {
        try {
            System.out.println("Donnees recues du formulaire: " + gson.toJson(visaData));

            // Convertir les données en JSON
            String jsonBody = gson.toJson(visaData);

            // Envoyer à l'API 
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest apiRequest = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> apiResponse = client.send(apiRequest, HttpResponse.BodyHandlers.ofString());
            
            String responseBody = apiResponse.body();
            System.out.println("Reponse de l'API: " + responseBody);

            // Retourner la réponse de l'API
            return ResponseEntity.ok(responseBody);

        } catch (Exception e) {
            System.out.println("Erreur: " + e.getMessage());
            e.printStackTrace();
            
            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("error", e.getMessage());
            errorResponse.addProperty("status", "error");
            
            return ResponseEntity.status(500).body(errorResponse.toString());
        }
    }
}


