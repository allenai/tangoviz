const defaultData = { recentWorkspaces: [] };

export const userSessionDataKey = 'user-session-data';

export interface UserSessionData {
    recentWorkspaces: string[];
}

export const getUserSessionData = (): UserSessionData => {
    const storedUserSessionData = localStorage.getItem(userSessionDataKey);
    if (!storedUserSessionData) {
        return defaultData;
    }
    return JSON.parse(storedUserSessionData);
};

export const addWorkspace = (wid: string): void => {
    const storedUserSessionData = localStorage.getItem(userSessionDataKey);
    let updatedData: UserSessionData = defaultData;
    if (storedUserSessionData) {
        updatedData = JSON.parse(storedUserSessionData);
    }
    // remove whereever it may exist
    updatedData.recentWorkspaces = updatedData.recentWorkspaces.filter((id) => id !== wid);
    // then put at the top of the list
    updatedData.recentWorkspaces.unshift(wid);

    localStorage.setItem(userSessionDataKey, JSON.stringify(updatedData));
};

export const removeWorkspace = (wid: string): void => {
    const storedUserSessionData = localStorage.getItem(userSessionDataKey);
    let updatedData: UserSessionData = defaultData;
    if (storedUserSessionData) {
        updatedData = JSON.parse(storedUserSessionData);
    }
    // remove whereever it may exist
    updatedData.recentWorkspaces = updatedData.recentWorkspaces.filter((id) => id !== wid);

    localStorage.setItem(userSessionDataKey, JSON.stringify(updatedData));
};

export const clear = (): void => {
    localStorage.setItem(userSessionDataKey, JSON.stringify(defaultData));
};
