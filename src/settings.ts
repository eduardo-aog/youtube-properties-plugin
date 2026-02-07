import {App, PluginSettingTab, Setting} from "obsidian";
import MyPlugin from "./main";
import { FolderSuggest } from "suggests/suggester";

export interface YoutubePropertiesSettings {
	folder: string;
}

export const DEFAULT_SETTINGS: YoutubePropertiesSettings = {
	folder: ''
}

export class YoutubePropertiesSettingTab extends PluginSettingTab { // Class
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	} // Constructor

	display(): void { // Method
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
      		.setName('Note location')
      		.setDesc('New video notes will be created here')
      		.addText(text => text 
                .setPlaceholder('Folder1/folder2')
                .setValue(this.plugin.settings.folder)
                .onChange(async (value) => {
                    this.plugin.settings.folder = value.replace(/\/$/, ""); 
                    await this.plugin.saveSettings();
                })
            );
			new FolderSuggest(this.app, containerEl.querySelector('input') as HTMLInputElement); // Attach the folder suggester to the input

    }
}

