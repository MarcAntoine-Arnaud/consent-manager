import { IPrivacyNotice } from "../types/models";
import {
  BilateralContract,
  EcosystemContract,
  getDataFromPliciesInBilateralContract,
  getDataFromPoliciesInEcosystemContract,
} from "./contracts";

export const bilateralContractToPrivacyNotice = (
  contract: BilateralContract
): IPrivacyNotice => {
  const privacyNotice: IPrivacyNotice = {
    title: contract.profile,
    lastUpdated: Date.now().toString(),
    dataProvider: contract.dataProvider,
    controllerDetails: {
      name: contract.dataProvider,
      contact: "",
      representative: "",
      dpo: {
        name: "",
        contact: "",
      },
    },
    purposes: contract.purpose.map((p) => ({
      purpose: p?.purpose,
      legalBasis: p?.legalBasis || "",
    })),
    data: getDataFromPliciesInBilateralContract(contract),
    categoriesOfData: [],
    recipients: [contract.dataConsumer],
    internationalTransfers: {
      countries: [],
      safeguards: "",
    },
    retentionPeriod: "",
    piiPrincipalRights: [],
    withdrawalOfConsent: "",
    complaintRights: "",
    provisionRequirements: "",
    automatedDecisionMaking: {
      details: "",
    },
  };

  return privacyNotice;
};

/**
 * Builds a very generic and pretty empty privacy notice from a ecosystem
 * contract, that needs to be filled in with info after reception as the data
 * and purpose can only be decided when the service offerings of the provider
 * and consumer are known
 */
export const ecosystemContractToPrivacyNotice = (
  contract: EcosystemContract
) => {
  const privacyNotice: IPrivacyNotice = {
    title: contract.profile,
    lastUpdated: Date.now().toString(),
    dataProvider: "",
    controllerDetails: {
      name: "",
      contact: "",
      representative: "",
      dpo: {
        name: "",
        contact: "",
      },
    },
    purposes: contract.purpose.map((p) => ({
      purpose: p?.purpose,
      legalBasis: "",
    })),
    data: getDataFromPoliciesInEcosystemContract(contract),
    categoriesOfData: [],
    recipients: [],
    internationalTransfers: {
      countries: [],
      safeguards: "",
    },
    retentionPeriod: "",
    piiPrincipalRights: [],
    withdrawalOfConsent: "",
    complaintRights: "",
    provisionRequirements: "",
    automatedDecisionMaking: {
      details: "",
    },
  };

  return privacyNotice;
};
