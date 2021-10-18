export enum DocumentType {
  STANDALONE_LLC = "STANDALONE_LLC",
  SERIES_LLC = "SERIES_LLC",
  OPERATING_AGREEMENT = "OPERATING_AGREEMENT",
  SUBCRIPTION_AGREEMENT = "SUBCRIPTION_AGREEMENT",
  MEMBER_SUBCRIPTION_AGREEMENT = "MEMBER_SUBCRIPTION_AGREEMENT",
  FORM_ID = "FORM_ID",
  FORM_D = "FORM_D",
}

export enum DocumentStatus {
  PENDING = "PENDING",
  COMPLETE = "COMPLETE",
}

export enum SignatureStatus {
  AWAITING_SIGNATURE = "AWAITING_SIGNATURE",
  SIGNED = "SIGNED",
}
export interface IOperatingAgreement {
  protectedSeriesLLC: string;
  masterSeriesLLC: string;
  carryPercentage: string;
  managementFee: string;
  managerName: string;
  managerState: string;
  managerEntityType: string;
  managerEmail: string;
  advisorName: string;
  advisorState: string;
  advisorEntityType: string;
  advisorEmail: string;
}

export interface IManagerFields {
  managerName: string;
  managerEmail: string;
}

export interface ISeriesLLC extends IManagerFields {
  protectedSeriesLLC: string;
  masterSeriesLLC: string;
}

export interface IStandaloneLLC extends IManagerFields {
  llcName: string;
}

