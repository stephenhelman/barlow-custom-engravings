import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";

interface OrderConfirmationProps {
  customerName: string;
  firstName: string;
  productType: string;
  engravingText?: string;
  description: string;
  referenceItemTitle?: string;
  referenceItemImage?: string;
  referenceImages?: string[];
}

export function OrderConfirmation({
  customerName,
  firstName,
  productType,
  engravingText,
  description,
  referenceItemTitle,
  referenceItemImage,
  referenceImages = [],
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>We got your order request, {firstName}!</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>Barlow Custom Engravings</Heading>
            <Text style={tagline}>Handcrafted in El Paso, TX</Text>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              We got your request, {firstName}!
            </Heading>
            <Text style={text}>
              Thanks for reaching out. Michelle will review your order and get
              back to you within 24 hours to confirm details and pricing.
            </Text>

            <Hr style={hr} />

            <Heading as="h3" style={h3}>
              Order Summary
            </Heading>

            <table style={table}>
              <tbody>
                <tr>
                  <td style={tdLabel}>Product</td>
                  <td style={tdValue}>{productType}</td>
                </tr>
                {engravingText && (
                  <tr>
                    <td style={tdLabel}>Engraving Text</td>
                    <td style={tdValue}>{engravingText}</td>
                  </tr>
                )}
                <tr>
                  <td style={tdLabel}>Description</td>
                  <td style={tdValue}>{description}</td>
                </tr>
                <tr>
                  <td style={tdLabel}>Name on Order</td>
                  <td style={tdValue}>{customerName}</td>
                </tr>
              </tbody>
            </table>

            {/* Reference item */}
            {referenceItemTitle && (
              <>
                <Hr style={hr} />
                <Heading as="h3" style={h3}>
                  Reference Item
                </Heading>
                <table style={{ borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      {referenceItemImage && (
                        <td style={{ paddingRight: "12px" }}>
                          <Img
                            src={referenceItemImage}
                            alt={referenceItemTitle}
                            width={64}
                            height={64}
                            style={thumbStyle}
                          />
                        </td>
                      )}
                      <td>
                        <Text style={{ ...text, margin: 0 }}>{referenceItemTitle}</Text>
                        <Text style={mutedText}>Gallery reference</Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {/* Reference images */}
            {referenceImages.length > 0 && (
              <>
                <Hr style={hr} />
                <Heading as="h3" style={h3}>
                  Your Inspiration Images
                </Heading>
                <table style={{ borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      {referenceImages.slice(0, 4).map((src, i) => (
                        <td key={i} style={{ paddingRight: "8px" }}>
                          <Img src={src} alt={`Reference ${i + 1}`} width={72} height={72} style={thumbStyle} />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            <Hr style={hr} />

            <Text style={text}>
              Have questions? Reply to this email or reach us at{" "}
              <Link href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`} style={link}>
                {process.env.NEXT_PUBLIC_EMAIL}
              </Link>{" "}
              or call{" "}
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
const mutedText = { color: "#8a7a65", fontSize: "12px", margin: "2px 0 0" };
const hr = { borderColor: "rgba(180,140,80,0.15)", margin: "20px 0" };
const table = { borderCollapse: "collapse" as const, width: "100%" };
const tdLabel = { color: "#8a7a65", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" as const, letterSpacing: "0.05em", padding: "6px 16px 6px 0", whiteSpace: "nowrap" as const, verticalAlign: "top" as const };
const tdValue = { color: "#f0e8d8", fontSize: "14px", padding: "6px 0", verticalAlign: "top" as const };
const link = { color: "#c8933a" };
const thumbStyle = { borderRadius: "6px", objectFit: "cover" as const, border: "1px solid rgba(180,140,80,0.2)" };
const footer = { backgroundColor: "#0f0d0b", padding: "16px 32px", borderTop: "1px solid rgba(180,140,80,0.1)" };
const footerText = { color: "#4a3f32", fontSize: "11px", margin: 0, textAlign: "center" as const };
