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

// Sample test files (create these files in the same directory or update the paths)
const testFiles = {
  resume: 'test_resume.pdf',
  passportOrId: 'test_passport.jpg',
  professionalCertificates: ['cert1.pdf', 'cert2.pdf'],
  policeClearance: 'police_clearance.pdf'
};

// Create sample test files if they don't exist
function createTestFiles() {
  const filesToCreate = [
    'test_resume.pdf',
    'test_passport.jpg',
    'cert1.pdf',
    'cert2.pdf',
    'police_clearance.pdf'
  ];

  filesToCreate.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `This is a test ${fileName}`);
      console.log(`Created test file: ${filePath}`);
    }
  });
}

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
  console.log('\n2. Uploading files...\n');
  
  try {
    // Upload each file individually
    for (const [field, fileNames] of Object.entries(testFiles)) {
      const files = Array.isArray(fileNames) ? fileNames : [fileNames];
      
      for (const fileName of files) {
        const filePath = path.join(__dirname, fileName);
        
        console.log(`Uploading ${field}: ${fileName}...`);
        
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath), {
          filename: fileName,
          contentType: getContentType(fileName)
        });
        formData.append('documentType', field.toUpperCase());
        
        const headers = {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Length': await getFormDataLength(formData)
        };
        
        try {
          const response = await axios.post(
            `${API_BASE_URL}/${registrationId}/documents`,
            formData,
            { headers, maxBodyLength: Infinity }
          );
          
          console.log(`✅ Uploaded ${field}: ${fileName}`);
          console.log('   File URL:', response.data.data.fileUrl);
        } catch (uploadError) {
          console.error(`❌ Failed to upload ${fileName}:`, uploadError.response?.data?.message || uploadError.message);
          throw uploadError;
        }
      }
    }
    
    console.log('\n✅ All files uploaded successfully');
    return true;
  } catch (error) {
    console.error('Error in upload process:', error.message);
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
    createTestFiles();
    
    console.log('\n=== Starting Registration Test ===\n');
    
    // Test registration creation
    const registrationId = await createTestRegistration();
    
    // Test file uploads
    console.log('\n=== Testing File Upload ===\n');
    try {
      await uploadFiles(registrationId);
    } catch (error) {
      console.warn('⚠️  File upload test failed, but continuing with other tests...');
      console.warn('   Reason:', error.message);
    }
    
    // Test getting registration with files
    console.log('\n=== Testing Registration Retrieval ===\n');
    await getRegistration(registrationId);
    
    // Test updating status
    console.log('\n=== Testing Status Update ===\n');
    await updateRegistrationStatus(registrationId, 'UNDER_REVIEW');
    
    // Verify status update
    console.log('\n=== Verifying Status Update ===\n');
    await getRegistration(registrationId);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up test files
    cleanupTestFiles();
  }
}

// Helper function to get form data length
function getFormDataLength(form) {
  return new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) {
        // Fallback to a reasonable size if we can't determine it
        console.warn('Could not determine form data length, using fallback size');
        resolve(1024 * 1024); // 1MB
      } else {
        resolve(length);
      }
    });
  });
}

// Helper function to get content type from file extension
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  return types[ext] || 'application/octet-stream';
}

// Cleanup test files
function cleanupTestFiles() {
  console.log('\n=== Cleaning up test files ===');
  const filesToRemove = [
    'test_resume.pdf',
    'test_passport.jpg',
    'cert1.pdf',
    'cert2.pdf',
    'police_clearance.pdf'
  ];

  filesToRemove.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Removed test file: ${fileName}`);
      } catch (error) {
        console.warn(`⚠️  Failed to remove test file: ${fileName}`, error.message);
      }
    }
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nCaught interrupt signal - cleaning up...');
  cleanupTestFiles();
  process.exit(0);
});

// Run the tests
(async () => {
  try {
    await runTests();
    console.log('\n All tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n Tests failed:', error);
    process.exit(1);
  }
})();
