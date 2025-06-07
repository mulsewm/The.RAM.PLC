import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
  loginUrl: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  name,
  loginUrl,
}) => (
  <div style={{
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    lineHeight: '1.6',
    color: '#333',
  }}>
    <h1 style={{
      color: '#1f2937',
      fontSize: '24px',
      marginBottom: '20px',
    }}>
      Welcome to RAM Partner Portal, {name}!
    </h1>
    
    <p>Your account has been successfully created. You can now log in to the partner portal using your email address.</p>
    
    <p>To get started, please click the button below to log in:</p>
    
    <div style={{
      margin: '30px 0',
      textAlign: 'center',
    }}>
      <a
        href={loginUrl}
        style={{
          display: 'inline-block',
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '12px 24px',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        Log In to Partner Portal
      </a>
    </div>
    
    <p style={{
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '1px solid #e5e7eb',
    }}>
      If the button doesn't work, you can copy and paste this URL into your browser:
      <br />
      <a href={loginUrl} style={{
        color: '#3b82f6',
        wordBreak: 'break-all',
      }}>
        {loginUrl}
      </a>
    </p>
    
    <p style={{
      marginTop: '30px',
      fontSize: '14px',
      color: '#6b7280',
    }}>
      If you didn't request this account, please contact our support team immediately.
    </p>
    
    <p style={{
      marginTop: '30px',
    }}>
      Best regards,<br />
      <strong>The RAM Partner Team</strong>
    </p>
  </div>
);
