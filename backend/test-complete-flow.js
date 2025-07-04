import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'http://localhost:5003/api/registrations';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtY29rYmI5djAwMDBzNWx0NzF5ampiaXkiLCJpYXQiOjE3NTE2MjI2MTksImV4cCI6MTc1MjIyNzQxOX0.53AnDxW8-ZfIh1hf24Vk6F293Ws-w1HRYjLDH7h69QY';
const USER_ID = 'cmcokbb9v0000s5lt71yjjbiy';

const testFiles = {
  resume: 'test_resume.pdf',
  passportOrId: 'test_passport.jpg',
  professionalCertificates: ['cert1.pdf', 'cert2.pdf'],
  policeClearance: 'police_clearance.pdf'
};

async function createTestRegistration() {
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
      userId: USER_ID
    };

    console.log('\n1. Creating new registration...');
    const response = await axios.post(API_BASE_URL, registrationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    const registrationId = response.data.data.id;
    console.log(`✅ Registration created with ID: ${registrationId}`);
    
    return registrationId;
  } catch (error) {
    console.error('Error creating registration:', error.response?.data || error.message);
    throw error;
  }
}

async function uploadFiles(registrationId) {
  try {
    console.log('\n2. Uploading files...');
    const form = new FormData();
    
    // Add files to form data
    for (const [field, fileNames] of Object.entries(testFiles)) {
      if (Array.isArray(fileNames)) {
        for (const fileName of fileNames) {
          const filePath = path.join(__dirname, fileName);
          if (fs.existsSync(filePath)) {
            form.append(field, fs.readFileSync(filePath), fileName);
            console.log(`✅ Added ${field}: ${fileName}`);
          } else {
            console.warn(`⚠️  File not found: ${fileName}`);
          }
        }
      } else {
        const filePath = path.join(__dirname, fileNames);
        if (fs.existsSync(filePath)) {
          form.append(field, fs.readFileSync(filePath), fileNames);
          console.log(`✅ Added ${field}: ${fileNames}`);
        } else {
          console.warn(`⚠️  File not found: ${fileNames}`);
        }
      }
    }

    // Convert form data to buffer for proper content-length calculation
    const formData = await new Promise((resolve, reject) => {
      form.getLength((err, length) => {
        if (err) reject(err);
        const data = form.getBuffer();
        resolve({ data, length });
      });
    });

    const response = await axios.post(
      `${API_BASE_URL}/${registrationId}/documents`,
      formData.data,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Length': formData.length
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    console.log('✅ Files uploaded successfully');
    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error.response?.data || error.message);
    throw error;
  }
}

async function getRegistration(registrationId) {
  try {
    console.log('\n3. Fetching registration details...');
    const response = await axios.get(`${API_BASE_URL}/${registrationId}`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    console.log('✅ Registration details:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error fetching registration:', error.response?.data || error.message);
    throw error;
  }
}

async function updateRegistrationStatus(registrationId, status) {
  try {
    console.log(`\n4. Updating registration status to ${status}...`);
    const response = await axios.patch(
      `${API_BASE_URL}/${registrationId}/status`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      }
    );
    
    console.log(`✅ Status updated to ${status}`);
    return response.data;
  } catch (error) {
    console.error('Error updating status:', error.response?.data || error.message);
    throw error;
  }
}

async function runTests() {
  try {
    // 1. Create a new registration
    console.log('\n=== Starting Registration Test ===');
    const registrationId = await createTestRegistration();
    
    // 2. Get registration details
    console.log('\n=== Testing Registration Retrieval ===');
    await getRegistration(registrationId);
    
    // 3. Update status to 'UNDER_REVIEW'
    console.log('\n=== Testing Status Update ===');
    await updateRegistrationStatus(registrationId, 'UNDER_REVIEW');
    
    // 4. Get updated registration to verify status change
    console.log('\n=== Verifying Status Update ===');
    const updatedRegistration = await getRegistration(registrationId);
    
    if (updatedRegistration.data.status === 'UNDER_REVIEW') {
      console.log('✅ Status update verified successfully');
    } else {
      console.error('❌ Status update verification failed');
      throw new Error('Status update verification failed');
    }
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();
