import { BabySummary } from "./baby-summary.model";

export interface HomeDashboard extends HomeDashboardBabyDetails{
    babies: {
        id: string;
        name: string
    }[];
    remindersCount: number;

}

export interface HomeDashboardBabyDetails {
    feedingCount: number;
    diaperCount: number;

    latestGrowth: {
        measuredAt: string;
        weight: number;
        height: number;
    } | null;

    latestVaccination: {
        vaccineAt: string;
        name: string;
        doseNumber: number;
    } | null;

    sleep: {
        sessions: number;
        totalDuration: number;
    };

    latestActivities: LatestBabyActivitiesDetails[]
    
}

export interface LatestBabyActivitiesDetails {
    _id: string;
    wokeUpAt?: string | null;
    type?: string;
    durationMinutes?: number | null;
    weight?: number;
    height?: number;
    name?: string;
    doseNumber?: number;
    activityType: string;
    activityAt: string;
}

export interface TodayBabyActivities {
    baby: {
        id: string;
        name: string
    },
    activities: TodayActivities[]
}

export interface TodayActivities {
    _id: string;
    activityType: string;
    activityAt: string;
    sleptAt?: string;
    sleepNotes?: string;
    wokeUpAt?: string;
    wokeUpNotes?: string;
    durationMinutes?: number;
    feedingAt?: string;
    foodName?: string;
    quantity?: number;
    unit?: string;
    duration?: number;
    breastfeedingSide?: string;
    notes?: string;
    type?: string;
    changedAt?: string;
    vaccineAt?: string;
    name?: string;
    doseNumber?: number;
    measuredAt?: string;
    weight?: number;
    height?: number;
}

export interface BabyReport {
    period: string,
    baby: BabySummary,
    totalCount: {
        feeding: number;
        sleep: {
            count: number;
            duration: number;
        },
        diaper: number;
    },
    breakdown: {
        feeding: {
            _id: string;
            count: number;
            quantities?: {
                unit: string;
                quantity: number;
            }[]
        }[],
        sleep: {
            avgSleepPerDay: number
        },
        diaper: {
            _id: string,
            count: number
        }[],
        growth: {
            measuredAt: string,
            weight: number,
            height: number
        }[]
    }
}