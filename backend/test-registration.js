import axios from 'axios';

async function testRegistration() {
  try {
    const registrationData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      gender: 'MALE',
      maritalStatus: 'SINGLE',
      email: `testuser_${Date.now()}@example.com`,
      phoneNumber: '+1234567890',
      currentLocation: 'New York',
      profession: 'Software Developer',
      yearsOfExperience: '5',
      jobTitle: 'Senior Developer',
      hasProfessionalLicense: false,
      preferredLocations: ['New York', 'Remote'],
      willingToRelocate: true,
      preferredJobTypes: ['full_time'],
      expectedSalary: 120000,
      noticePeriodValue: 30,
      noticePeriodUnit: 'days',
      references: [{
        name: 'Jane Smith',
        position: 'Manager',
        company: 'Tech Corp',
        email: 'jane@techcorp.com',
        phone: '+1987654321'
      }],
      confirmAccuracy: true,
      termsAccepted: true,
      backgroundCheckConsent: true,
      educationLevel: 'BACHELORS',
      institution: 'University of Technology',
      fieldOfStudy: 'Computer Science',
      graduationYear: 2020,
      educationStatus: 'COMPLETED',
      educationCountry: 'United States',
      educationCity: 'New York',
      country: 'United States',
      city: 'New York',
      address: '123 Main St',
      postalCode: '10001',
      emergencyContactName: 'Jane Doe',
      emergencyContactPhone: '+1987654321',
      status: 'SUBMITTED',
      userId: 'cmcokbb9v0000s5lt71yjjbiy'
    };

    const response = await axios.post('http://localhost:5003/api/registrations', registrationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtY29rYmI5djAwMDBzNWx0NzF5ampiaXkiLCJpYXQiOjE3NTE2MjI2MTksImV4cCI6MTc1MjIyNzQxOX0.53AnDxW8-ZfIh1hf24Vk6F293Ws-w1HRYjLDH7h69QY'
      }
    });

    console.log('Registration successful:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegistration();
