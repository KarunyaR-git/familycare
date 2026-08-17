export interface ReminderRequest {
    title: string;
    description?: string;
    reminderAt: string;
    reminderBefore?: number,
    status?: string;
}

export interface UpdateReminderRequest {
    title?: string;
    description?: string;
    reminderAt?: string;
    reminderBefore?: number,
    status?: string;
}

export interface CreateOrUpdateReminderResponse extends ReminderData{
    createdA: string,
    updatedAt: string
}

export interface ReminderResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: ReminderData[];    
};

export interface ReminderData extends ReminderRequest{
    _id: string;
    userId: string;
    __v: number;
};