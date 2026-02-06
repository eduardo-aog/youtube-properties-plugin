import { AbstractInputSuggest, App, TFolder } from "obsidian";

export class FolderSuggest extends AbstractInputSuggest<TFolder> {
    textInputEl: HTMLInputElement; // Declare the text input element (must find out why)

    constructor(app: App, textInputEl: HTMLInputElement) {
        super(app, textInputEl);
        this.textInputEl = textInputEl;
    }

    getSuggestions(query: string): TFolder[] {
        const abstractFiles = this.app.vault.getAllLoadedFiles();
        const folders: TFolder[] = [];
        const lowerCaseQuery = query.toLowerCase();

        for (const file of abstractFiles) {
            if (file instanceof TFolder) {
                // Filter: must be a folder
                if (file.path.toLowerCase().contains(lowerCaseQuery)) {
                    folders.push(file);
                }
            }
        }
        return folders;
    }

    renderSuggestion(file: TFolder, el: HTMLElement): void {
        el.setText(file.path);
    }

    selectSuggestion(file: TFolder): void {
        // When user selects a suggestion this sets the input value
        this.textInputEl.value = file.path;
        this.textInputEl.trigger("input"); // Event for value changes
        this.close();
    }
}