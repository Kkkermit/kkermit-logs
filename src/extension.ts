"use strict";
import * as vscode from "vscode";
import { getTimestamp } from "./loggingEffect";

const insertText = (text: string) => {
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		vscode.window.showErrorMessage("Can't insert console.log because no document is open");
		return;
	}

	const selection = editor.selection;

	const range = new vscode.Range(selection.start, selection.end);

	editor.edit((editBuilder) => {
		editBuilder.replace(range, text);
	});
};

export function activate(context: vscode.ExtensionContext) {
	console.log("Javascript Quick Console is now active!");

	let disposable = vscode.commands.registerCommand("extension.log", () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const selection = editor.selection;
		const text = editor.document.getText(selection);

		text
			? vscode.commands.executeCommand("editor.action.insertLineAfter").then(() => {
					const logToInsert = `console.log("\x1b[35m", [${getTimestamp()}] >>> ${text}: ', ${text});`;
					insertText(logToInsert);
			  })
			: insertText("console.log();");
	});

	context.subscriptions.push(disposable);
	console.log(`\x1b[38;5;213m [2024-9-25 11:5:47] >>> disposable: `, disposable);
}

export function deactivate() {}
