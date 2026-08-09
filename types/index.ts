export interface OutputLine {
    text: string;
    class: string;
}

export interface VSCodeMessage {
    command: "appendOutput";
    text: string;
}
