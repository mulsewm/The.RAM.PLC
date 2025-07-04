import axios from 'axios';

async function testSimple() {
  try {
    const response = await axios.get('http://localhost:5003/api/registrations', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtY29rYmI5djAwMDBzNWx0NzF5ampiaXkiLCJpYXQiOjE3NTE2MjI2MTksImV4cCI6MTc1MjIyNzQxOX0.53AnDxW8-ZfIh1hf24Vk6F293Ws-w1HRYjLDH7h69QY'
      }
    });
    console.log('Response:', response.data);
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

testSimple();
