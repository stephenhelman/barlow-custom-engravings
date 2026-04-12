import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface TwoFactorCodeProps {
  code: string;
  expiresInMinutes?: number;
}

export function TwoFactorCode({ code, expiresInMinutes = 10 }: TwoFactorCodeProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Barlow Custom Engravings verification code: {code}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Barlow Custom Engravings</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Your sign-in code
            </Heading>
            <Text style={text}>
              Use the code below to complete your sign-in. It expires in{" "}
              {expiresInMinutes} minutes.
            </Text>

            <div style={codeWrapper}>
              <span style={codeStyle}>{code}</span>
            </div>

            <Hr style={hr} />

            <Text style={mutedText}>
              If you didn&apos;t request this code, you can safely ignore this email.
              Someone may have entered your email address by mistake.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Barlow Custom Engravings · This is an automated security message
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#0f0d0b", fontFamily: "'Barlow', Arial, sans-serif" };
const container = { maxWidth: "480px", margin: "0 auto", backgroundColor: "#1c1814", borderRadius: "8px", overflow: "hidden" };
const header = { backgroundColor: "#252019", padding: "24px 32px", borderBottom: "1px solid rgba(180,140,80,0.2)" };
const logo = { color: "#f0e8d8", fontSize: "18px", fontWeight: "600", margin: 0, fontFamily: "Georgia, serif" };
const content = { padding: "36px 32px" };
const h2 = { color: "#f0e8d8", fontSize: "22px", fontWeight: "600", margin: "0 0 12px", fontFamily: "Georgia, serif" };
const text = { color: "#f0e8d8", fontSize: "14px", lineHeight: "1.6", margin: "0 0 28px" };
const codeWrapper = { textAlign: "center" as const, margin: "0 0 28px" };
const codeStyle = { display: "inline-block", backgroundColor: "#252019", border: "1px solid rgba(200,147,58,0.4)", borderRadius: "10px", padding: "20px 36px", fontSize: "36px", fontWeight: "700", letterSpacing: "0.25em", color: "#e8b87a", fontFamily: "monospace" };
const hr = { borderColor: "rgba(180,140,80,0.15)", margin: "0 0 20px" };
const mutedText = { color: "#8a7a65", fontSize: "12px", lineHeight: "1.6", margin: 0 };
const footer = { backgroundColor: "#0f0d0b", padding: "16px 32px", borderTop: "1px solid rgba(180,140,80,0.1)" };
const footerText = { color: "#4a3f32", fontSize: "11px", margin: 0, textAlign: "center" as const };
