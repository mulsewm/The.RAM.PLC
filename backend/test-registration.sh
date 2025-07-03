#!/bin/bash

# Test registration endpoint
curl -X POST http://localhost:5002/api/registrations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "nationality": "US",
    "currentCountry": "US",
    "profession": "Software Engineer",
    "yearsOfExperience": 5,
    "educationLevel": "BACHELORS",
    "skills": ["JavaScript", "TypeScript", "Node.js"],
    "languages": ["English", "Spanish"],
    "preferredCountries": ["US", "CA", "UK"],
    "visaType": "WORK",
    "relocationTimeline": "2024-01-01",
    "documents": []
  }'
