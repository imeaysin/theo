export const ResetPasswordEmail = ({ url }: { url: string }) => {
  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: "560px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>
        Reset your password
      </h1>
      <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
        We received a request to reset your password. Click the button below to
        choose a new one.
      </p>
      <div style={{ margin: "32px 0" }}>
        <a
          href={url}
          style={{
            display: "inline-block",
            padding: "12px 32px",
            backgroundColor: "#111",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Reset Password
        </a>
      </div>
      <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.5" }}>
        If you did not request a password reset, you can safely ignore this
        email. This link will expire in 1 hour.
      </p>
    </div>
  );
};