export interface IAddress {
  address: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface IFormId {
  applicantType: string;
  applicantName: string;
  applicantMailingStreet: string;
  applicantMailingCity: string;
  applicantMailingStateCountry: string;
  applicantMailingZip: string;
  applicantPhone: string;
  taxIdentificationNumber: string;
  businessName: string;
  foreignName: string;
  businessStreet: string;
  businessCity: string;
  businessStateCountry: string;
  businessZip: string;
  stateIncorporation: string;
  contactNameEDGAR: string;
  contactStreetEDGAR: string;
  contactCityEDGAR: string;
  contactStateCountryEDGAR: string;
  contactZipEDGAR: string;
  contactPhoneEDGAR: string;
  contactEmail: string;
  contactNameSEC: string;
  contactStreetSEC: string;
  contactCitySEC: string;
  contactStateCountrySEC: string;
  contactZipSEC: string;
  contactPhoneSEC: string;
  managerTitle: string;
}

export interface IFormD {
  syndicateName: string;
  yearIncorporation: string;
  streetIssuer: string;
  cityIssuer: string;
  stateIssuer: string;
  zipIssuer: string;
  phoneIssuer: string;
  lastRelated1: string;
  firstRelated1: string;
  streetRelated1: string;
  cityRelated1: string;
  stateRelated1: string;
  zipRelated1: string;
  promoterRelated1: string;
  dateFirstSale: string;
  minimumInvestment: string;
  totalAmountSold: string;
  investorCount: string;
  managerTitle: string;
  managerName: string;
  managerEmail: string;
}

export interface LegalTask {
  type: TaskType;
  progress: Progress;
  title: string;
  subtitle: string;
  time: string;
  fees: string;
  icon: string;
  actionState: ActionState;
  hellosignID?: string;
}

export enum MilestoneType {
  FORMATION = "FORMATION",
  SECURITIES = "SECURITIES",
  TAX = "TAX",
}

export interface ILegalTabMilestone {
  title: string;
  blockingMessage: string;
  type: MilestoneType;
  progress: Progress;
  progressPercentage: number;
  tasks: LegalTask[];
  blockingTask?: TaskType;
}

export interface ISignature {
  id: string;
  hellosignId: string;
  signerAddress: string;
  status: SignatureStatus;
  signURL: string;
  expiresAt: string;
  signedAt: string;
}
export interface ILegalDocument {
  id: string;
  hellosignId: string;
  syndicateAddress: string;
  type: DocumentType;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  viewURL: string;
  name: string;
  member: string;
  signatures: ISignature[];
}
interface ILegalTab {
  fetchError: boolean;
  entityName: string;
  entityType: EntityType;
  milestones: ILegalTabMilestone[];
  documents: ILegalDocument[];
}

export interface SyndicateLegal {
  fetchError: boolean;
  entityName: string;
  entityType: EntityType;
  milestones: ILegalTabMilestone[];
  documents: ILegalDocument[];
}

interface IExistingEntity {
  entityName: string;
  entityState: string;
  entityType: EntityType;
  taskCompletion: {
    [TaskType.ENTITY_FORMATION]: boolean;
    [TaskType.OPERATING_SUBSCRIPTION]: boolean;
    [TaskType.FORM_ID]: boolean;
    [TaskType.FORM_D]: boolean;
  }
}

export interface InitialStateSPV {
  documentType: DocumentType;
  seriesLLC: ISeriesLLC;
  standaloneLLC: IStandaloneLLC;
  operatingAgreement: IOperatingAgreement;
  formId: IFormId;
  formD: IFormD;
  legalTab: ILegalTab;
  syndicateLegal: SyndicateLegal;
  existingEntity: IExistingEntity;
}

export interface IActionPayload {
  field: string | TaskType;
  payload: string | number | boolean;
}

export enum FIELDS {
  syndicateName = "syndicateName",
  managerName = "managerName",
  managerEmail = "managerEmail",
  agentName = "agentName",
  agentAddress = "agentAddress",
  agentApartment = "agentApartment",
  agentCity = "agentCity",
  agentState = "agentState",
  agentZipCode = "agentZipCode",
  managerEntityType = "managerEntityType",
  protectedSeriesLLC = "protectedSeriesLLC",
  masterSeriesLLC = "masterSeriesLLC",
  llcName = "llcName",
  managementFee = "managementFee",
  carryPercentage = "carryPercentage",
  managerState = "managerState",
  advisorName = "advisorName",
  advisorState = "advisorState",
  advisorEntityType = "advisorEntityType",
  advisorEmail = "advisorEmail",
  entityName = "entityName",
  entityState = "entityState",
  entityType = "entityType",
}

export enum Progress {
  LOCKED = "LOCKED",
  READY = "READY",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum ActionState {
  PENDING_FORMATION = "Pending entity formation",
  PENDING_APPROVAL = "Pending approval",
  START = "Start",
  COMPLETE_PREVIOUS_STEP = "Complete previous step",
  TRACK_STATUS = "Track status",
  COMING_SOON = "Coming soon",
  COMPLETE = "Complete",
}

export enum EntityType {
  SERIES_LLC = "Series LLC",
  PROTECTED_SERIES_LLC = "Protected Series LLC",
  REGISTERED_SERIES_LLC = "Registered Series LLC",
}

export enum TaskType {
  ENTITY_FORMATION = "ENTITY_FORMATION",
  OPERATING_SUBSCRIPTION = "OPERATING_SUBSCRIPTION",
  COUNTERSIGN_SUBSCRIPTION = "COUNTERSIGN_SUBSCRIPTION",
  FORM_ID = "FORM_ID",
  POWER_OF_ATTORNEY = "POWER_OF_ATTORNEY",
  FORM_D = "FORM_D",
  EIN = "EIN",
  DELAWARE_TAX = "DELAWARE_TAX",
  IRS_TAX = "IRS_TAX",
}

// To delete: mock testing data @justin.n
const legalDocs = new Array(9).fill({
  id: "0x23y33e3e09d",
  hellosignId: "2w211wss",
  syndicateAddress: "0x602Caa568b5b35D1b8c7D71417514C5F21479245",
  type: DocumentType.SUBCRIPTION_AGREEMENT,
  status: DocumentStatus.COMPLETE,
  createdAt: "Oct 07, 2021",
  updatedAt: "",
  viewURL: "http://www.africau.edu/images/default/sample.pdf",
  name: "Subscription Agreement",
  member: "Mr Miyagi",
});
const sampleFormD = {
  id: "0x0000000",
  hellosignId: "0y999999999",
  syndicateAddress: "0xE85E56E8d3BA8c531F0c2F85F33d3169467F86Cb",
  type: DocumentType.FORM_D,
  status: DocumentStatus.COMPLETE,
  createdAt: "Sept 30, 2021",
  updatedAt: "",
  viewURL: "http://www.africau.edu/images/default/sample.pdf",
  name: "Form D",
  member: "",
};
legalDocs.unshift({
  id: "0x23y33e3e09d",
  hellosignId: "2w211wss",
  syndicateAddress: "0x602Caa568b5b35D1b8c7D71417514C5F21479245",
  type: DocumentType.SUBCRIPTION_AGREEMENT,
  status: DocumentStatus.COMPLETE,
  createdAt: "Oct 07, 2021",
  updatedAt: "",
  viewURL: "http://www.africau.edu/images/default/sample.pdf",
  name: "Subscription Agreement",
  member: "Dollar Bill Stern",
});
legalDocs.unshift(sampleFormD);
legalDocs.push({
  id: "0x23y33e3e09d",
  hellosignId: "2w211wss",
  syndicateAddress: "0x602Caa568b5b35D1b8c7D71417514C5F21479245",
  type: DocumentType.SUBCRIPTION_AGREEMENT,
  status: DocumentStatus.COMPLETE,
  createdAt: "Oct 07, 2021",
  updatedAt: "",
  viewURL: "http://www.africau.edu/images/default/sample.pdf",
  name: "Operating Agreement",
  member: "Fabio Quataralo",
});
export const legalTaskIcon = {
  [TaskType.ENTITY_FORMATION]: "WandAndStarsIcon",
  [TaskType.OPERATING_SUBSCRIPTION]: "PersonIcon",
  [TaskType.COUNTERSIGN_SUBSCRIPTION]: "PencilAndOutlineIcon",
  [TaskType.FORM_ID]: "RectangleIcon",
  [TaskType.POWER_OF_ATTORNEY]: "FigureIcon",
  [TaskType.FORM_D]: "NewspaperIcon",
  [TaskType.EIN]: "NumberIcon",
  [TaskType.DELAWARE_TAX]: "BanknoteIcon",
  [TaskType.IRS_TAX]: "NewspaperIcon",
};

export const initialState: InitialStateSPV = {
  documentType: DocumentType.SERIES_LLC,
  seriesLLC: {
    masterSeriesLLC: "",
    protectedSeriesLLC: "",
    managerName: "",
    managerEmail: "",
  },
  standaloneLLC: {
    llcName: "",
    managerName: "",
    managerEmail: "",
  },
  operatingAgreement: {
    masterSeriesLLC: "Syndicate Series LLC", // TODO: use syndicate master series LLC @emery.muhozi
    protectedSeriesLLC: "Syndicate Protected Series LLC", // TODO: use syndicate protected series LLC @emery.muhozi
    carryPercentage: "",
    managementFee: "",
    managerName: "",
    managerState: "",
    managerEntityType: "individual", // TODO: update once backend is ready @victor.mutai
    managerEmail: "",
    advisorName: "test advisor", // TODO: update once backend is ready @victor.mutai
    advisorState: "AK", // TODO: update once backend is ready @victor.mutai
    advisorEntityType: "individual", // TODO: update once backend is ready @victor.mutai
    advisorEmail: "test@advisor.com", // TODO: update once backend is ready @victor.mutai
  },
  formId: {
    applicantType: "",
    applicantName: "",
    applicantMailingStreet: "",
    applicantMailingCity: "",
    applicantMailingStateCountry: "",
    applicantMailingZip: "",
    applicantPhone: "",
    taxIdentificationNumber: "",
    businessName: "",
    foreignName: "",
    businessStreet: "",
    businessCity: "",
    businessStateCountry: "",
    businessZip: "",
    stateIncorporation: "",
    contactNameEDGAR: "",
    contactStreetEDGAR: "",
    contactCityEDGAR: "",
    contactStateCountryEDGAR: "",
    contactZipEDGAR: "",
    contactPhoneEDGAR: "",
    contactEmail: "",
    contactNameSEC: "",
    contactStreetSEC: "",
    contactCitySEC: "",
    contactStateCountrySEC: "",
    contactZipSEC: "",
    contactPhoneSEC: "",
    managerTitle: "",
  },
  formD: {
    syndicateName: "",
    yearIncorporation: "",
    streetIssuer: "",
    cityIssuer: "",
    stateIssuer: "",
    zipIssuer: "",
    phoneIssuer: "",
    lastRelated1: "",
    firstRelated1: "",
    streetRelated1: "",
    cityRelated1: "",
    stateRelated1: "",
    zipRelated1: "",
    promoterRelated1: "",
    dateFirstSale: "",
    minimumInvestment: "",
    totalAmountSold: "",
    investorCount: "",
    managerTitle: "",
    managerName: "",
    managerEmail: "",
  },
  syndicateLegal: {
    fetchError: false,
    entityName: null,
    entityType: null,
    milestones: null,
    documents: null,
  },
  legalTab: {
    fetchError: false,
    entityName: "Syndicators Anonymous LLC",
    entityType: EntityType.PROTECTED_SERIES_LLC,
    milestones: [
      {
        type: MilestoneType.FORMATION,
        title: "Finish entity formation & setup",
        blockingMessage: "Pending entity selection",
        progress: Progress.LOCKED,
        progressPercentage: 0,
        tasks: [
          {
            type: TaskType.ENTITY_FORMATION,
            title: "File a Certificate of Formation",
            subtitle: "Create your legal entity",
            time: "2 min",
            fees: "$900+ filing & agent fees",
            progress: Progress.LOCKED,
            actionState: ActionState.COMPLETE_PREVIOUS_STEP,
            hellosignID: "agoirehio",
            icon: legalTaskIcon[TaskType.ENTITY_FORMATION],
          },
          {
            type: TaskType.OPERATING_SUBSCRIPTION,
            title: "Distribute the Operating & Subscription agreements",
            subtitle:
              "Define how this syndicate will run, who can join, and how",
            time: "5 min",
            fees: "",
            progress: Progress.LOCKED,
            actionState: ActionState.COMPLETE_PREVIOUS_STEP,
            hellosignID: "agoirehio",
            icon: legalTaskIcon[TaskType.OPERATING_SUBSCRIPTION],
          },
          {
            type: TaskType.COUNTERSIGN_SUBSCRIPTION,
            progress: Progress.LOCKED,
            title: "Countersign Subscription agreements",
            subtitle:
              "Review potential syndicate members and their subscription amounts to unlock their deposit ability",
            time: "1 min per member",
            fees: "",
            actionState: ActionState.COMPLETE_PREVIOUS_STEP,
            hellosignID: "agoirehio",
            icon: legalTaskIcon[TaskType.COUNTERSIGN_SUBSCRIPTION],
          },
        ],
      },
      {
        type: MilestoneType.SECURITIES,
        title: "File for exempt offering of securities ",
        blockingMessage: ActionState.PENDING_FORMATION,
        progress: Progress.LOCKED,
        progressPercentage: 0,
        tasks: [
          {
            type: TaskType.FORM_ID,
            progress: Progress.LOCKED,
            title: "Apply for EDGAR access",
            subtitle:
              "Obtain an access code to electronically file forms with the SEC",
            time: "3 min",
            fees: "",
            actionState: ActionState.PENDING_FORMATION,
            hellosignID: "agoirehio",
            icon: legalTaskIcon[TaskType.FORM_ID],
          },
          {
            type: TaskType.POWER_OF_ATTORNEY,
            progress: Progress.LOCKED,
            title: "Grant power of attorney",
            subtitle: "Allow Syndicate to help you file with the SEC",
            time: "1 min",
            fees: "",
            actionState: ActionState.PENDING_FORMATION,
            hellosignID: "agoirehio",
            icon: legalTaskIcon[TaskType.POWER_OF_ATTORNEY],
          },
          {
            type: TaskType.FORM_D,
            progress: Progress.LOCKED,
            title: "File Form D",
            subtitle:
              "Notify the SEC and your investors' states of an exempt offering of securities within 15 days of the first deposit",
            time: "10 min",
            fees: "$300+ state filing fee",
            actionState: ActionState.COMPLETE_PREVIOUS_STEP,
            hellosignID: "agoirehio",
            icon: legalTaskIcon[TaskType.FORM_D],
          },
        ],
      },
      {
        type: MilestoneType.TAX,
        title: "Prepare for tax season",
        blockingMessage: ActionState.PENDING_FORMATION,
        progress: Progress.LOCKED,
        progressPercentage: 0,
        tasks: [
          {
            type: TaskType.EIN,
            progress: Progress.LOCKED,
            title: "Apply for an EIN",
            subtitle:
              "Obtain an Employer Identification Number (EIN), required for banking and tax purposes",
            time: "",
            fees: "",
            actionState: ActionState.COMING_SOON,
            hellosignID: "agoirehio",
            icon: legalTaskIcon[TaskType.EIN],
          },
          {
            type: TaskType.DELAWARE_TAX,
            progress: Progress.LOCKED,
            title: "Pay annual tax",
            subtitle:
              "Pay your required yearly tax in Delaware. Due annually on Jun 1.",
            time: "",
            fees: "$300 annual tax",
            actionState: ActionState.COMING_SOON,
            hellosignID: "agoirehio",
            icon: legalTaskIcon[TaskType.DELAWARE_TAX],
          },
          {
            type: TaskType.IRS_TAX,
            progress: Progress.LOCKED,
            title: "File Schedule K-1",
            subtitle:
              "Report each partner's income, losses, and dividends to the IRS. Due annually on Mar 15.",
            time: "",
            fees: "",
            actionState: ActionState.COMING_SOON,
            hellosignID: "agoirehio",
            icon: legalTaskIcon[TaskType.IRS_TAX],
          },
        ],
      },
    ],
    documents: legalDocs,
  },
  existingEntity: {
    entityName: "",
    entityState: "",
    entityType: null,
    taskCompletion: {
      [TaskType.ENTITY_FORMATION]: false,
      [TaskType.OPERATING_SUBSCRIPTION]: false,
      [TaskType.FORM_ID]: false,
      [TaskType.FORM_D]: false,
    }
  }
};
