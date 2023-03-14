export interface PageRequest {
    current_page: number;
    page_size: number;
    sort_by: string;
    sort_descending: boolean;
    match?: string;
    status?: string;
}

export interface PageResponse<T> extends PageRequest {
    data: T[];
    total_items: number;
}
