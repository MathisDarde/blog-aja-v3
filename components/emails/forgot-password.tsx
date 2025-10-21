import React from "react";

interface ResetPasswordEmailProps {
  user: {
    name?: string;
    email: string;
  };
  resetUrl: string;
}

export default function ResetPasswordEmail({
  user,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f2f4f6",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ padding: "20px 0" }}
        >
          <tr>
            <td align="center">
              <table
                width="600"
                style={{
                  background: "#ffffff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}
              >
                {/* Header */}
                <tr>
                  <td
                    style={{
                      padding: "24px 28px 12px 28px",
                      textAlign: "left",
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        fontSize: "20px",
                        color: "#111827",
                        fontFamily: "Bai Jamjuree, sans-serif",
                      }}
                    >
                      Réinitialisation de votre mot de passe
                    </h1>
                  </td>
                </tr>

                {/* Greeting */}
                <tr>
                  <td style={{ padding: "0 28px 8px 28px" }}>
                    <p
                      style={{ margin: 0, fontSize: "16px", color: "#374151" }}
                    >
                      Bonjour{" "}
                      <strong style={{ color: "#111827" }}>{user.name}</strong>,
                    </p>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: "12px 28px 18px 28px" }}>
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        color: "#4b5563",
                        lineHeight: 1.5,
                        fontSize: "15px",
                      }}
                    >
                      Nous avons reçu une demande pour réinitialiser le mot de
                      passe de votre compte. Cliquez sur le bouton ci-dessous
                      pour définir un nouveau mot de passe :
                    </p>

                    <table style={{ margin: "18px 0" }}>
                      <tr>
                        <td align="left">
                          <a
                            href={resetUrl}
                            target="_blank"
                            style={{
                              display: "inline-block",
                              padding: "12px 20px",
                              borderRadius: "8px",
                              textDecoration: "none",
                              fontWeight: 600,
                              fontSize: "15px",
                              background: "#3c77b4",
                              color: "#ffffff",
                            }}
                          >
                            Réinitialiser mon mot de passe
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p
                      style={{
                        margin: "0 0 12px 0",
                        color: "#6b7280",
                        fontSize: "13px",
                        lineHeight: 1.4,
                      }}
                    >
                      Si le bouton ne fonctionne pas, copiez-collez ce lien dans
                      votre navigateur :
                    </p>
                    <p
                      style={{
                        wordBreak: "break-all",
                        margin: "0 0 18px 0",
                        fontSize: "13px",
                        color: "#1f2937",
                      }}
                    >
                      <a
                        href={resetUrl}
                        target="_blank"
                        style={{
                          color: "#3c77b4",
                          textDecoration: "underline",
                        }}
                      >
                        {resetUrl}
                      </a>
                    </p>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      padding: "18px 28px 24px 28px",
                      borderTop: "1px solid #eef2f7",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "13px",
                        lineHeight: 1.4,
                      }}
                    >
                      Besoin d&apos;aide ? Écrivez-nous :{" "}
                      <a
                        href={`mailto:memoiredauxerrois@gmail.com`}
                        style={{
                          color: "#3c77b4",
                          textDecoration: "underline",
                        }}
                      >
                        memoiredauxerrois@gmail.com
                      </a>
                    </p>

                    <p
                      style={{
                        margin: "12px 0 0 0",
                        color: "#9ca3af",
                        fontSize: "12px",
                      }}
                    >
                      L&apos;équipe Support
                      <br />
                      &copy; {new Date().getFullYear()}
                    </p>
                  </td>
                </tr>
              </table>

              {/* Small note under container */}
              <table width="600" style={{ marginTop: "14px" }}>
                <tr>
                  <td
                    style={{
                      textAlign: "center",
                      color: "#9ca3af",
                      fontSize: "12px",
                    }}
                  >
                    Si vous ne souhaitez plus recevoir d&apos;emails, vérifiez
                    vos préférences dans les paramètres de votre compte.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
