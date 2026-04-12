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

interface AdminNotificationProps {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productType: string;
  engravingText?: string;
  description: string;
  orderId: string;
  referenceItemTitle?: string;
  referenceItemImage?: string;
  referenceItemId?: string;
  referenceImages?: string[];
}

export function AdminNotification({
  customerName,
  customerEmail,
  customerPhone,
  productType,
  engravingText,
  description,
  orderId,
  referenceItemTitle,
  referenceItemImage,
  referenceItemId,
  referenceImages = [],
}: AdminNotificationProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>New Order Request — {productType} from {customerName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>New Order Request</Heading>
            <Text style={tagline}>Barlow Custom Engravings Admin</Text>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              {productType} from {customerName}
            </Heading>

            <Link href={`${siteUrl}/admin/orders/${orderId}`} style={ctaLink}>
              View Order in Admin →
            </Link>

            <Hr style={hr} />

            <Heading as="h3" style={h3}>Customer</Heading>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={tdLabel}>Name</td>
                  <td style={tdValue}>{customerName}</td>
                </tr>
                <tr>
                  <td style={tdLabel}>Email</td>
                  <td style={tdValue}>
                    <Link href={`mailto:${customerEmail}`} style={link}>{customerEmail}</Link>
                  </td>
                </tr>
                {customerPhone && (
                  <tr>
                    <td style={tdLabel}>Phone</td>
                    <td style={tdValue}>
                      <Link href={`tel:${customerPhone}`} style={link}>{customerPhone}</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Hr style={hr} />

            <Heading as="h3" style={h3}>Order Details</Heading>
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
                  <td style={tdLabel}>Order ID</td>
                  <td style={tdValue}><code style={{ fontSize: "12px", color: "#8a7a65" }}>{orderId}</code></td>
                </tr>
              </tbody>
            </table>

            {referenceItemTitle && (
              <>
                <Hr style={hr} />
                <Heading as="h3" style={h3}>Reference Item</Heading>
                <table style={{ borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      {referenceItemImage && (
                        <td style={{ paddingRight: "12px" }}>
                          <Img src={referenceItemImage} alt={referenceItemTitle} width={72} height={72} style={thumbStyle} />
                        </td>
                      )}
                      <td>
                        <Text style={{ ...text, margin: 0 }}>{referenceItemTitle}</Text>
                        {referenceItemId && (
                          <Link href={`${siteUrl}/admin/items/${referenceItemId}/edit`} style={{ ...link, fontSize: "12px" }}>
                            View item →
                          </Link>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {referenceImages.length > 0 && (
              <>
                <Hr style={hr} />
                <Heading as="h3" style={h3}>Customer Inspiration Images</Heading>
                <table style={{ borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      {referenceImages.map((src, i) => (
                        <td key={i} style={{ paddingRight: "8px", paddingBottom: "8px" }}>
                          <Link href={src}>
                            <Img src={src} alt={`Reference ${i + 1}`} width={80} height={80} style={thumbStyle} />
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </>
            )}
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
const h2 = { color: "#f0e8d8", fontSize: "20px", fontWeight: "600", margin: "0 0 16px", fontFamily: "Georgia, serif" };
const h3 = { color: "#e8b87a", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 10px" };
const text = { color: "#f0e8d8", fontSize: "14px", lineHeight: "1.6", margin: "0 0 12px" };
const hr = { borderColor: "rgba(180,140,80,0.15)", margin: "20px 0" };
const table = { borderCollapse: "collapse" as const, width: "100%" };
const tdLabel = { color: "#8a7a65", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" as const, letterSpacing: "0.05em", padding: "5px 16px 5px 0", whiteSpace: "nowrap" as const, verticalAlign: "top" as const };
const tdValue = { color: "#f0e8d8", fontSize: "14px", padding: "5px 0", verticalAlign: "top" as const };
const link = { color: "#c8933a" };
const ctaLink = { display: "inline-block", backgroundColor: "#c8933a", color: "#0f0d0b", padding: "10px 20px", borderRadius: "6px", fontWeight: "600", fontSize: "14px", textDecoration: "none", marginBottom: "4px" };
const thumbStyle = { borderRadius: "6px", objectFit: "cover" as const, border: "1px solid rgba(180,140,80,0.2)" };
