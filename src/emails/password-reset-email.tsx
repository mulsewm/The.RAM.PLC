import * as React from 'react';

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
  expiresInHours: number;
}

export const PasswordResetEmail: React.FC<Readonly<PasswordResetEmailProps>> = ({
  name,
  resetUrl,
  expiresInHours,
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
      Password Reset Request
    </h1>
    
    <p>Hello {name},</p>
    
    <p>We received a request to reset the password for your RAM Partner Portal account.</p>
    
    <p>To reset your password, please click the button below:</p>
    
    <div style={{
      margin: '30px 0',
      textAlign: 'center',
    }}>
      <a
        href={resetUrl}
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
        Reset Password
      </a>
    </div>
    
    <p style={{
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '1px solid #e5e7eb',
    }}>
      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
      <br /><br />
      <strong>This link will expire in {expiresInHours} hours.</strong>
    </p>
    
    <p style={{
      marginTop: '30px',
      fontSize: '14px',
      color: '#9ca3af',
    }}>
      If you're having trouble with the button above, copy and paste the URL below into your web browser:
      <br />
      <a 
        href={resetUrl}
        style={{
          color: '#3b82f6',
          wordBreak: 'break-all',
          fontSize: '12px',
        }}
      >
        {resetUrl}
      </a>
    </p>
    
    <p style={{
      marginTop: '30px',
      fontSize: '14px',
      color: '#9ca3af',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '20px',
    }}>
      Best regards,<br />
      <strong>The RAM Partner Team</strong>
    </p>
  </div>
);
