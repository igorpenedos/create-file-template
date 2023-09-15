import * as vscode from 'vscode';

import { templates, filePatterns, Template } from './templates';

const fileNameToReplace: string = "${fileName}";
const fileNameLowerToReplace: string = "${fileName-l}";

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.workspace.onDidCreateFiles((event: vscode.FileCreateEvent)=> {

			event.files.map(async (file) => {
				const pattern: RegExp | undefined = filePatterns.find(filePattern => filePattern.test(file.path));
						
				if (!pattern) { return; };
				
				const template: Template | undefined = templates.find(template => template.filePattern === pattern);

				if (!template) { return; };

				const fileName: string = file.path.split("/").pop()?.split(".")[0]!;
				const fileNameLowered: string = fileName?.charAt(0).toLowerCase()! + fileName?.slice(1)
				
				// Insert template code into newly created file 
				const textEdit = new vscode.WorkspaceEdit();
				const text = template.template.join("\n").replace(fileNameToReplace, fileName).replace(fileNameLowerToReplace, fileNameLowered);
				textEdit.insert(file, new vscode.Position(0,0), text);
				vscode.workspace.applyEdit(textEdit);

				// Create file with new file extension
				if (template.addExtraFileExtension){
					const path = file.fsPath;
					const newFileName = `${fileName}${template.addExtraFileExtension}`;
					const newFilePath = `${path.replace(/[^/\\]+$/, '')}${newFileName}`;
					const newFileContent = template.extraFileContent ? template.extraFileContent?.replace(fileNameToReplace, fileName).replace(fileNameLowerToReplace, fileNameLowered) : "";

					try {
						await vscode.workspace.fs.writeFile(vscode.Uri.file(newFilePath), Buffer.from(newFileContent, 'utf8'));
						vscode.window.showInformationMessage(`File "${newFileName}" created in the same path.`);
					} catch (error: any) {
						vscode.window.showErrorMessage(`Error creating file: ${error.message}`);
					}
				}
			});
		})
	);
}

export function deactivate() {}
