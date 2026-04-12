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

interface ContactNotificationProps {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export function ContactNotification({
  name,
  email,
  phone,
  subject,
  message,
}: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact message from {name}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>New Contact Message</Heading>
            <Text style={tagline}>Barlow Custom Engravings Admin</Text>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              {subject}
            </Heading>
            <Text style={mutedText}>from {name}</Text>

            <Hr style={hr} />

            <Heading as="h3" style={h3}>Contact Info</Heading>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={tdLabel}>Name</td>
                  <td style={tdValue}>{name}</td>
                </tr>
                <tr>
                  <td style={tdLabel}>Email</td>
                  <td style={tdValue}>
                    <Link href={`mailto:${email}`} style={link}>{email}</Link>
                  </td>
                </tr>
                {phone && (
                  <tr>
                    <td style={tdLabel}>Phone</td>
                    <td style={tdValue}>
                      <Link href={`tel:${phone}`} style={link}>{phone}</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Hr style={hr} />

            <Heading as="h3" style={h3}>Message</Heading>
            <Text style={messageStyle}>{message}</Text>

            <Hr style={hr} />

            <Link href={`mailto:${email}`} style={ctaLink}>
              Reply to {name} →
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#0f0d0b", fontFamily: "'Barlow', Arial, sans-serif" };
const container = { maxWidth: "600px", margin: "0 auto", backgroundColor: "#1c1814", borderRadius: "8px", overflow: "hidden" };
const header = { backgroundColor: "#252019", padding: "24px 32px", borderBottom: "1px solid rgba(180,140,80,0.2)" };
const logo = { color: "#c8933a", fontSize: "18px", fontWeight: "600", margin: 0 };
const tagline = { color: "#8a7a65", fontSize: "12px", margin: "4px 0 0" };
const content = { padding: "28px 32px" };
const h2 = { color: "#f0e8d8", fontSize: "20px", fontWeight: "600", margin: "0 0 4px", fontFamily: "Georgia, serif" };
const h3 = { color: "#e8b87a", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 10px" };
const mutedText = { color: "#8a7a65", fontSize: "13px", margin: "0 0 0" };
const hr = { borderColor: "rgba(180,140,80,0.15)", margin: "20px 0" };
const table = { borderCollapse: "collapse" as const, width: "100%" };
const tdLabel = { color: "#8a7a65", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" as const, letterSpacing: "0.05em", padding: "5px 16px 5px 0", whiteSpace: "nowrap" as const, verticalAlign: "top" as const };
const tdValue = { color: "#f0e8d8", fontSize: "14px", padding: "5px 0", verticalAlign: "top" as const };
const messageStyle = { color: "#f0e8d8", fontSize: "14px", lineHeight: "1.7", margin: 0, whiteSpace: "pre-wrap" as const, backgroundColor: "#252019", padding: "12px 16px", borderRadius: "6px", borderLeft: "3px solid rgba(200,147,58,0.4)" };
const link = { color: "#c8933a" };
const ctaLink = { display: "inline-block", backgroundColor: "#c8933a", color: "#0f0d0b", padding: "10px 20px", borderRadius: "6px", fontWeight: "600", fontSize: "14px", textDecoration: "none" };
