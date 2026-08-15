export interface ReminderResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: ReminderData[];    
};

export interface ReminderData {
    _id: string;
    title: string;
    description: string;
    reminderAt: string;
    reminderBefore: number,
    status: string;
    userId: string;
    __v: number;
};