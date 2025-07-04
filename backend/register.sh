#!/bin/bash

# Set the token from the login response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtY29rYmI5djAwMDBzNWx0NzF5ampiaXkiLCJpYXQiOjE3NTE2MjI2MTksImV4cCI6MTc1MjIyNzQxOX0.53AnDxW8-ZfIh1hf24Vk6F293Ws-w1HRYjLDH7h69QY"

# Create test files
echo "This is a test resume" > test_resume.pdf
echo "This is a test passport" > test_passport.jpg
echo "This is certificate 1" > cert1.pdf
echo "This is certificate 2" > cert2.pdf
echo "This is a police clearance" > police_clearance.pdf

# Generate a unique email for testing
UNIQUE_EMAIL="testuser_$(date +%s)@example.com"

# Create a temporary JSON file for the request body
cat > /tmp/registration.json << 'EOF'
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "maritalStatus": "SINGLE",
  "email": "%s",
  "phoneNumber": "+1234567890",
  "currentLocation": "New York",
  "profession": "Software Developer",
  "yearsOfExperience": "5",
  "jobTitle": "Senior Developer",
  "hasProfessionalLicense": false,
  "preferredLocations": ["New York", "Remote"],
  "willingToRelocate": true,
  "preferredJobTypes": ["full_time"],
  "expectedSalary": 120000,
  "noticePeriodValue": 30,
  "noticePeriodUnit": "days",
  "references": [{
    "name": "Jane Smith",
    "position": "Manager",
    "company": "Tech Corp",
    "email": "jane@techcorp.com",
    "phone": "+1987654321"
  }],
  "confirmAccuracy": true,
  "termsAccepted": true,
  "backgroundCheckConsent": true,
  "userId": "cmcokbb9v0000s5lt71yjjbiy",
  
  "educationLevel": "BACHELORS",
  "institution": "University of Technology",
  "fieldOfStudy": "Computer Science",
  "graduationYear": 2020,
  "educationStatus": "COMPLETED",
  "educationCountry": "United States",
  "educationCity": "New York",
  
  "country": "United States",
  "city": "New York",
  "address": "123 Main St",
  "postalCode": "10001",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1987654321",
  "status": "SUBMITTED"
}
EOF

# Replace the email in the JSON file
sed -i.bak "s/\"%s\"/\"$UNIQUE_EMAIL\"/" /tmp/registration.json

# Make the registration request with file uploads using the JSON file
curl -X POST http://localhost:5003/api/registrations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/registration.json

# Clean up test files and temporary JSON
rm test_resume.pdf test_passport.jpg cert1.pdf cert2.pdf police_clearance.pdf /tmp/registration.json /tmp/registration.json.bak
