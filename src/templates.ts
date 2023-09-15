export interface Template {
    filePattern: RegExp;
    template: [string, ...string[]];
    addExtraFileExtension?: string;
    extraFileContent?: string;
}

export const templates: Template[] = [
    {
        filePattern: new RegExp("\\.tsx$"),
        template: ['const React from "react";', '', 'export const ${fileName} = () => {', '\treturn <div className="${fileName-l}"></div>;', '};'],
        addExtraFileExtension: ".scss",
        extraFileContent: ".${fileName-l} {\n\n}"
    },
    {
        filePattern: new RegExp("\\.jsx$"),
        template: ['const React from "react";', '', 'export const ${fileName} = () => {', '\treturn <div className="${fileName-l}"></div>;', '};'],
        addExtraFileExtension: ".css"
    },
    {
        filePattern: new RegExp("\\.py$"),
        template: ['print("Hello World")'],
    }
];

export const filePatterns: RegExp[] = templates.map(template => template.filePattern);
