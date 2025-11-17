export interface CommandMetadata {
    title: string;
    category?: string;
    icon?: string;
}

export interface MenusViewMetadata {
    command: string;
    when: string;
    group: string;
}

export interface ActivityBarMetadata {
    id: string;
    title: string;
    icon: string;
}

export interface PanelMetadata {
    id: string;
    title: string;
    icon: string;
}