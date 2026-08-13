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

    latestActivities: {
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
    }[];
}