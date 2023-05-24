import { ExperienceLevel } from "./AssOfferCandidate";
import { Question } from "./Question";

export interface QuestionCategory{
    Id ?:number;
    name ?: string;
    questions ?:Question[] ;
    level ?: ExperienceLevel;
}

export enum QuestionnaireType{
    FOR_EMPLOYEES="FOR_EMPLOYEES",
    FOR_CANDIDATES="FOR_CANDIDATES"
}