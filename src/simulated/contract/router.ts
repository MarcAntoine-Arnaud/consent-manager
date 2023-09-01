/// THIS ROUTER IS SIMULATING SOME OF THE INTERACTIONS BETWEEN
/// THE CONSENT MANAGER AND THE CONTRACT IMPLEMENTATION THAT IS
/// YET TBD

import { Router } from "express";
const r: Router = Router();

const Contracts = [
  {
    "@context": "http://www.w3.org/ns/odrl.jsonld",
    "@type": "Policy",
    "@id": "DID:123",
    uri: "http://example.com/contract/666",
    uid: "policy-12345",
    profile: "http://example.com/profiles/data-exchange",
    policyUrl: "http://example.com/policies/policy-abc",
    permission: [
      {
        "@type": "Offer",
        target: "http://example.com/data/resource-1",
        assigner:
          process.env.FEDERATED_APPLICATION_IDENTIFIER +
          "64f1df5db2face281e55d8fa",
        assignee:
          process.env.FEDERATED_APPLICATION_IDENTIFIER +
          "64f1df7452a3febe2b054b38",
        action: "read",
        data: "http://example.com/data/personal-info",
        constraint: [
          {
            "@type": "spatial",
            scope: "http://example.com/geolocation/eu",
            relation: "within",
          },
          {
            "@type": "dateTime",
            leftOperand: "currentDateTime",
            operator: "lt",
            rightOperand: "2023-12-31T23:59:59Z",
          },
        ],
      },
    ],
    data: [
      {
        uid: "data-1",
        type: "http://example.com/datatypes/personal-info",
        purpose: "http://example.com/purposes/user-authentication",
      },
    ],
    purpose: [
      {
        uid: "purpose-1",
        purpose: "Demo purpose",
        action: "http://example.com/actions/authenticate",
        assigner:
          process.env.FEDERATED_APPLICATION_IDENTIFIER +
          "64ef1907b8dfb749e4565640",
        assignee:
          process.env.FEDERATED_APPLICATION_IDENTIFIER +
          "64ef190bb8dfb749e4565644",

        // Added to fit --
        // TODO Must check coherence
        purposeCategory: ["2 - Contracted Service"],
        consentType: "EXPLICIT",
        piiCategory: [
          "1 - Biographical",
          "2 - Contact",
          "4 - Communications/Social",
        ],
        primaryPurpose: true,
        termination: "Subscription end date + 1 year",
        thirdPartyDisclosure: true,
        thirdPartyName: "The Ankh-morpork Deadbeat Debt Collectors Society",
      },
    ],
    // Added to fit KCR for demo implementation
    // TODO Check if it should be there
    spiCat: ["1 - Biographical", "7 - Financial"],
  },
  {
    "@context": "http://www.w3.org/ns/odrl.jsonld",
    "@type": "Policy",
    uri: "http://example.com/contract/666",
    uid: "policy-67890",
    profile: "http://example.com/profiles/data-exchange",
    policyUrl: "http://example.com/policies/policy-123",
    permission: [
      {
        "@type": "Offer",
        target: "http://example.com/data/resource-2",
        assigner: "http://example.com/parties/data-provider",
        assignee: "http://example.com/parties/data-consumer",
        action: "write",
        data: "http://example.com/data/sensitive-info",
        constraint: [
          {
            "@type": "spatial",
            scope: "http://example.com/geolocation/us",
            relation: "within",
          },
          {
            "@type": "dateTime",
            leftOperand: "currentDateTime",
            operator: "lt",
            rightOperand: "2024-06-30T23:59:59Z",
          },
        ],
      },
    ],
    data: [
      {
        uid: "data-2",
        type: "http://example.com/datatypes/sensitive-info",
        purpose: "http://example.com/purposes/research",
      },
    ],
    purpose: [
      {
        uid: "purpose-2",
        purpose: "Demo purpose",
        action: "http://example.com/actions/research-analysis",
        assigner: "http://example.com/parties/data-provider",
        assignee: "http://example.com/parties/data-consumer",
      },
    ],
  },
];

r.get("/", async (req, res) => {
  return res.json(Contracts);
});

r.get("/contracts/:providerID/:consumerID", async (req, res) => {
  const { providerID, consumerID } = req.params;
  const { decodedPID, decodedCID } = {
    decodedPID: decodeURIComponent(providerID),
    decodedCID: decodeURIComponent(consumerID),
  };
  const contracts = Contracts.filter(
    (c) =>
      c.permission.find((p) => p.assignee === decodedPID) ||
      c.permission.find((p) => p.assignee === decodedCID)
  );
  return res.json(contracts);
});

r.get("/validate/:providerID/:consumerID", async (req, res) => {
  return res.json({ success: true });
});

export default r;
