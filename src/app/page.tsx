import HomeClient from "@/components/HomeClient";
import { getProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";
const heroImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop";

export default async function HomePage() {
  const projects = await getProjects();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "LocalBusiness", "name": "Jauhar Decor", "alternateName": "JGA - Jauhar Glass & Aluminum Center", "description": "Premium architectural glass, aluminum fabrication, interiors and home furnishing.", "image": heroImage, "url": process.env.NEXT_PUBLIC_SITE_URL || "https://jauhardecor.com", "sameAs": ["https://www.instagram.com/jauhar_decor/", "https://www.facebook.com/profile.php?id=100091790475234"], "hasOfferCatalog": { "@type": "OfferCatalog", "name": "Architectural glass and aluminum services", "itemListElement": ["Glass Partitions", "Aluminum Windows and Doors", "Curtain Walls", "Shower Cubicles", "Home Furnishing"].map(name => ({ "@type": "OfferCatalog", name })) } },
      { "@type": "Organization", "name": "Jauhar Decor", "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://jauhardecor.com"}/logo-jauhar.svg` },
      { "@type": "CollectionPage", "name": "Jauhar Decor Portfolio", "hasPart": projects.map(project => ({ "@type": "CreativeWork", "name": project.title, "description": project.description, "image": project.coverImage })) }
    ]
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/><HomeClient projects={projects}/></>;
}
