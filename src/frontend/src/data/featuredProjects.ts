import type { Project } from "../backend";
import { ProjectStatus } from "../backend";

export interface FeaturedProject extends Project {
  description: string;
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  // Stage 1: inProgress — Credits Purchased, Extraction Active
  {
    id: BigInt(1),
    ownerName: "Rajasthan Minerals Ltd.",
    country: "India",
    projectType: "Granite Extraction",
    landAreaHectares: 87.4,
    gpsCoordinates: "25.2138° N, 75.8648° E",
    startDate: "2024-03-01",
    endDate: "2025-12-31",
    creditsRequired: BigInt(8740),
    creditsPurchased: BigInt(8740),
    status: ProjectStatus.inProgress,
    createdAt: BigInt(1709251200000),
    description:
      "Rajasthan Minerals Ltd. operates one of the largest granite quarries in Rajasthan's Kota district, supplying stone to construction projects across South Asia. Before commencing operations, the company purchased 8,740 green credits — locked on-chain — covering the full 87.4-hectare extraction zone. Extraction is currently active; credits remain locked until verified land restoration is complete.",
  },
  {
    id: BigInt(2),
    ownerName: "Kinross Gold Corporation",
    country: "Brazil",
    projectType: "Gold Mining",
    landAreaHectares: 214.0,
    gpsCoordinates: "15.7801° S, 47.9292° W",
    startDate: "2024-01-15",
    endDate: "2026-01-14",
    creditsRequired: BigInt(21400),
    creditsPurchased: BigInt(21400),
    status: ProjectStatus.inProgress,
    createdAt: BigInt(1705276800000),
    description:
      "Kinross Gold's Brasília-region operations extract high-grade gold ore across 214 hectares of the Brazilian cerrado. The company pre-purchased 21,400 green credits before breaking ground — the largest single credit purchase recorded on the GCS blockchain to date. Active extraction continues under strict environmental monitoring, with restoration planning already underway for post-extraction phases.",
  },
  // Stage 2: pending — Restoration Submitted, Awaiting Verification
  {
    id: BigInt(3),
    ownerName: "Hancock Prospecting Pty Ltd",
    country: "Australia",
    projectType: "Iron Ore Mining",
    landAreaHectares: 156.8,
    gpsCoordinates: "22.9576° S, 118.4253° E",
    startDate: "2022-07-01",
    endDate: "2024-06-30",
    creditsRequired: BigInt(15680),
    creditsPurchased: BigInt(15680),
    status: ProjectStatus.pending,
    createdAt: BigInt(1656633600000),
    description:
      "Hancock Prospecting completed iron ore extraction across 156.8 hectares in the Pilbara region of Western Australia in June 2024. The company has since replanted over 94,000 native Acacia and spinifex specimens and submitted full restoration documentation — drone surveys, soil analysis, and vegetation coverage reports — to the GCS verification panel. Awaiting final government-authorized verification before 15,680 credits are released.",
  },
  {
    id: BigInt(4),
    ownerName: "Sibanye-Stillwater Ltd.",
    country: "South Africa",
    projectType: "Platinum Mining",
    landAreaHectares: 103.5,
    gpsCoordinates: "26.4678° S, 27.8311° E",
    startDate: "2022-04-01",
    endDate: "2024-03-31",
    creditsRequired: BigInt(10350),
    creditsPurchased: BigInt(10350),
    status: ProjectStatus.pending,
    createdAt: BigInt(1648771200000),
    description:
      "Sibanye-Stillwater concluded platinum extraction at its North West Province site in March 2024 and submitted a comprehensive restoration proof package in April. The restoration plan includes converting the 103.5-hectare site into a community nature reserve with indigenous Highveld grassland replanting — a first-of-its-kind project in the region. Verification is pending review by South Africa's Department of Forestry, Fisheries and the Environment.",
  },
  // Stage 3: verified — Restoration Verified, Credits Released
  {
    id: BigInt(5),
    ownerName: "Suncor Energy Inc.",
    country: "Canada",
    projectType: "Oil Sands Reclamation",
    landAreaHectares: 245.0,
    gpsCoordinates: "56.7167° N, 111.3833° W",
    startDate: "2021-03-01",
    endDate: "2023-02-28",
    creditsRequired: BigInt(24500),
    creditsPurchased: BigInt(24500),
    status: ProjectStatus.verified,
    createdAt: BigInt(1614556800000),
    description:
      "Suncor Energy's Fort McMurray reclamation project — the first oil sands site to achieve full GCS verification — restored 245 hectares of boreal forest in northern Alberta. Over 180,000 native trees were planted, wetland hydrology was re-established, and independent ecological surveys confirmed the land supports native wildlife populations. All 24,500 green credits were released in March 2024. The site is now designated a public conservation area.",
  },
  {
    id: BigInt(6),
    ownerName: "Norsk Hydro ASA",
    country: "Norway",
    projectType: "Bauxite Mining",
    landAreaHectares: 72.3,
    gpsCoordinates: "58.9700° N, 5.7331° E",
    startDate: "2021-09-01",
    endDate: "2023-08-31",
    creditsRequired: BigInt(7230),
    creditsPurchased: BigInt(7230),
    status: ProjectStatus.verified,
    createdAt: BigInt(1630454400000),
    description:
      "Norsk Hydro's Rogaland bauxite project set the European benchmark for extraction-to-restoration accountability. Following two years of extraction across 72.3 hectares, the site was fully restored to Norwegian coastal heathland — a protected habitat type — including reintroduction of calluna heather, cross-leaved heath, and bog myrtle. Verification was completed by the Norwegian Environment Agency in September 2023. Credits released. Site open to public.",
  },
];
