export const VerificationEmail: React.FC<{ url: string }> = ({ url }) => (
  <div>
    <h1>Verify your email</h1>
    <p>Click the link below to verify your email address:</p>
    <a href={url}>{url}</a>
  </div>
);
