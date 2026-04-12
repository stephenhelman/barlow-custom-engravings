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
  Link,
} from "@react-email/components";

interface ContactConfirmationProps {
  firstName: string;
  name: string;
  subject: string;
  message: string;
}

export function ContactConfirmation({
  firstName,
  name,
  subject,
  message,
}: ContactConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for reaching out, {firstName}!</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Barlow Custom Engravings</Heading>
            <Text style={tagline}>Handcrafted in El Paso, TX</Text>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Thanks for reaching out, {firstName}!
            </Heading>
            <Text style={text}>
              We received your message and will get back to you as soon as possible —
              typically within 24 hours.
            </Text>

            <Hr style={hr} />

            <Heading as="h3" style={h3}>Your Message</Heading>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={tdLabel}>From</td>
                  <td style={tdValue}>{name}</td>
                </tr>
                <tr>
                  <td style={tdLabel}>Subject</td>
                  <td style={tdValue}>{subject}</td>
                </tr>
                <tr>
                  <td style={tdLabel}>Message</td>
                  <td style={tdValue}>{message}</td>
                </tr>
              </tbody>
            </table>

            <Hr style={hr} />

            <Text style={text}>
              In the meantime, feel free to browse our{" "}
              <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/gallery`} style={link}>
                gallery
              </Link>{" "}
              or{" "}
              <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/shop`} style={link}>
                shop
              </Link>
              . You can also reach us directly at{" "}
              <Link href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`} style={link}>
                {process.env.NEXT_PUBLIC_EMAIL}
              </Link>{" "}
              or{" "}
              <Link href={`tel:${process.env.NEXT_PUBLIC_PHONE}`} style={link}>
                {process.env.NEXT_PUBLIC_PHONE}
              </Link>
              .
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Barlow Custom Engravings · El Paso, TX · Found at the Swap Meet
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#0f0d0b", fontFamily: "'Barlow', Arial, sans-serif" };
const container = { maxWidth: "600px", margin: "0 auto", backgroundColor: "#1c1814", borderRadius: "8px", overflow: "hidden" };
const header = { backgroundColor: "#252019", padding: "28px 32px", borderBottom: "1px solid rgba(180,140,80,0.2)" };
const logo = { color: "#f0e8d8", fontSize: "20px", fontWeight: "600", margin: 0, fontFamily: "Georgia, serif" };
const tagline = { color: "#8a7a65", fontSize: "12px", margin: "4px 0 0" };
const content = { padding: "28px 32px" };
const h2 = { color: "#f0e8d8", fontSize: "22px", fontWeight: "600", margin: "0 0 12px", fontFamily: "Georgia, serif" };
const h3 = { color: "#e8b87a", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 12px" };
const text = { color: "#f0e8d8", fontSize: "14px", lineHeight: "1.6", margin: "0 0 12px" };
const hr = { borderColor: "rgba(180,140,80,0.15)", margin: "20px 0" };
const table = { borderCollapse: "collapse" as const, width: "100%" };
const tdLabel = { color: "#8a7a65", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" as const, letterSpacing: "0.05em", padding: "6px 16px 6px 0", whiteSpace: "nowrap" as const, verticalAlign: "top" as const };
const tdValue = { color: "#f0e8d8", fontSize: "14px", padding: "6px 0", verticalAlign: "top" as const, whiteSpace: "pre-wrap" as const };
const link = { color: "#c8933a" };
const footer = { backgroundColor: "#0f0d0b", padding: "16px 32px", borderTop: "1px solid rgba(180,140,80,0.1)" };
const footerText = { color: "#4a3f32", fontSize: "11px", margin: 0, textAlign: "center" as const };
